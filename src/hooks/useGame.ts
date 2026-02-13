import { useCallback, useEffect, useRef, useState } from 'react'
import { useGameStore, usePlayerStore } from '@/store'
import { getAudioService } from '@/services/audio'
import type { GameMode, GameState, GameSession } from '@/types'

interface UseGameOptions {
  mode: GameMode
  levelId?: string | null
  onGameEnd?: (session: GameSession) => void
  enableSound?: boolean
}

interface UseGameReturn {
  session: GameSession
  state: GameState
  start: () => void
  pause: () => void
  resume: () => void
  end: (victory: boolean) => void
  reset: () => void
  elapsedTime: number
}

/**
 * 游戏控制 Hook
 */
export function useGame(options: UseGameOptions): UseGameReturn {
  const { mode, levelId = null, onGameEnd, enableSound = true } = options
  const session = useGameStore((state) => state.session)
  const { startGame, pauseGame, resumeGame, endGame, resetGame } = useGameStore()
  const addExp = usePlayerStore((state) => state.addExp)
  const addCoins = usePlayerStore((state) => state.addCoins)
  const updateStats = usePlayerStore((state) => state.updateStats)

  const [elapsedTime, setElapsedTime] = useState(0)
  const startTimeRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const audioService = enableSound ? getAudioService() : null

  // 更新计时器
  useEffect(() => {
    if (session.state === 'playing') {
      startTimeRef.current = Date.now() - elapsedTime * 1000
      intervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [session.state])

  const start = useCallback(() => {
    setElapsedTime(0)
    startGame(mode, levelId)
  }, [mode, levelId, startGame])

  const pause = useCallback(() => {
    pauseGame()
  }, [pauseGame])

  const resume = useCallback(() => {
    resumeGame()
  }, [resumeGame])

  const end = useCallback(
    (victory: boolean) => {
      endGame(victory)
      audioService?.stopAll()

      // 更新玩家统计
      updateStats({
        totalGamesPlayed: usePlayerStore.getState().player.stats.totalGamesPlayed + 1,
        totalTimePlayed: usePlayerStore.getState().player.stats.totalTimePlayed + elapsedTime,
        totalWordsTyped:
          usePlayerStore.getState().player.stats.totalWordsTyped + session.wordsCompleted,
        totalCharactersTyped:
          usePlayerStore.getState().player.stats.totalCharactersTyped + session.charactersTyped,
        totalCorrectChars:
          usePlayerStore.getState().player.stats.totalCorrectChars + session.correctChars,
        maxCombo: Math.max(
          usePlayerStore.getState().player.stats.maxCombo,
          session.maxCombo
        ),
      })

      // 添加奖励
      if (victory) {
        addExp(100)
        addCoins(50)
        audioService?.playVictory()
      } else {
        audioService?.playGameOver()
      }

      onGameEnd?.(session)
    },
    [endGame, elapsedTime, session, updateStats, addExp, addCoins, audioService, onGameEnd]
  )

  const reset = useCallback(() => {
    resetGame()
    setElapsedTime(0)
  }, [resetGame])

  return {
    session,
    state: session.state,
    start,
    pause,
    resume,
    end,
    reset,
    elapsedTime,
  }
}
