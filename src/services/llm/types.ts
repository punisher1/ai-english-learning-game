import type { LLMProvider } from '@/types'

/** LLM提供商接口 */
export interface ILLMProvider {
  name: string
  generateText(prompt: string): Promise<string>
  generateWords(keys: string[], count: number, difficulty: string): Promise<string[]>
  generateSentence(difficulty: string): Promise<string>
  isAvailable(): Promise<boolean>
}

/** LLM服务配置 */
export interface LLMServiceConfig {
  provider: LLMProvider
  apiKey?: string
  baseUrl?: string
  model?: string
  cacheEnabled?: boolean
  timeout?: number
}

/** 缓存条目 */
interface CacheEntry {
  result: string
  timestamp: number
  ttl: number
}

/** LLM服务抽象类 */
export abstract class BaseLLMProvider implements ILLMProvider {
  abstract name: string
  protected config: LLMServiceConfig
  protected cache: Map<string, CacheEntry> = new Map()

  constructor(config: LLMServiceConfig) {
    this.config = config
  }

  abstract generateText(prompt: string): Promise<string>
  abstract generateWords(keys: string[], count: number, difficulty: string): Promise<string[]>
  abstract generateSentence(difficulty: string): Promise<string>
  abstract isAvailable(): Promise<boolean>

  protected getCached<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (entry && Date.now() - entry.timestamp < entry.ttl) {
      return JSON.parse(entry.result) as T
    }
    this.cache.delete(key)
    return null
  }

  protected setCache(key: string, result: unknown, ttl = 3600000): void {
    if (this.config.cacheEnabled !== false) {
      this.cache.set(key, {
        result: JSON.stringify(result),
        timestamp: Date.now(),
        ttl,
      })
    }
  }

  protected async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout = this.config.timeout || 30000
  ): Promise<Response> {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      return response
    } finally {
      clearTimeout(id)
    }
  }
}

/** Prompt模板 */
export const PromptTemplates = {
  generateWords: (keys: string[], count: number, difficulty: string) =>
    `Generate ${count} simple typing practice words using only these letters: ${keys.join(', ')}.
    Difficulty level: ${difficulty}.
    Return only a JSON array of strings, no explanation.
    Example: ["word1", "word2", "word3"]`,

  generateSentence: (difficulty: string) =>
    `Generate a simple English sentence for typing practice.
    Difficulty level: ${difficulty}.
    The sentence should be appropriate for children learning to type.
    Return only the sentence, no quotes or explanation.`,

  generateQuiz: (topic: string, difficulty: string) =>
    `Generate a simple ${topic} question for typing practice.
    Difficulty: ${difficulty}.
    Format as JSON: {"question": "...", "answer": "..."}
    The answer should be a single word or short phrase.`,

  adaptDifficulty: (currentLevel: number, performance: { wpm: number; accuracy: number }) =>
    `Based on typing performance:
    - Current level: ${currentLevel}
    - WPM: ${performance.wpm}
    - Accuracy: ${performance.accuracy}%

    Suggest the next difficulty level (1-10) for practice words.
    Return only a number.`,

  generateFeedback: (wpm: number, accuracy: number, mistakes: string[]) =>
    `Provide encouraging feedback for a child who just finished typing practice:
    - Speed: ${wpm} WPM
    - Accuracy: ${accuracy}%
    - Common mistakes: ${mistakes.join(', ') || 'none'}

    Keep it short (2-3 sentences), positive, and helpful.
    Use simple language suitable for children.`,
}
