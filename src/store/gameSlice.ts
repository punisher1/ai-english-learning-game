import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type {
  GameMode,
  GameSession,
  Entity,
  PlayerData,
  GameSettings,
  LevelProgress,
} from '@/types'

// ============ 游戏运行时 Store ============

interface GameStore {
  session: GameSession
  // Actions
  startGame: (mode: GameMode, levelId: string | null) => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: (victory: boolean) => void
  resetGame: () => void
  updateScore: (points: number) => void
  incrementCombo: () => void
  breakCombo: () => void
  recordKeystroke: (correct: boolean) => void
  completeWord: () => void
  setTimeRemaining: (time: number) => void
  setEntities: (entities: Entity[]) => void
  addEntity: (entity: Entity) => void
  removeEntity: (id: string) => void
}

const initialSession: GameSession = {
  state: 'idle',
  mode: 'gravity',
  levelId: null,
  score: 0,
  combo: 0,
  maxCombo: 0,
  wpm: 0,
  accuracy: 100,
  timeRemaining: 60,
  wordsCompleted: 0,
  charactersTyped: 0,
  correctChars: 0,
  startTime: 0,
  entities: [],
}

export const useGameStore = create<GameStore>()(
  immer((set) => ({
    session: initialSession,

    startGame: (mode, levelId) =>
      set((state) => {
        state.session = {
          ...initialSession,
          state: 'playing',
          mode,
          levelId,
          startTime: Date.now(),
        }
      }),

    pauseGame: () =>
      set((state) => {
        if (state.session.state === 'playing') {
          state.session.state = 'paused'
        }
      }),

    resumeGame: () =>
      set((state) => {
        if (state.session.state === 'paused') {
          state.session.state = 'playing'
        }
      }),

    endGame: (victory) =>
      set((state) => {
        state.session.state = victory ? 'victory' : 'gameOver'
      }),

    resetGame: () =>
      set((state) => {
        state.session = initialSession
      }),

    updateScore: (points) =>
      set((state) => {
        state.session.score += points
      }),

    incrementCombo: () =>
      set((state) => {
        state.session.combo += 1
        if (state.session.combo > state.session.maxCombo) {
          state.session.maxCombo = state.session.combo
        }
      }),

    breakCombo: () =>
      set((state) => {
        state.session.combo = 0
      }),

    recordKeystroke: (correct) =>
      set((state) => {
        state.session.charactersTyped += 1
        if (correct) {
          state.session.correctChars += 1
        }
        // Update accuracy
        state.session.accuracy =
          (state.session.correctChars / state.session.charactersTyped) * 100
        // Update WPM (words per minute = characters / 5 / minutes)
        const elapsedMinutes = (Date.now() - state.session.startTime) / 60000
        if (elapsedMinutes > 0) {
          state.session.wpm = Math.round(
            (state.session.correctChars / 5) / elapsedMinutes
          )
        }
      }),

    completeWord: () =>
      set((state) => {
        state.session.wordsCompleted += 1
      }),

    setTimeRemaining: (time) =>
      set((state) => {
        state.session.timeRemaining = time
      }),

    setEntities: (entities) =>
      set((state) => {
        state.session.entities = entities
      }),

    addEntity: (entity) =>
      set((state) => {
        state.session.entities.push(entity)
      }),

    removeEntity: (id) =>
      set((state) => {
        state.session.entities = state.session.entities.filter(
          (e) => e.id !== id
        )
      }),
  }))
)

// ============ 玩家数据 Store ============

interface PlayerStore {
  player: PlayerData
  // Actions
  setPlayerName: (name: string) => void
  addExp: (amount: number) => void
  addCoins: (amount: number) => void
  updateLevelProgress: (progress: LevelProgress) => void
  unlockItem: (itemId: string) => void
  addAchievement: (achievementId: string) => void
  updateStats: (stats: Partial<PlayerData['stats']>) => void
  resetPlayer: () => void
}

const initialPlayer: PlayerData = {
  id: crypto.randomUUID(),
  name: '冒险者',
  level: 1,
  exp: 0,
  coins: 0,
  stats: {
    totalWordsTyped: 0,
    totalCharactersTyped: 0,
    totalCorrectChars: 0,
    totalGamesPlayed: 0,
    totalTimePlayed: 0,
    averageWPM: 0,
    averageAccuracy: 100,
    maxCombo: 0,
    perfectLevels: 0,
  },
  levelProgress: {},
  unlockedItems: [],
  achievements: [],
  createdAt: Date.now(),
  lastPlayedAt: Date.now(),
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    immer((set) => ({
      player: initialPlayer,

      setPlayerName: (name) =>
        set((state) => {
          state.player.name = name
        }),

      addExp: (amount) =>
        set((state) => {
          state.player.exp += amount
          // Level up check (every 1000 exp)
          const newLevel = Math.floor(state.player.exp / 1000) + 1
          if (newLevel > state.player.level) {
            state.player.level = newLevel
          }
        }),

      addCoins: (amount) =>
        set((state) => {
          state.player.coins += amount
        }),

      updateLevelProgress: (progress) =>
        set((state) => {
          const existing = state.player.levelProgress[progress.levelId]
          if (!existing || progress.stars > existing.stars) {
            state.player.levelProgress[progress.levelId] = progress
          }
        }),

      unlockItem: (itemId) =>
        set((state) => {
          if (!state.player.unlockedItems.includes(itemId)) {
            state.player.unlockedItems.push(itemId)
          }
        }),

      addAchievement: (achievementId) =>
        set((state) => {
          if (!state.player.achievements.includes(achievementId)) {
            state.player.achievements.push(achievementId)
          }
        }),

      updateStats: (stats) =>
        set((state) => {
          Object.assign(state.player.stats, stats)
        }),

      resetPlayer: () =>
        set((state) => {
          state.player = {
            ...initialPlayer,
            id: state.player.id,
            createdAt: state.player.createdAt,
          }
        }),
    })),
    {
      name: 'typing-adventure-player',
    }
  )
)

// ============ 设置 Store ============

interface SettingsStore {
  settings: GameSettings
  // Actions
  updateSettings: (settings: Partial<GameSettings>) => void
  updateAudio: (audio: Partial<GameSettings['audio']>) => void
  updateLLM: (llm: Partial<GameSettings['llm']>) => void
  resetSettings: () => void
}

const initialSettings: GameSettings = {
  theme: 'dark',
  language: 'zh',
  audio: {
    masterVolume: 0.8,
    musicVolume: 0.5,
    sfxVolume: 0.7,
    muted: false,
  },
  llm: {
    provider: 'static',
    apiKey: '',
  },
  showKeyboardHints: true,
  showFingerGuide: true,
  difficulty: 'normal',
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    immer((set) => ({
      settings: initialSettings,

      updateSettings: (newSettings) =>
        set((state) => {
          Object.assign(state.settings, newSettings)
        }),

      updateAudio: (audio) =>
        set((state) => {
          Object.assign(state.settings.audio, audio)
        }),

      updateLLM: (llm) =>
        set((state) => {
          Object.assign(state.settings.llm, llm)
        }),

      resetSettings: () =>
        set((state) => {
          state.settings = initialSettings
        }),
    })),
    {
      name: 'typing-adventure-settings',
    }
  )
)
