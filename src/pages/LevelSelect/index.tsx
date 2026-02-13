import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePlayerStore } from '@/store'

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #818cf8, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const PageDescription = styled.p`
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: 2rem;
`

const WorldSection = styled.section`
  margin-bottom: 3rem;
`

const WorldHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const WorldIcon = styled.span`
  font-size: 2rem;
`

const WorldTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
`

const WorldDescription = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 0.875rem;
`

const LevelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`

const LevelCard = styled(motion.div)<{ $locked: boolean; $completed: boolean }>`
  background: rgba(30, 41, 59, 0.8);
  border: 2px solid
    ${({ $locked, $completed, theme }) =>
      $locked ? 'rgba(148, 163, 184, 0.2)' : $completed ? theme.colors.secondary.main : 'transparent'};
  border-radius: 1rem;
  padding: 1.25rem;
  position: relative;
  transition: all 0.3s ease;

  ${({ $locked, theme }) =>
    $locked
      ? `
    opacity: 0.6;
    pointer-events: none;
  `
      : `
    &:hover {
      transform: translateY(-4px);
      border-color: ${theme.colors.primary.main};
      box-shadow: 0 10px 30px rgba(79, 70, 229, 0.3);
    }
  `}
`

const LevelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`

const LevelNumber = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  background: rgba(79, 70, 229, 0.2);
  color: #818cf8;
  border-radius: 0.25rem;
`

const LevelMode = styled.span<{ $mode: string }>`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;

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
      default:
        return `background: rgba(148, 163, 184, 0.2); color: #94a3b8;`
    }
  }}
`

const LevelTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.25rem;
`

const LevelDescription = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: 0.75rem;
  line-height: 1.5;
`

const LevelMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.text.muted};
`

const StarRating = styled.div`
  display: flex;
  gap: 0.25rem;
`

const Star = styled.span<{ $filled: boolean }>`
  font-size: 1.25rem;
  opacity: ${({ $filled }) => ($filled ? 1 : 0.3)};
`

const LockOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 1rem;
  font-size: 2rem;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
`

// Level configurations
const worlds = [
  {
    id: 1,
    name: '键盘森林',
    icon: '🌲',
    description: '学习基础键位 (ASDF JKL;)',
    levels: [
      { id: '1-1', name: '左手入门', description: '学习左手指法 (ASDF)', mode: 'gravity' as const },
      { id: '1-2', name: '右手入门', description: '学习右手指法 (JKL;)', mode: 'gravity' as const },
      { id: '1-3', name: '双手配合', description: '基础键位综合练习', mode: 'gravity' as const },
    ],
  },
  {
    id: 2,
    name: '字母山谷',
    icon: '⛰️',
    description: '掌握全部字母键位',
    levels: [
      { id: '2-1', name: '上方字母', description: 'QWERTYUIOP 练习', mode: 'runner' as const },
      { id: '2-2', name: '下方字母', description: 'ZXCVBNM,. 练习', mode: 'runner' as const },
      { id: '2-3', name: '全字母综合', description: '所有字母键位混合', mode: 'runner' as const },
    ],
  },
  {
    id: 3,
    name: '数字海洋',
    icon: '🌊',
    description: '挑战数字与符号',
    levels: [
      { id: '3-1', name: '数字世界', description: '1234567890 练习', mode: 'bubble' as const },
      { id: '3-2', name: '符号天地', description: '常用符号练习', mode: 'bubble' as const },
      { id: '3-3', name: '综合训练', description: '字母+数字+符号', mode: 'bubble' as const },
    ],
  },
  {
    id: 4,
    name: 'BOSS城堡',
    icon: '🏰',
    description: '终极挑战',
    levels: [
      { id: '4-1', name: '初级BOSS', description: '简单词汇挑战', mode: 'boss' as const },
      { id: '4-2', name: '中级BOSS', description: '句子打字挑战', mode: 'boss' as const },
      { id: '4-3', name: '终极BOSS', description: '综合能力测试', mode: 'boss' as const },
    ],
  },
]

const modeLabels = {
  gravity: '重力下落',
  runner: '横向跑酷',
  bubble: '气泡上升',
  boss: 'BOSS问答',
}

export default function LevelSelectPage() {
  const player = usePlayerStore((state) => state.player)

  const isLevelUnlocked = (worldId: number, levelIndex: number) => {
    if (worldId === 1 && levelIndex === 0) return true

    // Check if previous level is completed
    if (levelIndex > 0) {
      const prevWorld = worlds.find((w) => w.id === worldId)
      if (prevWorld) {
        const prevLevel = prevWorld.levels[levelIndex - 1]
        return player.levelProgress[prevLevel.id]?.completed || false
      }
    }

    // Check if previous world's last level is completed
    if (worldId > 1) {
      const prevWorld = worlds.find((w) => w.id === worldId - 1)
      if (prevWorld) {
        const lastLevel = prevWorld.levels[prevWorld.levels.length - 1]
        return player.levelProgress[lastLevel.id]?.completed || false
      }
    }

    return false
  }

  const getLevelProgress = (levelId: string) => {
    return player.levelProgress[levelId]
  }

  return (
    <PageContainer>
      <PageTitle>选择关卡</PageTitle>
      <PageDescription>完成关卡解锁更多挑战，收集星星提升排名！</PageDescription>

      {worlds.map((world) => (
        <WorldSection key={world.id}>
          <WorldHeader>
            <WorldIcon>{world.icon}</WorldIcon>
            <div>
              <WorldTitle>{world.name}</WorldTitle>
              <WorldDescription>{world.description}</WorldDescription>
            </div>
          </WorldHeader>

          <LevelsGrid>
            {world.levels.map((level, index) => {
              const unlocked = isLevelUnlocked(world.id, index)
              const progress = getLevelProgress(level.id)
              const completed = progress?.completed || false

              return (
                <LevelCard
                  key={level.id}
                  $locked={!unlocked}
                  $completed={completed}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {unlocked ? (
                    <StyledLink to={`/game/${level.id}`}>
                      <LevelHeader>
                        <LevelNumber>{level.id}</LevelNumber>
                        <LevelMode $mode={level.mode}>
                          {modeLabels[level.mode]}
                        </LevelMode>
                      </LevelHeader>
                      <LevelTitle>{level.name}</LevelTitle>
                      <LevelDescription>{level.description}</LevelDescription>
                      <LevelMeta>
                        <span>🎯 目标: 30WPM</span>
                        <span>✨ 最高: {progress?.bestWPM || 0}WPM</span>
                      </LevelMeta>
                      <StarRating>
                        {[1, 2, 3].map((star) => (
                          <Star key={star} $filled={star <= (progress?.stars || 0)}>
                            ⭐
                          </Star>
                        ))}
                      </StarRating>
                    </StyledLink>
                  ) : (
                    <div>
                      <LevelHeader>
                        <LevelNumber>{level.id}</LevelNumber>
                        <LevelMode $mode={level.mode}>
                          {modeLabels[level.mode]}
                        </LevelMode>
                      </LevelHeader>
                      <LevelTitle>{level.name}</LevelTitle>
                      <LevelDescription>{level.description}</LevelDescription>
                      <LockOverlay>🔒</LockOverlay>
                    </div>
                  )}
                </LevelCard>
              )
            })}
          </LevelsGrid>
        </WorldSection>
      ))}
    </PageContainer>
  )
}
