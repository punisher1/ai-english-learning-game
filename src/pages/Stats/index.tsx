import styled from '@emotion/styled'
import { usePlayerStore } from '@/store'

const StatsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #818cf8, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
`

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #818cf8, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
`

const Section = styled.section`
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 1rem;
`

const LevelProgressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const LevelProgressItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const LevelName = styled.span`
  min-width: 80px;
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: 500;
`

const StarDisplay = styled.span`
  font-size: 1rem;
  min-width: 60px;
`

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`

const AchievementCard = styled.div<{ $unlocked: boolean }>`
  background: ${({ $unlocked }) => ($unlocked ? 'rgba(79, 70, 229, 0.2)' : 'rgba(30, 41, 59, 0.8)')};
  border: 1px solid
    ${({ $unlocked, theme }) =>
      $unlocked ? theme.colors.primary.main : 'rgba(148, 163, 184, 0.1)'};
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
  opacity: ${({ $unlocked }) => ($unlocked ? 1 : 0.5)};
`

const AchievementIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`

const AchievementName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
`

const allAchievements = [
  { id: 'first_win', name: '初次胜利', icon: '🏆' },
  { id: 'combo_10', name: '连击新手', icon: '🔥' },
  { id: 'combo_50', name: '连击达人', icon: '💥' },
  { id: 'combo_100', name: '连击大师', icon: '⚡' },
  { id: 'speed_30', name: '速度达人', icon: '💨' },
  { id: 'speed_50', name: '键盘飞人', icon: '🚀' },
  { id: 'accuracy_100', name: '完美准确', icon: '🎯' },
  { id: 'level_5', name: '冒险新手', icon: '⭐' },
  { id: 'level_10', name: '冒险高手', icon: '🌟' },
  { id: 'all_levels', name: '通关大师', icon: '👑' },
]

// Level names for progress display
const levelNames: Record<string, string> = {
  '1-1': '左手入门',
  '1-2': '右手入门',
  '1-3': '双手配合',
  '2-1': '上方字母',
  '2-2': '下方字母',
  '2-3': '全字母综合',
  '3-1': '数字世界',
  '3-2': '符号天地',
  '3-3': '综合训练',
  '4-1': '初级BOSS',
  '4-2': '中级BOSS',
  '4-3': '终极BOSS',
}

export default function StatsPage() {
  const player = usePlayerStore((state) => state.player)

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    }
    return `${minutes}分钟`
  }

  return (
    <StatsContainer>
      <PageTitle>📊 游戏统计</PageTitle>

      <StatsGrid>
        <StatCard>
          <StatValue>{player.stats.totalWordsTyped}</StatValue>
          <StatLabel>总打字数</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{player.stats.totalCharactersTyped}</StatValue>
          <StatLabel>总字符数</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{player.stats.averageWPM}</StatValue>
          <StatLabel>平均速度 (WPM)</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{player.stats.averageAccuracy.toFixed(0)}%</StatValue>
          <StatLabel>平均准确率</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{player.stats.maxCombo}</StatValue>
          <StatLabel>最大连击</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{player.stats.totalGamesPlayed}</StatValue>
          <StatLabel>游戏次数</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{formatTime(player.stats.totalTimePlayed)}</StatValue>
          <StatLabel>游戏时长</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{player.stats.perfectLevels}</StatValue>
          <StatLabel>完美通关</StatLabel>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionTitle>关卡进度</SectionTitle>
        <LevelProgressList>
          {Object.entries(levelNames).map(([levelId, name]) => {
            const progress = player.levelProgress[levelId]
            const stars = progress?.stars || 0
            const completed = progress?.completed || false

            return (
              <LevelProgressItem key={levelId}>
                <LevelName>{name}</LevelName>
                <StarDisplay>
                  {completed ? '⭐'.repeat(stars) + '☆'.repeat(3 - stars) : '🔒'}
                </StarDisplay>
                {completed && (
                  <>
                    <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                      {progress.bestWPM} WPM
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                      {progress.bestAccuracy.toFixed(0)}%
                    </span>
                  </>
                )}
              </LevelProgressItem>
            )
          })}
        </LevelProgressList>
      </Section>

      <Section>
        <SectionTitle>成就</SectionTitle>
        <AchievementGrid>
          {allAchievements.map((achievement) => {
            const unlocked = player.achievements.includes(achievement.id)
            return (
              <AchievementCard key={achievement.id} $unlocked={unlocked}>
                <AchievementIcon>{achievement.icon}</AchievementIcon>
                <AchievementName>{achievement.name}</AchievementName>
              </AchievementCard>
            )
          })}
        </AchievementGrid>
      </Section>
    </StatsContainer>
  )
}
