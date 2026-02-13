// ============ 游戏核心类型 ============

/** 游戏状态 */
export type GameState = 'idle' | 'playing' | 'paused' | 'victory' | 'gameOver'

/** 游戏模式 */
export type GameMode = 'gravity' | 'runner' | 'bubble' | 'boss'

/** 按键区域 (QWERTY键盘分区) */
export type FingerZone = 'leftPinky' | 'leftRing' | 'leftMiddle' | 'leftIndex' | 'thumbs' | 'rightIndex' | 'rightMiddle' | 'rightRing' | 'rightPinky'

/** 按键信息 */
export interface KeyInfo {
  char: string
  finger: FingerZone
  hand: 'left' | 'right'
  row: 'top' | 'home' | 'bottom' | 'number'
}

// ============ 关卡系统 ============

/** 关卡难度 */
export type Difficulty = 'easy' | 'medium' | 'hard' | 'boss'

/** 关卡配置 */
export interface LevelConfig {
  id: string
  name: string
  description: string
  difficulty: Difficulty
  mode: GameMode
  world: number // 1-4 世界
  stage: number // 1-3 关卡
  requiredKeys: string[] // 需要掌握的按键
  targetWPM: number // 目标速度
  targetAccuracy: number // 目标准确率
  timeLimit?: number // 时间限制(秒)
  enemyCount?: number // 敌人数量
  bossName?: string // BOSS名称
  rewards: LevelReward
  prerequisites: string[] // 前置关卡ID
}

/** 关卡奖励 */
export interface LevelReward {
  exp: number
  coins: number
  stars: number // 1-3星
  unlockItems?: string[]
}

/** 关卡进度 */
export interface LevelProgress {
  levelId: string
  completed: boolean
  stars: number
  bestWPM: number
  bestAccuracy: number
  attempts: number
  completedAt?: number
}

// ============ 游戏实体 ============

/** 游戏实体基础接口 */
export interface Entity {
  id: string
  x: number
  y: number
  width: number
  height: number
  active: boolean
}

/** 掉落单词 (重力模式) */
export interface FallingWord extends Entity {
  word: string
  typed: string
  speed: number
  color: string
  points: number
}

/** 跑道障碍物 (跑酷模式) */
export interface RunnerObstacle extends Entity {
  word: string
  typed: string
  lane: number // 0-2 跑道
  type: 'rock' | 'log' | 'enemy'
}

/** 气泡单词 (气泡模式) */
export interface BubbleWord extends Entity {
  word: string
  typed: string
  velocity: { x: number; y: number }
  size: number
  color: string
}

/** BOSS实体 */
export interface Boss extends Entity {
  name: string
  currentQuestion: QuizQuestion | null
  health: number
  maxHealth: number
  phase: number
}

/** 问答题 */
export interface QuizQuestion {
  id: string
  question: string
  answer: string
  options?: string[]
  type: 'typing' | 'choice'
}

// ============ 玩家数据 ============

/** 玩家统计数据 */
export interface PlayerStats {
  totalWordsTyped: number
  totalCharactersTyped: number
  totalCorrectChars: number
  totalGamesPlayed: number
  totalTimePlayed: number // 秒
  averageWPM: number
  averageAccuracy: number
  maxCombo: number
  perfectLevels: number
}

/** 玩家数据 */
export interface PlayerData {
  id: string
  name: string
  level: number
  exp: number
  coins: number
  stats: PlayerStats
  levelProgress: Record<string, LevelProgress>
  unlockedItems: string[]
  achievements: string[]
  createdAt: number
  lastPlayedAt: number
}

// ============ 游戏设置 ============

/** LLM提供商 */
export type LLMProvider = 'openai' | 'claude' | 'local' | 'static'

/** LLM配置 */
export interface LLMConfig {
  provider: LLMProvider
  apiKey: string
  baseUrl?: string
  model?: string
}

/** 音频设置 */
export interface AudioSettings {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  muted: boolean
}

/** 游戏设置 */
export interface GameSettings {
  theme: 'dark' | 'light' | 'auto'
  language: 'zh' | 'en'
  audio: AudioSettings
  llm: LLMConfig
  showKeyboardHints: boolean
  showFingerGuide: boolean
  difficulty: 'easy' | 'normal' | 'hard'
}

// ============ 游戏运行时状态 ============

/** 游戏会话状态 */
export interface GameSession {
  state: GameState
  mode: GameMode
  levelId: string | null
  score: number
  combo: number
  maxCombo: number
  wpm: number
  accuracy: number
  timeRemaining: number
  wordsCompleted: number
  charactersTyped: number
  correctChars: number
  startTime: number
  entities: Entity[]
}

/** 游戏事件 */
export type GameEventType =
  | 'wordComplete'
  | 'wordMiss'
  | 'comboBreak'
  | 'comboMilestone'
  | 'levelUp'
  | 'gameOver'
  | 'victory'
  | 'perfect'

export interface GameEvent {
  type: GameEventType
  data?: Record<string, unknown>
  timestamp: number
}
