import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const SpinnerContainer = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `--spinner-size: 24px; --border-width: 2px;`
      case 'lg':
        return `--spinner-size: 64px; --border-width: 5px;`
      default:
        return `--spinner-size: 40px; --border-width: 3px;`
    }
  }}
`

const Spinner = styled.div<{ $color: string }>`
  width: var(--spinner-size);
  height: var(--spinner-size);
  border: var(--border-width) solid rgba(148, 163, 184, 0.2);
  border-top-color: ${({ $color }) => $color};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

export function LoadingSpinner({ size = 'md', color = '#818cf8' }: LoadingSpinnerProps) {
  return (
    <SpinnerContainer $size={size}>
      <Spinner $color={color} />
    </SpinnerContainer>
  )
}
