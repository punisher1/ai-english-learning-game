import { useEffect, useRef, useCallback, useState } from 'react'
import styled from '@emotion/styled'
import { useGameStore } from '@/store'
import type { FallingWord } from '@/types'

const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`

interface GameCanvasProps {
  words: string[]
  onGameEnd: (victory: boolean) => void
  endless?: boolean
}

// Colors for different word types
const wordColors = [
  '#f87171', // red
  '#fb923c', // orange
  '#fbbf24', // yellow
  '#4ade80', // green
  '#60a5fa', // blue
  '#a78bfa', // purple
  '#f472b6', // pink
]

export function GameCanvas({ words, onGameEnd, endless = false }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const entitiesRef = useRef<FallingWord[]>([])
  const wordIndexRef = useRef(0)
  const lastSpawnRef = useRef(0)
  const gameStartTimeRef = useRef(Date.now())

  const session = useGameStore((state) => state.session)
  const { updateScore, incrementCombo, breakCombo, recordKeystroke, completeWord, setTimeRemaining, addEntity, removeEntity } = useGameStore()

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Initialize game entities
  const spawnWord = useCallback(() => {
    if (wordIndexRef.current >= words.length && !endless) return

    const word = endless
      ? words[Math.floor(Math.random() * words.length)]
      : words[wordIndexRef.current++]

    const entity: FallingWord = {
      id: crypto.randomUUID(),
      x: Math.random() * (dimensions.width - 150) + 50,
      y: -30,
      width: word.length * 20 + 20,
      height: 40,
      word,
      typed: '',
      speed: 1 + Math.random() * 0.5,
      color: wordColors[Math.floor(Math.random() * wordColors.length)],
      points: word.length * 10,
      active: true,
    }

    entitiesRef.current.push(entity)
    addEntity(entity)
  }, [words, dimensions, endless, addEntity])

  // Game loop
  useEffect(() => {
    if (session.state !== 'playing') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let elapsedTime = 0
    const gameDuration = 60000 // 60 seconds

    const gameLoop = () => {
      if (session.state !== 'playing') return

      const now = Date.now()
      elapsedTime = now - gameStartTimeRef.current

      // Update time remaining
      if (!endless) {
        const remaining = Math.max(0, Math.ceil((gameDuration - elapsedTime) / 1000))
        setTimeRemaining(remaining)

        if (remaining <= 0) {
          onGameEnd(true)
          return
        }
      }

      // Clear canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)'
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      // Draw grid lines (decorative)
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.1)'
      ctx.lineWidth = 1
      for (let x = 0; x < dimensions.width; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, dimensions.height)
        ctx.stroke()
      }
      for (let y = 0; y < dimensions.height; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(dimensions.width, y)
        ctx.stroke()
      }

      // Spawn words
      if (now - lastSpawnRef.current > 2000 && entitiesRef.current.length < 5) {
        spawnWord()
        lastSpawnRef.current = now
      }

      // Update and draw entities
      entitiesRef.current = entitiesRef.current.filter((entity) => {
        if (!entity.active) return false

        // Update position
        entity.y += entity.speed

        // Check if word fell off screen
        if (entity.y > dimensions.height - 60) {
          breakCombo()
          return false
        }

        // Draw word background
        const typedLength = entity.typed.length
        const isBeingTyped = typedLength > 0

        ctx.fillStyle = isBeingTyped ? 'rgba(79, 70, 229, 0.3)' : 'rgba(30, 41, 59, 0.8)'
        ctx.strokeStyle = entity.color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(entity.x - 10, entity.y - 20, entity.width, entity.height, 8)
        ctx.fill()
        ctx.stroke()

        // Draw typed portion
        if (typedLength > 0) {
          ctx.fillStyle = '#4ade80'
          ctx.font = 'bold 20px "Fira Code", monospace'
          ctx.fillText(entity.typed, entity.x, entity.y + 8)
        }

        // Draw remaining portion
        const remaining = entity.word.slice(typedLength)
        ctx.fillStyle = typedLength > 0 ? '#fbbf24' : '#f8fafc'
        ctx.font = 'bold 20px "Fira Code", monospace'
        const typedWidth = ctx.measureText(entity.typed).width
        ctx.fillText(remaining, entity.x + typedWidth, entity.y + 8)

        return true
      })

      // Draw danger zone
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)'
      ctx.fillRect(0, dimensions.height - 60, dimensions.width, 60)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, dimensions.height - 60)
      ctx.lineTo(dimensions.width, dimensions.height - 60)
      ctx.stroke()

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    gameStartTimeRef.current = Date.now()
    gameLoop()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [session.state, dimensions, spawnWord, setTimeRemaining, breakCombo, onGameEnd, endless])

  // Expose entities for typing input
  useEffect(() => {
    ;(window as any).__gameEntities = entitiesRef.current
    ;(window as any).__handleKeyPress = (key: string) => {
      const entities = entitiesRef.current

      // Find matching word
      for (const entity of entities) {
        if (!entity.active) continue

        const nextChar = entity.word[entity.typed.length]
        if (nextChar.toLowerCase() === key.toLowerCase()) {
          entity.typed += nextChar
          recordKeystroke(true)
          incrementCombo()

          // Check if word complete
          if (entity.typed === entity.word) {
            entity.active = false
            updateScore(entity.points * (1 + session.combo * 0.1))
            completeWord()
            removeEntity(entity.id)
          }

          return true
        }
      }

      // No match - wrong key
      recordKeystroke(false)
      breakCombo()
      return false
    }

    return () => {
      delete (window as any).__gameEntities
      delete (window as any).__handleKeyPress
    }
  }, [session.combo, updateScore, incrementCombo, breakCombo, recordKeystroke, completeWord, removeEntity])

  return (
    <CanvasContainer ref={containerRef}>
      <Canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
      />
    </CanvasContainer>
  )
}
