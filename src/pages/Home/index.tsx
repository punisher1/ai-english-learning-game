import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/common'
import { usePlayerStore } from '@/store'

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  padding: 2rem;
`

const HeroSection = styled(motion.div)`
  max-width: 800px;
`

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #818cf8 0%, #f472b6 50%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-bottom: 2rem;
  line-height: 1.8;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
`

const FeaturesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
  margin-top: 2rem;
`

const FeatureCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: left;
`

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
`

const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`

const FeatureDescription = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
  line-height: 1.6;
`

const StatsSection = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
  justify-content: center;
`

const StatItem = styled.div`
  text-align: center;
`

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.primary.light};
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
`

const features = [
  {
    icon: '🎮',
    title: '趣味游戏模式',
    description: '四种独特的游戏模式：重力下落、横向跑酷、气泡上升、BOSS问答，让打字练习不再枯燥！',
  },
  {
    icon: '⌨️',
    title: '专业指法训练',
    description: '从基础键位开始，循序渐进掌握正确的十指打字姿势，建立肌肉记忆。',
  },
  {
    icon: '🏆',
    title: '丰富关卡系统',
    description: '12个精心设计的关卡，三个世界等待探索，每关都有独特的挑战和奖励。',
  },
  {
    icon: '🤖',
    title: 'AI智能生成',
    description: '支持AI动态生成练习内容，根据你的水平智能调整难度，实现个性化学习。',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function HomePage() {
  const player = usePlayerStore((state) => state.player)
  const completedLevels = Object.values(player.levelProgress).filter((p) => p.completed).length

  return (
    <HomeContainer>
      <HeroSection
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title>欢迎来到打字冒险！</Title>
        <Subtitle>
          通过RPG冒险游戏学习打字，从指法入门到盲打高手。
          <br />
          和 {player.name} 一起踏上这段精彩的键盘之旅吧！
        </Subtitle>

        <ButtonGroup>
          <Link to="/levels">
            <Button size="lg" icon="🗺️">
              开始冒险
            </Button>
          </Link>
          <Link to="/endless">
            <Button size="lg" variant="secondary" icon="♾️">
              无尽模式
            </Button>
          </Link>
        </ButtonGroup>
      </HeroSection>

      <StatsSection>
        <StatItem>
          <StatValue>Lv.{player.level}</StatValue>
          <StatLabel>当前等级</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{completedLevels}/12</StatValue>
          <StatLabel>已完成关卡</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{player.stats.averageWPM}</StatValue>
          <StatLabel>平均速度(WPM)</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{player.stats.averageAccuracy.toFixed(0)}%</StatValue>
          <StatLabel>平均准确率</StatLabel>
        </StatItem>
      </StatsSection>

      <FeaturesGrid
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature) => (
          <FeatureCard key={feature.title} variants={itemVariants}>
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </HomeContainer>
  )
}
