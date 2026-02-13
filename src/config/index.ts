// Game configuration constants

export const GAME_CONFIG = {
  // Timing
  GAME_DURATION: 60, // seconds
  SPAWN_INTERVAL: 2000, // ms
  MIN_SPAWN_INTERVAL: 800, // ms

  // Word settings
  MAX_WORDS_ON_SCREEN: 5,
  WORD_FALL_SPEED: 1.5,
  WORD_POINTS_PER_CHAR: 10,
  COMBO_MULTIPLIER: 0.1,

  // Difficulty scaling
  DIFFICULTY_SCALE_FACTOR: 0.1,

  // Thresholds
  STAR_THRESHOLDS: {
    accuracy: [70, 85, 95],
    wpm: [20, 30, 40],
  },

  // Player
  EXP_PER_LEVEL: 1000,
  INITIAL_COINS: 0,

  // Canvas
  CANVAS_PADDING: 50,
  DANGER_ZONE_HEIGHT: 60,
} as const

// Keyboard layout configuration
export const KEYBOARD_LAYOUT = {
  rows: [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  ],
  homeRow: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
  fingerMap: {
    leftPinky: ['`', '1', 'q', 'a', 'z'],
    leftRing: ['2', 'w', 's', 'x'],
    leftMiddle: ['3', 'e', 'd', 'c'],
    leftIndex: ['4', '5', 'r', 't', 'f', 'g', 'v', 'b'],
    thumbs: [' '],
    rightIndex: ['6', '7', 'y', 'u', 'h', 'j', 'n', 'm'],
    rightMiddle: ['8', 'i', 'k', ','],
    rightRing: ['9', 'o', 'l', '.'],
    rightPinky: ['0', '-', '=', 'p', '[', ']', '\\', ';', "'", '/'],
  },
} as const

// Level mode configurations
export const MODE_CONFIG = {
  gravity: {
    name: '重力下落',
    description: '单词从上方掉落，在它们到达底部前输入！',
    icon: '⬇️',
    color: '#ef4444',
  },
  runner: {
    name: '横向跑酷',
    description: '障碍物从右侧逼近，快速输入来躲避！',
    icon: '🏃',
    color: '#22c55e',
  },
  bubble: {
    name: '气泡上升',
    description: '气泡从下方升起，在它们飘走前戳破！',
    icon: '🫧',
    color: '#3b82f6',
  },
  boss: {
    name: 'BOSS问答',
    description: '回答BOSS的问题来击败它！',
    icon: '👹',
    color: '#a855f7',
  },
} as const
