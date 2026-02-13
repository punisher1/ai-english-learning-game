import styled from '@emotion/styled'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

const StyledButton = styled.button<{
  $variant: ButtonVariant
  $size: ButtonSize
  $fullWidth: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
  white-space: nowrap;

  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        `
      case 'lg':
        return `
          padding: 0.875rem 1.5rem;
          font-size: 1.125rem;
        `
      default:
        return `
          padding: 0.625rem 1.25rem;
          font-size: 1rem;
        `
    }
  }}

  /* Color variants */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary.main};
          color: white;
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.light};
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
          }
        `
      case 'secondary':
        return `
          background: ${theme.colors.secondary.main};
          color: white;
          &:hover:not(:disabled) {
            background: ${theme.colors.secondary.light};
            transform: translateY(-1px);
          }
        `
      case 'danger':
        return `
          background: ${theme.colors.status.danger};
          color: white;
          &:hover:not(:disabled) {
            opacity: 0.9;
          }
        `
      case 'outline':
        return `
          background: transparent;
          border-color: ${theme.colors.primary.main};
          color: ${theme.colors.primary.light};
          &:hover:not(:disabled) {
            background: rgba(79, 70, 229, 0.1);
          }
        `
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.text.secondary};
          &:hover:not(:disabled) {
            background: rgba(148, 163, 184, 0.1);
            color: ${theme.colors.text.primary};
          }
        `
    }
  }}

  /* Full width */
  ${({ $fullWidth }) =>
    $fullWidth &&
    `
    width: 100%;
  `}

  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* Active state */
  &:active:not(:disabled) {
    transform: translateY(0);
  }

  /* Focus state */
  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.primary.light};
    outline-offset: 2px;
  }
`

const LoadingDots = styled.span`
  display: inline-flex;
  gap: 2px;

  &::before,
  &::after {
    content: '';
    width: 6px;
    height: 6px;
    background: currentColor;
    border-radius: 50%;
    animation: pulse 1s infinite;
  }

  &::after {
    animation-delay: 0.3s;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
`

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      className={clsx(className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoadingDots /> : icon}
      {children}
    </StyledButton>
  )
}
