import '@emotion/react'

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: {
        main: string
        light: string
        dark: string
      }
      secondary: {
        main: string
        light: string
        dark: string
      }
      accent: {
        main: string
        light: string
      }
      status: {
        danger: string
        success: string
        warning: string
      }
      background: {
        primary: string
        secondary: string
        tertiary: string
        card: string
      }
      text: {
        primary: string
        secondary: string
        muted: string
      }
      game: {
        health: string
        mana: string
        exp: string
        gold: string
        combo: string
      }
    }
    spacing: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      '2xl': string
    }
    borderRadius: {
      sm: string
      md: string
      lg: string
      xl: string
      full: string
    }
    shadows: {
      sm: string
      md: string
      lg: string
      xl: string
      glow: string
    }
    transitions: {
      fast: string
      normal: string
      slow: string
    }
    fonts: {
      sans: string
      mono: string
    }
  }
}
