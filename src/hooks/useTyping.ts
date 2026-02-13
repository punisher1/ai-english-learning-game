import { useState, useCallback } from 'react'
import { useGameStore } from '@/store'
import { getAudioService } from '@/services/audio'

interface UseTypingOptions {
  onCorrect?: () => void
  onWrong?: () => void
  onComplete?: (word: string) => void
  enableSound?: boolean
}

interface UseTypingReturn {
  currentInput: string
  currentWord: string | null
  handleKeyPress: (key: string) => boolean
  resetInput: () => void
  setInput: (input: string) => void
}

/**
 * 打字输入 Hook
 */
export function useTyping(options: UseTypingOptions = {}): UseTypingReturn {
  const { onCorrect, onWrong, onComplete, enableSound = true } = options
  const [currentInput, setCurrentInput] = useState('')
  const [currentWord, setCurrentWord] = useState<string | null>(null)
  const audioService = enableSound ? getAudioService() : null

  const session = useGameStore((state) => state.session)
  const { recordKeystroke, incrementCombo, breakCombo, completeWord, updateScore } = useGameStore()

  const handleKeyPress = useCallback(
    (key: string): boolean => {
      if (!currentWord) {
        // 从游戏实体中获取当前单词
        const entities = (window as any).__gameEntities
        if (entities && entities.length > 0) {
          for (const entity of entities) {
            if (entity.active) {
              const nextChar = entity.word[entity.typed.length]
              if (nextChar?.toLowerCase() === key.toLowerCase()) {
                setCurrentWord(entity.word)
                entity.typed += nextChar
                setCurrentInput((prev) => prev + key)
                recordKeystroke(true)
                incrementCombo()
                audioService?.playKeypress()
                onCorrect?.()

                if (entity.typed === entity.word) {
                  entity.active = false
                  updateScore(entity.points * (1 + session.combo * 0.1))
                  completeWord()
                  audioService?.playCorrect()
                  onComplete?.(entity.word)
                  setCurrentWord(null)
                  setCurrentInput('')
                }
                return true
              }
            }
          }
        }

        // 没有匹配的单词
        recordKeystroke(false)
        breakCombo()
        audioService?.playWrong()
        onWrong?.()
        return false
      }

      // 继续输入当前单词
      const nextChar = currentWord[currentInput.length]
      if (nextChar?.toLowerCase() === key.toLowerCase()) {
        setCurrentInput((prev) => prev + key)
        recordKeystroke(true)
        incrementCombo()
        audioService?.playKeypress()
        onCorrect?.()

        if (currentInput.length + 1 === currentWord.length) {
          updateScore(currentWord.length * 10 * (1 + session.combo * 0.1))
          completeWord()
          audioService?.playCorrect()
          onComplete?.(currentWord)
          setCurrentWord(null)
          setCurrentInput('')
        }
        return true
      }

      // 输入错误
      recordKeystroke(false)
      breakCombo()
      audioService?.playWrong()
      onWrong?.()
      return false
    },
    [currentWord, currentInput, recordKeystroke, incrementCombo, breakCombo, completeWord, updateScore, session.combo, audioService, onCorrect, onWrong, onComplete]
  )

  const resetInput = useCallback(() => {
    setCurrentInput('')
    setCurrentWord(null)
  }, [])

  const setInput = useCallback((input: string) => {
    setCurrentInput(input)
  }, [])

  return {
    currentInput,
    currentWord,
    handleKeyPress,
    resetInput,
    setInput,
  }
}
