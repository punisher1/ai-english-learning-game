import styled from '@emotion/styled'
import { useGameStore } from '@/store'
import { ProgressBar } from '@/components/common'

const HUDContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`

const StatCard = styled.div`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const StatIcon = styled.span`
  font-size: 1.25rem;
`

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.text.primary};
`

const ComboValue = styled(StatValue)<{ $active: boolean }>`
  color: ${({ $active, theme }) =>
    $active ? theme.colors.game.combo : theme.colors.text.muted};
  transition: all 0.2s ease;

  ${({ $active }) =>
    $active &&
    `
    text-shadow: 0 0 20px rgba(249, 115, 22, 0.5);
  `}
`

const AccuracyValue = styled(StatValue)`
  color: ${({ children }) => {
    const value = Number(children)
    if (value >= 95) return '#4ade80'
    if (value >= 85) return '#fbbf24'
    return '#f87171'
  }};
`

export function GameHUD() {
  const session = useGameStore((state) => state.session)

  const formatAccuracy = (accuracy: number) => {
    return `${accuracy.toFixed(0)}%`
  }

  return (
    <HUDContainer>
      <StatCard>
        <StatHeader>
          <StatIcon>⏱️</StatIcon>
          <StatLabel>时间</StatLabel>
        </StatHeader>
        <StatValue>{session.timeRemaining}s</StatValue>
        <ProgressBar
          value={session.timeRemaining}
          max={60}
          variant="timer"
          size="sm"
        />
      </StatCard>

      <StatCard>
        <StatHeader>
          <StatIcon>💎</StatIcon>
          <StatLabel>分数</StatLabel>
        </StatHeader>
        <StatValue>{Math.floor(session.score)}</StatValue>
      </StatCard>

      <StatCard>
        <StatHeader>
          <StatIcon>🔥</StatIcon>
          <StatLabel>连击</StatLabel>
        </StatHeader>
        <ComboValue $active={session.combo > 0}>
          {session.combo}x
        </ComboValue>
        <small style={{ color: '#64748b' }}>
          最高: {session.maxCombo}x
        </small>
      </StatCard>

      <StatCard>
        <StatHeader>
          <StatIcon>⚡</StatIcon>
          <StatLabel>速度</StatLabel>
        </StatHeader>
        <StatValue>{session.wpm} WPM</StatValue>
      </StatCard>

      <StatCard>
        <StatHeader>
          <StatIcon>🎯</StatIcon>
          <StatLabel>准确率</StatLabel>
        </StatHeader>
        <AccuracyValue>{formatAccuracy(session.accuracy)}</AccuracyValue>
        <ProgressBar
          value={session.accuracy}
          max={100}
          variant={session.accuracy >= 90 ? 'default' : session.accuracy >= 70 ? 'combo' : 'health'}
          size="sm"
        />
      </StatCard>

      <StatCard>
        <StatHeader>
          <StatIcon>📝</StatIcon>
          <StatLabel>单词</StatLabel>
        </StatHeader>
        <StatValue>{session.wordsCompleted}</StatValue>
      </StatCard>
    </HUDContainer>
  )
}
