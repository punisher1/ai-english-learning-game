import { useEffect, useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { useGameStore, usePlayerStore } from '@/store'
import { GameCanvas } from '@/components/game/GameCanvas'
import { TypingInput } from '@/components/game/TypingInput'
import { GameHUD } from '@/components/game/GameHUD'
import { Button } from '@/components/common'

const EndlessContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f97316, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const DifficultyBadge = styled.span<{ $level: number }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: rgba(249, 115, 22, 0.2);
  color: #fb923c;
`

const GameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 1rem;
  overflow: hidden;
  min-height: 400px;
  position: relative;
`

const StartOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  z-index: 100;
`

const GameOverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 100;
`

const GameOverTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.status.danger};
`

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  text-align: center;
`

const StatItem = styled.div`
  background: rgba(30, 41, 59, 0.8);
  padding: 1rem;
  border-radius: 0.5rem;
`

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.primary.light};
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`

// Generate random words for endless mode
const generateEndlessWords = (difficulty: number): string[] => {
  const allKeys = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const words: string[] = []
  const wordLength = Math.min(3 + Math.floor(difficulty / 5), 8)
  const wordCount = 30

  for (let i = 0; i < wordCount; i++) {
    let word = ''
    for (let j = 0; j < wordLength; j++) {
      word += allKeys[Math.floor(Math.random() * allKeys.length)]
    }
    words.push(word)
  }

  return words
}

export default function EndlessModePage() {
  const [difficulty, setDifficulty] = useState(1)
  const [isStarted, setIsStarted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)

  const session = useGameStore((state) => state.session)
  const { startGame, endGame, resetGame } = useGameStore()
  const addExp = usePlayerStore((state) => state.addExp)
  const addCoins = usePlayerStore((state) => state.addCoins)

  useEffect(() => {
    return () => {
      resetGame()
    }
  }, [resetGame])

  const handleStart = useCallback(() => {
    setIsStarted(true)
    setIsGameOver(false)
    setDifficulty(1)
    startGame('gravity', null)
  }, [startGame])

  const handleGameEnd = useCallback(
    (victory: boolean) => {
      if (!victory) {
        endGame(false)
        setIsGameOver(true)

        // Add rewards based on difficulty
        addExp(difficulty * 10)
        addCoins(difficulty * 5)
      } else {
        // Level up difficulty
        setDifficulty((d) => d + 1)
      }
    },
    [difficulty, endGame, addExp, addCoins]
  )

  const handleRestart = useCallback(() => {
    setIsGameOver(false)
    setDifficulty(1)
    resetGame()
    startGame('gravity', null)
  }, [resetGame, startGame])

  const words = generateEndlessWords(difficulty)

  return (
    <EndlessContainer>
      <Header>
        <Title>♾️ 无尽模式</Title>
        {isStarted && <DifficultyBadge $level={difficulty}>难度 Lv.{difficulty}</DifficultyBadge>}
      </Header>

      <GameHUD />

      <GameArea>
        <GameCanvas words={words} onGameEnd={handleGameEnd} endless />

        {session.state === 'playing' && <TypingInput />}

        {!isStarted && (
          <StartOverlay>
            <h2>无尽模式</h2>
            <p style={{ color: '#94a3b8', textAlign: 'center', maxWidth: '400px' }}>
              挑战你的极限！难度会随着你的进度逐渐提升，
              看看你能坚持多久！
            </p>
            <Button size="lg" onClick={handleStart} icon="🎮">
              开始挑战
            </Button>
          </StartOverlay>
        )}

        {isGameOver && (
          <GameOverOverlay>
            <GameOverTitle>游戏结束</GameOverTitle>
            <Stats>
              <StatItem>
                <StatValue>{session.score}</StatValue>
                <StatLabel>得分</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{difficulty}</StatValue>
                <StatLabel>最高难度</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{session.wpm}</StatValue>
                <StatLabel>速度(WPM)</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{session.accuracy.toFixed(0)}%</StatValue>
                <StatLabel>准确率</StatLabel>
              </StatItem>
            </Stats>
            <ButtonGroup>
              <Button onClick={handleRestart} icon="🔄">
                再来一次
              </Button>
            </ButtonGroup>
          </GameOverOverlay>
        )}
      </GameArea>
    </EndlessContainer>
  )
}
