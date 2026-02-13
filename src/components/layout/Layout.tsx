import { Outlet } from 'react-router-dom'
import styled from '@emotion/styled'
import { Header } from './Header'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`

export function Layout() {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  )
}
