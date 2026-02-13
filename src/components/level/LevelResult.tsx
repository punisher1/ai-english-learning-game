import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/common'

interface LevelResultProps {
  victory: boolean
  score: number
  wpm: number
  accuracy: number
  maxCombo: number
  wordsCompleted: number
  onRestart: () => void
  onBackToLevels: () => void
}

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

const ResultCard = styled(motion.div)`
  background: ${(props) => props.theme.colors.background.secondary};
  border: 2px solid
    ${(props) => (props.className === 'victory' ? props.theme.colors.secondary.main : props.theme.colors.status.danger)};
  border-radius: 1.5rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
`

const Title = styled.h2<{ $victory: boolean }>`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: ${({ $victory, theme }) =>
    $victory ? theme.colors.secondary.main : theme.colors.status.danger};
`

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatItem = styled.div`
  background: rgba(15, 23, 42, 0.5);
  border-radius: 0.75rem;
  padding: 1rem;
`

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.primary.light};
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-top: 0.25rem;
`

const StarRating = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`

const calculateStars = (accuracy: number, wpm: number): number => {
  if (accuracy >= 95 && wpm >= 40) return 3
  if (accuracy >= 85 && wpm >= 30) return 2
  if (accuracy >= 70) return 1
  return 0
}

export function LevelResult({
  victory,
  score,
  wpm,
  accuracy,
  maxCombo,
  wordsCompleted: _wordsCompleted,
  onRestart,
  onBackToLevels,
}: LevelResultProps) {
  const stars = victory ? calculateStars(accuracy, wpm) : 0

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ResultCard
          className={victory ? 'victory' : 'defeat'}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <Title $victory={victory}>
            {victory ? '🎉 胜利！' : '💀 失败'}
          </Title>
          <Subtitle>
            {victory
              ? '恭喜你完成了这个关卡！'
              : '别灰心，再试一次吧！'}
          </Subtitle>

          {victory && (
            <StarRating>
              {[1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.2 }}
                >
                  {i <= stars ? '⭐' : '☆'}
                </motion.span>
              ))}
            </StarRating>
          )}

          <StatsGrid>
            <StatItem>
              <StatValue>{Math.floor(score)}</StatValue>
              <StatLabel>得分</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{wpm}</StatValue>
              <StatLabel>速度 (WPM)</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{accuracy.toFixed(0)}%</StatValue>
              <StatLabel>准确率</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{maxCombo}x</StatValue>
              <StatLabel>最大连击</StatLabel>
            </StatItem>
          </StatsGrid>

          <ButtonGroup>
            <Button variant="outline" onClick={onBackToLevels}>
              返回关卡
            </Button>
            <Button onClick={onRestart} icon="🔄">
              再来一次
            </Button>
          </ButtonGroup>
        </ResultCard>
      </Overlay>
    </AnimatePresence>
  )
}
