import { BaseLLMProvider, PromptTemplates, type LLMServiceConfig } from './types'

/** OpenAI Provider */
export class OpenAIProvider extends BaseLLMProvider {
  name = 'OpenAI'
  private baseUrl = 'https://api.openai.com/v1'

  constructor(config: LLMServiceConfig) {
    super(config)
    if (config.baseUrl) {
      this.baseUrl = config.baseUrl
    }
  }

  async generateText(prompt: string): Promise<string> {
    const cacheKey = `openai-text-${prompt}`
    const cached = this.getCached<string>(cacheKey)
    if (cached) return cached

    const response = await this.fetchWithTimeout(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const result = data.choices[0]?.message?.content || ''

    this.setCache(cacheKey, result)
    return result
  }

  async generateWords(keys: string[], count: number, difficulty: string): Promise<string[]> {
    const cacheKey = `openai-words-${keys.join('')}-${count}-${difficulty}`
    const cached = this.getCached<string[]>(cacheKey)
    if (cached) return cached

    const prompt = PromptTemplates.generateWords(keys, count, difficulty)
    const response = await this.generateText(prompt)

    try {
      // Try to parse as JSON array
      const words = JSON.parse(response)
      if (Array.isArray(words)) {
        this.setCache(cacheKey, words)
        return words
      }
    } catch {
      // If parsing fails, split by newlines or commas
      const words = response
        .split(/[,\n]/)
        .map((w) => w.trim().replace(/["\[\]]/g, ''))
        .filter((w) => w.length > 0)
      this.setCache(cacheKey, words)
      return words
    }

    return []
  }

  async generateSentence(difficulty: string): Promise<string> {
    const cacheKey = `openai-sentence-${difficulty}`
    const cached = this.getCached<string>(cacheKey)
    if (cached) return cached

    const prompt = PromptTemplates.generateSentence(difficulty)
    const result = await this.generateText(prompt)
    const sentence = result.trim().replace(/^["']|["']$/g, '')

    this.setCache(cacheKey, sentence)
    return sentence
  }

  async isAvailable(): Promise<boolean> {
    if (!this.config.apiKey) return false

    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }
}
