import styled from '@emotion/styled'
import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  showCloseButton?: boolean
}

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

const ModalContainer = styled(motion.div)<{ $size: 'sm' | 'md' | 'lg' }>`
  background: ${(props) => props.theme.colors.background.secondary};
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `width: 100%; max-width: 360px;`
      case 'lg':
        return `width: 100%; max-width: 800px;`
      default:
        return `width: 100%; max-width: 500px;`
    }
  }}
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
`

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin: 0;
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border-radius: 0.5rem;
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 1.25rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(148, 163, 184, 0.1);
    color: ${(props) => props.theme.colors.text.primary};
  }
`

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <ModalContainer
            $size={size}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || showCloseButton) && (
              <ModalHeader>
                <ModalTitle>{title}</ModalTitle>
                {showCloseButton && (
                  <CloseButton onClick={onClose} aria-label="关闭">
                    ×
                  </CloseButton>
                )}
              </ModalHeader>
            )}
            <ModalBody>{children}</ModalBody>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  )
}
