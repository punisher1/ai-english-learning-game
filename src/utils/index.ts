/**
 * Calculate words per minute
 * @param correctChars - Number of correctly typed characters
 * @param elapsedMs - Time elapsed in milliseconds
 * @returns WPM value
 */
export function calculateWPM(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0
  const minutes = elapsedMs / 60000
  const words = correctChars / 5 // Standard: 5 characters = 1 word
  return Math.round(words / minutes)
}

/**
 * Calculate accuracy percentage
 * @param correct - Number of correct keystrokes
 * @param total - Total number of keystrokes
 * @returns Accuracy percentage
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100
  return (correct / total) * 100
}

/**
 * Calculate score with combo multiplier
 * @param basePoints - Base points for the action
 * @param combo - Current combo count
 * @returns Final score
 */
export function calculateScore(basePoints: number, combo: number): number {
  const comboMultiplier = 1 + combo * 0.1
  return Math.floor(basePoints * comboMultiplier)
}

/**
 * Calculate star rating based on performance
 * @param accuracy - Accuracy percentage
 * @param wpm - Words per minute
 * @returns Number of stars (0-3)
 */
export function calculateStars(accuracy: number, wpm: number): number {
  if (accuracy >= 95 && wpm >= 40) return 3
  if (accuracy >= 85 && wpm >= 30) return 2
  if (accuracy >= 70) return 1
  return 0
}

/**
 * Calculate experience needed for a level
 * @param level - Current level
 * @returns XP needed to reach next level
 */
export function calculateExpForLevel(level: number): number {
  return level * 1000
}

/**
 * Get level from total experience
 * @param totalExp - Total accumulated experience
 * @returns Current level
 */
export function getLevelFromExp(totalExp: number): number {
  return Math.floor(totalExp / 1000) + 1
}

/**
 * Generate a random word from a set of characters
 * @param chars - Available characters
 * @param length - Word length
 * @returns Random word
 */
export function generateRandomWord(chars: string[], length: number): string {
  let word = ''
  for (let i = 0; i < length; i++) {
    word += chars[Math.floor(Math.random() * chars.length)]
  }
  return word
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param array - Array to shuffle
 * @returns Shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Format time in seconds to MM:SS
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format large numbers with K/M suffix
 * @param num - Number to format
 * @returns Formatted string
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

/**
 * Get a random item from an array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Get finger for a given key
 */
export function getFingerForKey(key: string): string {
  const fingerMap: Record<string, string> = {
    // Left hand
    '`': 'leftPinky', '1': 'leftPinky', 'q': 'leftPinky', 'a': 'leftPinky', 'z': 'leftPinky',
    '2': 'leftRing', 'w': 'leftRing', 's': 'leftRing', 'x': 'leftRing',
    '3': 'leftMiddle', 'e': 'leftMiddle', 'd': 'leftMiddle', 'c': 'leftMiddle',
    '4': 'leftIndex', '5': 'leftIndex', 'r': 'leftIndex', 't': 'leftIndex',
    'f': 'leftIndex', 'g': 'leftIndex', 'v': 'leftIndex', 'b': 'leftIndex',
    // Thumbs
    ' ': 'thumbs',
    // Right hand
    '6': 'rightIndex', '7': 'rightIndex', 'y': 'rightIndex', 'u': 'rightIndex',
    'h': 'rightIndex', 'j': 'rightIndex', 'n': 'rightIndex', 'm': 'rightIndex',
    '8': 'rightMiddle', 'i': 'rightMiddle', 'k': 'rightMiddle', ',': 'rightMiddle',
    '9': 'rightRing', 'o': 'rightRing', 'l': 'rightRing', '.': 'rightRing',
    '0': 'rightPinky', '-': 'rightPinky', '=': 'rightPinky',
    'p': 'rightPinky', '[': 'rightPinky', ']': 'rightPinky', '\\': 'rightPinky',
    ';': 'rightPinky', "'": 'rightPinky', '/': 'rightPinky',
  }

  return fingerMap[key.toLowerCase()] || 'unknown'
}
