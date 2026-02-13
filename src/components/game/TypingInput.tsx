import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

const InputContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent);
`

const InputWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
`

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`

const DisplayArea = styled.div`
  background: rgba(30, 41, 59, 0.9);
  border: 2px solid rgba(79, 70, 229, 0.5);
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: text;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${(props) => props.theme.colors.primary.light};
    box-shadow: 0 0 20px rgba(79, 70, 229, 0.3);
  }
`

const PromptText = styled.span`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 0.875rem;
`

const TypedText = styled.span`
  font-family: 'Fira Code', monospace;
  font-size: 1.5rem;
  color: #4ade80;
  letter-spacing: 2px;
`

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1.5rem;
  background: ${(props) => props.theme.colors.primary.light};
  animation: blink 1s infinite;
  margin-left: 2px;

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`

const KeyboardHint = styled.div`
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.text.muted};
`

export function TypingInput() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [currentInput, setCurrentInput] = useState('')

  useEffect(() => {
    // Auto-focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys
      if (e.ctrlKey || e.altKey || e.metaKey) return

      // Handle regular keys
      if (e.key.length === 1) {
        const handleKeyPress = (window as any).__handleKeyPress
        if (handleKeyPress) {
          const success = handleKeyPress(e.key)
          if (success) {
            setCurrentInput((prev) => prev + e.key)
          }
        }
      }

      // Handle backspace
      if (e.key === 'Backspace') {
        setCurrentInput((prev) => prev.slice(0, -1))
      }

      // Handle escape for pause
      if (e.key === 'Escape') {
        // Pause functionality handled elsewhere
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <InputContainer>
      <InputWrapper>
        <DisplayArea onClick={handleContainerClick}>
          <HiddenInput
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={() => {}}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <PromptText>输入:</PromptText>
          <TypedText>{currentInput}</TypedText>
          <Cursor />
        </DisplayArea>
        <KeyboardHint>
          直接键盘输入即可，按 ESC 暂停游戏
        </KeyboardHint>
      </InputWrapper>
    </InputContainer>
  )
}
