import { Howl, Howler } from 'howler'
import type { AudioSettings } from '@/types'

/** 音效类型 */
export type SoundType =
  | 'keypress'
  | 'correct'
  | 'wrong'
  | 'combo'
  | 'comboBreak'
  | 'levelComplete'
  | 'gameOver'
  | 'victory'
  | 'buttonClick'
  | 'notification'

/** 音频服务 */
export class AudioService {
  private sounds: Map<SoundType, Howl> = new Map()
  private settings: AudioSettings
  private muted: boolean = false

  constructor(settings: AudioSettings) {
    this.settings = settings
    this.initSounds()
  }

  private initSounds(): void {
    // 初始化音效 - 使用内置的简单音效或空音效
    // 在实际项目中，这些应该是真实的音频文件
    const soundConfigs: Partial<Record<SoundType, { src: string[]; volume: number }>> = {
      keypress: { src: ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'], volume: 0.1 },
      correct: { src: ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'], volume: 0.3 },
      wrong: { src: ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'], volume: 0.3 },
      combo: { src: ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'], volume: 0.5 },
      levelComplete: { src: ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'], volume: 0.6 },
      victory: { src: ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'], volume: 0.7 },
      gameOver: { src: ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'], volume: 0.5 },
      buttonClick: { src: ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'], volume: 0.2 },
    }

    for (const [type, config] of Object.entries(soundConfigs)) {
      if (config) {
        this.sounds.set(type as SoundType, new Howl({
          src: config.src,
          volume: config.volume * this.settings.sfxVolume * this.settings.masterVolume,
          preload: true,
        }))
      }
    }
  }

  /** 更新设置 */
  updateSettings(settings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...settings }
    this.applyVolume()
  }

  /** 应用音量设置 */
  private applyVolume(): void {
    Howler.volume(this.settings.muted || this.muted ? 0 : this.settings.masterVolume)

    this.sounds.forEach((sound, type) => {
      const baseVolume = type === 'keypress' ? 0.1 : type === 'buttonClick' ? 0.2 : 0.5
      sound.volume(baseVolume * this.settings.sfxVolume * this.settings.masterVolume)
    })
  }

  /** 静音 */
  mute(): void {
    this.muted = true
    Howler.mute(true)
  }

  /** 取消静音 */
  unmute(): void {
    this.muted = false
    if (!this.settings.muted) {
      Howler.mute(false)
    }
  }

  /** 切换静音状态 */
  toggleMute(): boolean {
    if (this.muted) {
      this.unmute()
    } else {
      this.mute()
    }
    return this.muted
  }

  /** 播放音效 */
  play(type: SoundType): void {
    if (this.settings.muted || this.muted) return

    const sound = this.sounds.get(type)
    if (sound) {
      sound.play()
    }
  }

  /** 停止音效 */
  stop(type: SoundType): void {
    const sound = this.sounds.get(type)
    if (sound) {
      sound.stop()
    }
  }

  /** 停止所有音效 */
  stopAll(): void {
    this.sounds.forEach((sound) => sound.stop())
  }

  /** 播放按键音 */
  playKeypress(): void {
    this.play('keypress')
  }

  /** 播放正确音 */
  playCorrect(): void {
    this.play('correct')
  }

  /** 播放错误音 */
  playWrong(): void {
    this.play('wrong')
  }

  /** 播放连击音 */
  playCombo(): void {
    this.play('combo')
  }

  /** 播放关卡完成音 */
  playLevelComplete(): void {
    this.play('levelComplete')
  }

  /** 播放胜利音 */
  playVictory(): void {
    this.play('victory')
  }

  /** 播放游戏结束音 */
  playGameOver(): void {
    this.play('gameOver')
  }

  /** 销毁服务 */
  destroy(): void {
    this.sounds.forEach((sound) => sound.unload())
    this.sounds.clear()
  }
}

// 创建默认实例
let defaultService: AudioService | null = null

export function getAudioService(settings?: AudioSettings): AudioService {
  if (!defaultService) {
    defaultService = new AudioService(
      settings || {
        masterVolume: 0.8,
        musicVolume: 0.5,
        sfxVolume: 0.7,
        muted: false,
      }
    )
  } else if (settings) {
    defaultService.updateSettings(settings)
  }
  return defaultService
}

export function destroyAudioService(): void {
  if (defaultService) {
    defaultService.destroy()
    defaultService = null
  }
}
