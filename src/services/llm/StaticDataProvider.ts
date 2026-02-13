import { BaseLLMProvider, type LLMServiceConfig } from './types'

/** 静态数据提供者 - 不需要API，使用预设数据 */
export class StaticDataProvider extends BaseLLMProvider {
  name = 'StaticData'

  private wordSets: Record<string, string[]> = {
    // 基础键位 (ASDF JKL;)
    'asdf': ['as', 'df', 'asd', 'fgh', 'sad', 'fad', 'dad', 'had', 'ask', 'gas'],
    'jkl': ['jk', 'kl', 'jkl', 'llk', 'kjl', 'ljk', 'hjk', 'jlk', 'klj', 'lkj'],
    'home': ['ask', 'dad', 'fad', 'had', 'lad', 'sad', 'all', 'fall', 'gall', 'halal', 'lass', 'pass', 'mass', 'jazz', 'kick', 'lick', 'sick', 'tick', 'walk', 'talk'],
    // 上方字母
    'top': ['wet', 'per', 'try', 'you', 'our', 'pot', 'top', 'pop', 'wow', 'row', 'tow', 'qop', 'wee', 'pee', 'tee', 'tree', 'free', 'grew', 'new', 'few'],
    // 下方字母
    'bottom': ['zinc', 'vim', 'zen', 'cave', 'maze', 'buzz', 'jazz', 'zoom', 'zone', 'zero', 'cruz', 'fuzz', 'haze', 'lazy', 'size', 'prize', 'glide', 'blade', 'crane', 'drake'],
    // 全字母
    'all': ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'way', 'who', 'boy', 'did', 'car', 'let', 'put', 'say', 'she', 'too', 'use', 'cat', 'dog', 'run', 'jump', 'play', 'game', 'word', 'type', 'fast', 'slow', 'home', 'work'],
    // 数字
    'numbers': ['123', '456', '789', '012', '345', '678', '901', '135', '246', '357', '468', '579', '680', '791', '802', '913', '024'],
    // 符号
    'symbols': ['!@#', '$%^', '&*()', '123!', 'abc@', 'test#', 'hello!', 'world@'],
  }

  private sentences: Record<string, string[]> = {
    easy: [
      'asdf jkl;',
      'asd fgh jkl',
      'the quick brown',
      'jump over the',
      'hello world',
      'a sad dad',
      'all fall down',
      'ask for help',
      'had a fall',
      'let us go',
    ],
    medium: [
      'the quick brown fox',
      'jumps over the lazy dog',
      'pack my box with five',
      'dozen liquor jugs',
      'how vexingly quick',
      'daft zebras jump',
      'the five boxing wizards',
      'jump quickly now',
      'sphinx of black quartz',
      'judge my vow',
    ],
    hard: [
      'the quick brown fox jumps over the lazy dog',
      'pack my box with five dozen liquor jugs',
      'how vexingly quick daft zebras jump',
      'the five boxing wizards jump quickly',
      'sphinx of black quartz judge my vow',
      'two driven jocks help fax my big quiz',
      'the jay pig fox zebra and my wolves',
      'quickly go and help them now',
    ],
  }

  constructor(config: LLMServiceConfig) {
    super(config)
  }

  async generateText(_prompt: string): Promise<string> {
    // 返回一个默认的响应
    return 'This is a static response for typing practice.'
  }

  async generateWords(keys: string[], count: number, difficulty: string): Promise<string[]> {
    const cacheKey = `static-words-${keys.join('')}-${count}-${difficulty}`
    const cached = this.getCached<string[]>(cacheKey)
    if (cached) return cached

    // 确定使用哪个单词集
    let wordSet: string[] = []

    // 检查键位组合
    const keyStr = keys.join('').toLowerCase()

    if (keyStr.includes('a') && keyStr.includes('s') && keyStr.includes('d') && keyStr.includes('f')) {
      if (keyStr.includes('j') && keyStr.includes('k') && keyStr.includes('l')) {
        wordSet = this.wordSets['home']
      } else {
        wordSet = this.wordSets['asdf']
      }
    } else if (keyStr.includes('j') && keyStr.includes('k') && keyStr.includes('l')) {
      wordSet = this.wordSets['jkl']
    } else if (keyStr.includes('q') || keyStr.includes('w') || keyStr.includes('e') || keyStr.includes('r') || keyStr.includes('t') || keyStr.includes('y') || keyStr.includes('u') || keyStr.includes('i') || keyStr.includes('o') || keyStr.includes('p')) {
      wordSet = this.wordSets['top']
    } else if (keyStr.includes('z') || keyStr.includes('x') || keyStr.includes('c') || keyStr.includes('v') || keyStr.includes('b') || keyStr.includes('n') || keyStr.includes('m')) {
      wordSet = this.wordSets['bottom']
    } else if (/[0-9]/.test(keyStr)) {
      wordSet = this.wordSets['numbers']
    } else if (/[!@#$%^&*()]/.test(keyStr)) {
      wordSet = this.wordSets['symbols']
    } else {
      wordSet = this.wordSets['all']
    }

    // 根据难度过滤
    let filtered = wordSet
    if (difficulty === 'easy') {
      filtered = wordSet.filter((w) => w.length <= 4)
    } else if (difficulty === 'hard') {
      filtered = wordSet.filter((w) => w.length >= 4)
    }

    // 随机选择单词
    const result: string[] = []
    const available = [...filtered]

    for (let i = 0; i < count && available.length > 0; i++) {
      const index = Math.floor(Math.random() * available.length)
      result.push(available[index])
      available.splice(index, 1)
    }

    this.setCache(cacheKey, result, 60000) // 缓存1分钟
    return result
  }

  async generateSentence(difficulty: string): Promise<string> {
    const cacheKey = `static-sentence-${difficulty}`
    const cached = this.getCached<string>(cacheKey)
    if (cached) return cached

    const sentences = this.sentences[difficulty] || this.sentences['medium']
    const result = sentences[Math.floor(Math.random() * sentences.length)]

    this.setCache(cacheKey, result, 60000)
    return result
  }

  async isAvailable(): Promise<boolean> {
    return true // 静态数据始终可用
  }
}
