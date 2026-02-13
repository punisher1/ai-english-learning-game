import { get, set, del, keys } from 'idb-keyval'

/** 存储服务 - 使用 IndexedDB 进行持久化 */
export class StorageService {
  private prefix: string

  constructor(prefix = 'typing-adventure-') {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  /** 获取数据 */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await get(this.getKey(key))
      return value as T | null
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  }

  /** 设置数据 */
  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      await set(this.getKey(key), value)
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  }

  /** 删除数据 */
  async delete(key: string): Promise<boolean> {
    try {
      await del(this.getKey(key))
      return true
    } catch (error) {
      console.error('Storage delete error:', error)
      return false
    }
  }

  /** 清除所有数据 */
  async clear(): Promise<boolean> {
    try {
      const allKeys = await keys()
      for (const key of allKeys) {
        if (String(key).startsWith(this.prefix)) {
          await del(key)
        }
      }
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  }

  /** 获取所有键 */
  async getAllKeys(): Promise<string[]> {
    try {
      const allKeys = await keys()
      return allKeys
        .filter((key) => String(key).startsWith(this.prefix))
        .map((key) => String(key).replace(this.prefix, ''))
    } catch (error) {
      console.error('Storage getAllKeys error:', error)
      return []
    }
  }

  /** 检查键是否存在 */
  async has(key: string): Promise<boolean> {
    const value = await this.get(key)
    return value !== null && value !== undefined
  }
}

// 创建默认实例
export const storage = new StorageService()

// 导出便捷方法
export const storageGet = <T>(key: string) => storage.get<T>(key)
export const storageSet = <T>(key: string, value: T) => storage.set<T>(key, value)
export const storageDelete = (key: string) => storage.delete(key)
export const storageClear = () => storage.clear()
