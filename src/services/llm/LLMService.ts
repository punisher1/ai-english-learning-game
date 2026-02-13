import { type ILLMProvider, type LLMServiceConfig } from './types'
import { OpenAIProvider } from './OpenAIProvider'
import { StaticDataProvider } from './StaticDataProvider'

/** LLM服务 - 统一入口 */
export class LLMService {
  private provider: ILLMProvider
  private fallbackProvider: ILLMProvider
  private config: LLMServiceConfig

  constructor(config: LLMServiceConfig) {
    this.config = config
    this.provider = this.createProvider(config)
    this.fallbackProvider = new StaticDataProvider(config)
  }

  private createProvider(config: LLMServiceConfig): ILLMProvider {
    switch (config.provider) {
      case 'openai':
        return new OpenAIProvider(config)
      case 'claude':
        // TODO: Implement Claude provider
        return new StaticDataProvider(config)
      case 'local':
        // TODO: Implement local model provider
        return new StaticDataProvider(config)
      case 'static':
      default:
        return new StaticDataProvider(config)
    }
  }

  /** 更新配置 */
  updateConfig(config: Partial<LLMServiceConfig>): void {
    this.config = { ...this.config, ...config }
    if (config.provider !== undefined || config.apiKey !== undefined) {
      this.provider = this.createProvider(this.config)
    }
  }

  /** 获取当前提供商名称 */
  getProviderName(): string {
    return this.provider.name
  }

  /** 检查服务是否可用 */
  async isAvailable(): Promise<boolean> {
    try {
      return await this.provider.isAvailable()
    } catch {
      return false
    }
  }

  /** 生成练习单词 */
  async generateWords(
    keys: string[],
    count: number,
    difficulty: string
  ): Promise<string[]> {
    try {
      const available = await this.provider.isAvailable()
      if (available) {
        return await this.provider.generateWords(keys, count, difficulty)
      }
    } catch (error) {
      console.warn('Primary provider failed, using fallback:', error)
    }

    return this.fallbackProvider.generateWords(keys, count, difficulty)
  }

  /** 生成练习句子 */
  async generateSentence(difficulty: string): Promise<string> {
    try {
      const available = await this.provider.isAvailable()
      if (available) {
        return await this.provider.generateSentence(difficulty)
      }
    } catch (error) {
      console.warn('Primary provider failed, using fallback:', error)
    }

    return this.fallbackProvider.generateSentence(difficulty)
  }

  /** 生成文本 */
  async generateText(prompt: string): Promise<string> {
    try {
      const available = await this.provider.isAvailable()
      if (available) {
        return await this.provider.generateText(prompt)
      }
    } catch (error) {
      console.warn('Primary provider failed, using fallback:', error)
    }

    return this.fallbackProvider.generateText(prompt)
  }

  /** 生成反馈 */
  async generateFeedback(
    wpm: number,
    accuracy: number,
    mistakes: string[]
  ): Promise<string> {
    if (accuracy >= 95 && wpm >= 40) {
      return '太棒了！你的打字速度和准确率都非常出色，继续保持！'
    } else if (accuracy >= 85) {
      return '做得很好！你的准确率很高，继续练习可以让速度更快。'
    } else if (accuracy >= 70) {
      return '不错的尝试！多练习可以让你打字更快更准确。'
    } else if (mistakes.length > 0) {
      return `继续加油！注意这些键位：${mistakes.slice(0, 3).join('、')}，多练习几次就会熟悉的。`
    } else {
      return '继续练习，你会越来越好的！'
    }
  }
}

// 创建默认实例
let defaultService: LLMService | null = null

export function getLLMService(config?: LLMServiceConfig): LLMService {
  if (!defaultService || config) {
    defaultService = new LLMService(
      config || {
        provider: 'static',
        cacheEnabled: true,
      }
    )
  }
  return defaultService
}

export function updateLLMServiceConfig(config: Partial<LLMServiceConfig>): void {
  const service = getLLMService()
  service.updateConfig(config)
}

// 导出类型
export type { ILLMProvider, LLMServiceConfig } from './types'
