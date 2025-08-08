import { kv } from '@vercel/kv'

export async function readCache<T>(key: string): Promise<T | null> {
  try {
    const data = await kv.get(key)
    return data as T
  } catch (err) {
    console.error('Error reading cache:', err)
    return null
  }
}

export async function writeCache<T>(data: T, key: string) {
  try {
    await kv.set(key, data)
  } catch (err) {
    console.error('Error writing cache:', err)
  }
}
