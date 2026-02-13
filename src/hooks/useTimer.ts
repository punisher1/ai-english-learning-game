import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTimerOptions {
  initialTime: number
  onEnd?: () => void
  autoStart?: boolean
}

interface UseTimerReturn {
  time: number
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: () => void
  setTime: (time: number) => void
}

/**
 * 计时器 Hook
 */
export function useTimer(options: UseTimerOptions): UseTimerReturn {
  const { initialTime, onEnd, autoStart = false } = options
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const onEndRef = useRef(onEnd)

  useEffect(() => {
    onEndRef.current = onEnd
  }, [onEnd])

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            onEndRef.current?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, time])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setTime(initialTime)
  }, [initialTime])

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    setTime,
  }
}

/**
 * 秒表 Hook (向上计时)
 */
export function useStopwatch(): {
  time: number
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: () => void
} {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setTime(0)
  }, [])

  return { time, isRunning, start, pause, reset }
}
