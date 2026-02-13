import { useEffect, useCallback, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { useGameStore, usePlayerStore } from '@/store'
import { GameCanvas } from '@/components/game/GameCanvas'
import { TypingInput } from '@/components/game/TypingInput'
import { GameHUD } from '@/components/game/GameHUD'
import { LevelResult } from '@/components/level/LevelResult'
import { Button } from '@/components/common'
import type { GameMode } from '@/types'

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const LevelInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const LevelTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
`

const GameModeLabel = styled.span<{ $mode: GameMode }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;

  ${({ $mode }) => {
    switch ($mode) {
      case 'gravity':
        return `background: rgba(239, 68, 68, 0.2); color: #f87171;`
      case 'runner':
        return `background: rgba(34, 197, 94, 0.2); color: #4ade80;`
      case 'bubble':
        return `background: rgba(59, 130, 246, 0.2); color: #60a5fa;`
      case 'boss':
        return `background: rgba(168, 85, 247, 0.2); color: #c084fc;`
    }
  }}
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
`

const PauseOverlay = styled.div`
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

const PauseTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.text.primary};
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`

// Level configurations
const levelConfigs: Record<string, { name: string; mode: GameMode; keys: string[] }> = {
  '1-1': { name: '左手入门', mode: 'gravity', keys: ['a', 's', 'd', 'f'] },
  '1-2': { name: '右手入门', mode: 'gravity', keys: ['j', 'k', 'l', ';'] },
  '1-3': { name: '双手配合', mode: 'gravity', keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'] },
  '2-1': { name: '上方字母', mode: 'runner', keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'] },
  '2-2': { name: '下方字母', mode: 'runner', keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'] },
  '2-3': { name: '全字母综合', mode: 'runner', keys: 'abcdefghijklmnopqrstuvwxyz'.split('') },
  '3-1': { name: '数字世界', mode: 'bubble', keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] },
  '3-2': { name: '符号天地', mode: 'bubble', keys: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'] },
  '3-3': { name: '综合训练', mode: 'bubble', keys: 'abcdefghijklmnopqrstuvwxyz1234567890'.split('') },
  '4-1': { name: '初级BOSS', mode: 'boss', keys: 'abcdefghijklmnopqrstuvwxyz'.split('') },
  '4-2': { name: '中级BOSS', mode: 'boss', keys: 'abcdefghijklmnopqrstuvwxyz'.split('') },
  '4-3': { name: '终极BOSS', mode: 'boss', keys: 'abcdefghijklmnopqrstuvwxyz'.split('') },
}

// Generate words for practice
const generateWords = (keys: string[], count: number): string[] => {
  const words: string[] = []
  const wordPatterns = [
    (k: string[]) => k.slice(0, 2).join(''),
    (k: string[]) => k.slice(0, 3).join(''),
    (k: string[]) => k.slice(0, 4).join(''),
    (k: string[]) => k[Math.floor(Math.random() * k.length)].repeat(2),
  ]

  for (let i = 0; i < count; i++) {
    const pattern = wordPatterns[Math.floor(Math.random() * wordPatterns.length)]
    const shuffled = [...keys].sort(() => Math.random() - 0.5)
    words.push(pattern(shuffled))
  }

  return words
}

export default function GamePage() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const [showResult, setShowResult] = useState(false)

  const session = useGameStore((state) => state.session)
  const { startGame, resumeGame, endGame, resetGame } = useGameStore()
  const updateLevelProgress = usePlayerStore((state) => state.updateLevelProgress)
  const addExp = usePlayerStore((state) => state.addExp)
  const addCoins = usePlayerStore((state) => state.addCoins)

  const levelConfig = levelId ? levelConfigs[levelId] : null

  useEffect(() => {
    if (levelConfig) {
      startGame(levelConfig.mode, levelId || null)
    }

    return () => {
      resetGame()
    }
  }, [levelId, levelConfig, startGame, resetGame])

  const handleGameEnd = useCallback(
    (victory: boolean) => {
      endGame(victory)

      if (levelId && victory) {
        // Calculate stars based on performance
        const stars = session.accuracy >= 95 ? 3 : session.accuracy >= 85 ? 2 : 1

        // Update progress
        updateLevelProgress({
          levelId,
          completed: true,
          stars,
          bestWPM: Math.max(session.wpm, usePlayerStore.getState().player.levelProgress[levelId]?.bestWPM || 0),
          bestAccuracy: Math.max(session.accuracy, usePlayerStore.getState().player.levelProgress[levelId]?.bestAccuracy || 0),
          attempts: (usePlayerStore.getState().player.levelProgress[levelId]?.attempts || 0) + 1,
          completedAt: Date.now(),
        })

        // Add rewards
        addExp(100 * stars)
        addCoins(50 * stars)
      }

      setShowResult(true)
    },
    [levelId, session, endGame, updateLevelProgress, addExp, addCoins]
  )

  const handleRestart = useCallback(() => {
    setShowResult(false)
    resetGame()
    if (levelConfig) {
      startGame(levelConfig.mode, levelId || null)
    }
  }, [levelConfig, levelId, resetGame, startGame])

  const handleBackToLevels = useCallback(() => {
    navigate('/levels')
  }, [navigate])

  if (!levelConfig) {
    return (
      <GameContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>关卡不存在</h2>
          <Button onClick={() => navigate('/levels')}>返回关卡选择</Button>
        </div>
      </GameContainer>
    )
  }

  const practiceWords = generateWords(levelConfig.keys, 20)

  return (
    <GameContainer>
      <GameHeader>
        <LevelInfo>
          <LevelTitle>{levelConfig.name}</LevelTitle>
          <GameModeLabel $mode={levelConfig.mode}>
            {levelConfig.mode === 'gravity' && '重力下落'}
            {levelConfig.mode === 'runner' && '横向跑酷'}
            {levelConfig.mode === 'bubble' && '气泡上升'}
            {levelConfig.mode === 'boss' && 'BOSS问答'}
          </GameModeLabel>
        </LevelInfo>
        <Button variant="ghost" onClick={() => navigate('/levels')}>
          返回
        </Button>
      </GameHeader>

      <GameHUD />

      <GameArea style={{ position: 'relative' }}>
        <GameCanvas
          words={practiceWords}
          onGameEnd={handleGameEnd}
        />

        {session.state === 'playing' && (
          <TypingInput />
        )}

        {session.state === 'paused' && (
          <PauseOverlay>
            <PauseTitle>游戏暂停</PauseTitle>
            <ButtonGroup>
              <Button onClick={resumeGame} icon="▶️">
                继续游戏
              </Button>
              <Button variant="outline" onClick={handleBackToLevels}>
                退出关卡
              </Button>
            </ButtonGroup>
          </PauseOverlay>
        )}
      </GameArea>

      {showResult && (
        <LevelResult
          victory={session.state === 'victory'}
          score={session.score}
          wpm={session.wpm}
          accuracy={session.accuracy}
          maxCombo={session.maxCombo}
          wordsCompleted={session.wordsCompleted}
          onRestart={handleRestart}
          onBackToLevels={handleBackToLevels}
        />
      )}
    </GameContainer>
  )
}
