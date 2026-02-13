import { useState } from 'react'
import styled from '@emotion/styled'
import { useSettingsStore, usePlayerStore } from '@/store'
import { Button, Modal } from '@/components/common'
import type { LLMProvider } from '@/types'

const SettingsContainer = styled.div`
  max-width: 600px;
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

const SettingsSection = styled.section`
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);

  &:last-child {
    border-bottom: none;
  }
`

const SettingLabel = styled.div`
  display: flex;
  flex-direction: column;
`

const SettingName = styled.span`
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: 500;
`

const SettingDescription = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text.secondary};
`

const Slider = styled.input`
  width: 120px;
  accent-color: ${(props) => props.theme.colors.primary.main};
`

const Toggle = styled.button<{ $active: boolean }>`
  width: 48px;
  height: 24px;
  border-radius: 12px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary.main : 'rgba(148, 163, 184, 0.3)'};
  position: relative;
  transition: background 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: ${({ $active }) => ($active ? '26px' : '2px')};
    transition: left 0.2s ease;
  }
`

const Select = styled.select`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
  }
`

const Input = styled.input`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 0.875rem;
  width: 200px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary.main};
  }
`

const DangerZone = styled(SettingsSection)`
  border-color: rgba(239, 68, 68, 0.3);
`

const DangerTitle = styled(SectionTitle)`
  color: ${(props) => props.theme.colors.status.danger};
`

