import styled from '@emotion/styled'
import clsx from 'clsx'

type ProgressBarVariant = 'default' | 'health' | 'mana' | 'exp' | 'combo' | 'timer'

interface ProgressBarProps {
  value: number
  max?: number
  variant?: ProgressBarVariant
  showLabel?: boolean
  label?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

const ProgressContainer = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `--bar-height: 6px;`
      case 'lg':
        return `--bar-height: 16px;`
      default:
        return `--bar-height: 10px;`
    }
  }}
`

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
`

const Label = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  font-weight: 500;
`

const ValueLabel = styled.span`
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: 600;
`

const Track = styled.div`
  height: var(--bar-height);
  background: rgba(148, 163, 184, 0.2);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
`

const Fill = styled.div<{
  $percentage: number
  $variant: ProgressBarVariant
  $animated: boolean
}>`
  height: 100%;
  width: ${({ $percentage }) => Math.min(100, Math.max(0, $percentage))}%;
  border-radius: 9999px;
  transition: width 0.3s ease;
  position: relative;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'health':
        return `
          background: linear-gradient(90deg, #ef4444, #f87171);
        `
      case 'mana':
        return `
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
        `
      case 'exp':
        return `
          background: linear-gradient(90deg, #a855f7, #c084fc);
        `
      case 'combo':
        return `
          background: linear-gradient(90deg, #f97316, #fb923c);
        `
      case 'timer':
        return `
          background: linear-gradient(90deg, #10b981, #34d399);
        `
      default:
        return `
          background: linear-gradient(90deg, ${theme.colors.primary.main}, ${theme.colors.primary.light});
        `
    }
  }}

  ${({ $animated }) =>
    $animated &&
    `
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `}
`

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  showLabel = false,
  label,
  size = 'md',
  animated = false,
  className,
}: ProgressBarProps) {
  const percentage = (value / max) * 100

  return (
    <ProgressContainer $size={size} className={clsx(className)}>
      {showLabel && (
        <LabelContainer>
          <Label>{label}</Label>
          <ValueLabel>
            {value}/{max}
          </ValueLabel>
        </LabelContainer>
      )}
      <Track>
        <Fill $percentage={percentage} $variant={variant} $animated={animated} />
      </Track>
    </ProgressContainer>
  )
}
