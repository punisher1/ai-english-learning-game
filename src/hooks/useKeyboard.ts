import { useEffect, useRef, useCallback } from 'react'

type KeyHandler = (event: KeyboardEvent) => void

interface UseKeyboardOptions {
  onKeyDown?: KeyHandler
  onKeyUp?: KeyHandler
  preventDefault?: boolean
  target?: 'window' | 'document'
}

/**
 * 键盘事件 Hook
 */
export function useKeyboard(options: UseKeyboardOptions): void {
  const { onKeyDown, onKeyUp, preventDefault = false, target = 'window' } = options
  const onKeyDownRef = useRef(onKeyDown)
  const onKeyUpRef = useRef(onKeyUp)

  // 更新 refs
  useEffect(() => {
    onKeyDownRef.current = onKeyDown
    onKeyUpRef.current = onKeyUp
  }, [onKeyDown, onKeyUp])

  useEffect(() => {
    const targetElement = target === 'window' ? window : document

    const handleKeyDown = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent
      if (preventDefault) {
        keyboardEvent.preventDefault()
      }
      onKeyDownRef.current?.(keyboardEvent)
    }

    const handleKeyUp = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent
      if (preventDefault) {
        keyboardEvent.preventDefault()
      }
      onKeyUpRef.current?.(keyboardEvent)
    }

    targetElement.addEventListener('keydown', handleKeyDown)
    targetElement.addEventListener('keyup', handleKeyUp)

    return () => {
      targetElement.removeEventListener('keydown', handleKeyDown)
      targetElement.removeEventListener('keyup', handleKeyUp)
    }
  }, [preventDefault, target])
}

/**
 * 快捷键 Hook
 */
export function useHotkey(
  key: string,
  callback: () => void,
  options: { ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean } = {}
): void {
  const { ctrlKey = false, shiftKey = false, altKey = false } = options

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const matchCtrl = ctrlKey ? event.ctrlKey || event.metaKey : true
      const matchShift = shiftKey ? event.shiftKey : true
      const matchAlt = altKey ? event.altKey : true

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        matchCtrl &&
        matchShift &&
        matchAlt
      ) {
        event.preventDefault()
        callback()
      }
    },
    [key, ctrlKey, shiftKey, altKey, callback]
  )

  useKeyboard({ onKeyDown: handleKeyDown })
}

/**
 * ESC 键 Hook
 */
export function useEscapeKey(callback: () => void): void {
  useHotkey('Escape', callback)
}
