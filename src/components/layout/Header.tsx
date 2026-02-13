import styled from '@emotion/styled'
import { Link, useLocation } from 'react-router-dom'
import { usePlayerStore } from '@/store'

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #818cf8, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;

  &:hover {
    opacity: 0.9;
  }
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? '#818cf8' : '#94a3b8')};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  position: relative;

  &:hover {
    color: #818cf8;
  }

  ${({ $active }) =>
    $active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: #818cf8;
      border-radius: 1px;
    }
  `}
`

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const PlayerStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #94a3b8;
`

const StatIcon = styled.span`
  font-size: 1rem;
`

const PlayerLevel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(79, 70, 229, 0.2);
  border-radius: 9999px;
  font-size: 0.875rem;
  color: #818cf8;
  font-weight: 600;
`

const PlayerName = styled.span`
  color: #f8fafc;
  font-weight: 500;
`

export function Header() {
  const location = useLocation()
  const player = usePlayerStore((state) => state.player)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <HeaderContainer>
      <Logo to="/">⌨️ 打字冒险</Logo>

      <Nav>
        <NavLink to="/" $active={isActive('/')}>
          首页
        </NavLink>
        <NavLink to="/levels" $active={isActive('/levels')}>
          关卡
        </NavLink>
        <NavLink to="/endless" $active={isActive('/endless')}>
          无尽模式
        </NavLink>
        <NavLink to="/stats" $active={isActive('/stats')}>
          统计
        </NavLink>
      </Nav>

      <PlayerInfo>
        <PlayerStat>
          <StatIcon>🪙</StatIcon>
          {player.coins}
        </PlayerStat>
        <PlayerLevel>
          <span>Lv.{player.level}</span>
          <PlayerName>{player.name}</PlayerName>
        </PlayerLevel>
        <NavLink to="/settings" $active={isActive('/settings')}>
          ⚙️
        </NavLink>
      </PlayerInfo>
    </HeaderContainer>
  )
}