export default function SettingsPage() {
  const settings = useSettingsStore((state) => state.settings)
  const updateSettings = useSettingsStore((state) => state.updateSettings)
  const updateAudio = useSettingsStore((state) => state.updateAudio)
  const updateLLM = useSettingsStore((state) => state.updateLLM)
  const resetSettings = useSettingsStore((state) => state.resetSettings)

  const player = usePlayerStore((state) => state.player)
  const setPlayerName = usePlayerStore((state) => state.setPlayerName)
  const resetPlayer = usePlayerStore((state) => state.resetPlayer)

  const [showResetModal, setShowResetModal] = useState(false)
  const [playerNameInput, setPlayerNameInput] = useState(player.name)

  const handleSavePlayerName = () => {
    if (playerNameInput.trim()) {
      setPlayerName(playerNameInput.trim())
    }
  }

  const handleResetProgress = () => {
    resetPlayer()
    setShowResetModal(false)
  }

  return (
    <SettingsContainer>
      <PageTitle>⚙️ 设置</PageTitle>

      {/* Player Settings */}
      <SettingsSection>
        <SectionTitle>👤 玩家信息</SectionTitle>
        <SettingRow>
          <SettingLabel>
            <SettingName>玩家名称</SettingName>
            <SettingDescription>在游戏中显示的名称</SettingDescription>
          </SettingLabel>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Input
              value={playerNameInput}
              onChange={(e) => setPlayerNameInput(e.target.value)}
              placeholder="输入名称"
            />
            <Button size="sm" onClick={handleSavePlayerName}>
              保存
            </Button>
          </div>
        </SettingRow>
        <SettingRow>
          <SettingLabel>
            <SettingName>当前等级</SettingName>
            <SettingDescription>经验等级 (每1000经验升1级)</SettingDescription>
          </SettingLabel>
          <span style={{ color: '#818cf8', fontWeight: 600 }}>Lv.{player.level}</span>
        </SettingRow>
      </SettingsSection>

      {/* Audio Settings */}
      <SettingsSection>
        <SectionTitle>🔊 音频设置</SectionTitle>
        <SettingRow>
          <SettingLabel>
            <SettingName>静音</SettingName>
            <SettingDescription>关闭所有声音</SettingDescription>
          </SettingLabel>
          <Toggle
            $active={settings.audio.muted}
            onClick={() => updateAudio({ muted: !settings.audio.muted })}
          />
        </SettingRow>
        <SettingRow>
          <SettingLabel>
            <SettingName>主音量</SettingName>
            <SettingDescription>整体音量大小</SettingDescription>
          </SettingLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={settings.audio.masterVolume * 100}
            onChange={(e) => updateAudio({ masterVolume: Number(e.target.value) / 100 })}
          />
        </SettingRow>
        <SettingRow>
          <SettingLabel>
            <SettingName>音效音量</SettingName>
            <SettingDescription>游戏音效大小</SettingDescription>
          </SettingLabel>
          <Slider
            type="range"
            min="0"
            max="100"
            value={settings.audio.sfxVolume * 100}
            onChange={(e) => updateAudio({ sfxVolume: Number(e.target.value) / 100 })}
          />
        </SettingRow>
      </SettingsSection>

      {/* Game Settings */}
      <SettingsSection>
        <SectionTitle>🎮 游戏设置</SectionTitle>
        <SettingRow>
          <SettingLabel>
            <SettingName>显示键盘提示</SettingName>
            <SettingDescription>显示当前需要按的键位</SettingDescription>
          </SettingLabel>
          <Toggle
            $active={settings.showKeyboardHints}
            onClick={() => updateSettings({ showKeyboardHints: !settings.showKeyboardHints })}
          />
        </SettingRow>
        <SettingRow>
          <SettingLabel>
            <SettingName>显示手指指引</SettingName>
            <SettingDescription>高亮提示使用哪个手指</SettingDescription>
          </SettingLabel>
          <Toggle
            $active={settings.showFingerGuide}
            onClick={() => updateSettings({ showFingerGuide: !settings.showFingerGuide })}
          />
        </SettingRow>
        <SettingRow>
          <SettingLabel>
            <SettingName>难度</SettingName>
            <SettingDescription>游戏整体难度</SettingDescription>
          </SettingLabel>
          <Select
            value={settings.difficulty}
            onChange={(e) => updateSettings({ difficulty: e.target.value as 'easy' | 'normal' | 'hard' })}
          >
            <option value="easy">简单</option>
            <option value="normal">普通</option>
            <option value="hard">困难</option>
          </Select>
        </SettingRow>
      </SettingsSection>

      {/* LLM Settings */}
      <SettingsSection>
        <SectionTitle>🤖 AI设置</SectionTitle>
        <SettingRow>
          <SettingLabel>
            <SettingName>LLM提供商</SettingName>
            <SettingDescription>选择内容生成服务</SettingDescription>
          </SettingLabel>
          <Select
            value={settings.llm.provider}
            onChange={(e) => updateLLM({ provider: e.target.value as LLMProvider })}
          >
            <option value="static">静态数据 (无需API)</option>
            <option value="openai">OpenAI</option>
            <option value="claude">Claude</option>
            <option value="local">本地模型</option>
          </Select>
        </SettingRow>
        {settings.llm.provider !== 'static' && (
          <>
            <SettingRow>
              <SettingLabel>
                <SettingName>API Key</SettingName>
                <SettingDescription>你的API密钥</SettingDescription>
              </SettingLabel>
              <Input
                type="password"
                value={settings.llm.apiKey}
                onChange={(e) => updateLLM({ apiKey: e.target.value })}
                placeholder="输入API Key"
              />
            </SettingRow>
            {settings.llm.provider === 'local' && (
              <SettingRow>
                <SettingLabel>
                  <SettingName>API地址</SettingName>
                  <SettingDescription>本地模型服务地址</SettingDescription>
                </SettingLabel>
                <Input
                  value={settings.llm.baseUrl || ''}
                  onChange={(e) => updateLLM({ baseUrl: e.target.value })}
                  placeholder="http://localhost:11434"
                />
              </SettingRow>
            )}
          </>
        )}
      </SettingsSection>

      {/* Danger Zone */}
      <DangerZone>
        <DangerTitle>⚠️ 危险区域</DangerTitle>
        <SettingRow>
          <SettingLabel>
            <SettingName>重置设置</SettingName>
            <SettingDescription>恢复所有设置为默认值</SettingDescription>
          </SettingLabel>
          <Button variant="outline" size="sm" onClick={resetSettings}>
            重置设置
          </Button>
        </SettingRow>
        <SettingRow>
          <SettingLabel>
            <SettingName>重置进度</SettingName>
            <SettingDescription>清除所有游戏进度和数据</SettingDescription>
          </SettingLabel>
          <Button variant="danger" size="sm" onClick={() => setShowResetModal(true)}>
            重置进度
          </Button>
        </SettingRow>
      </DangerZone>

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="确认重置"
      >
        <p style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>
          确定要重置所有游戏进度吗？此操作不可撤销，你的等级、金币、关卡进度等所有数据都将被清除。
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setShowResetModal(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={handleResetProgress}>
            确认重置
          </Button>
        </div>
      </Modal>
    </SettingsContainer>
  )
}
