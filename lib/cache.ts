import fs from 'fs'
import path from 'path'

const CACHE_PATH = path.join(process.cwd(), 'cache.json')

export function readCache<T>(): T | null {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const data = fs.readFileSync(CACHE_PATH, 'utf-8')
      return JSON.parse(data) as T
    }
    return null
  } catch (err) {
    console.error('Error reading cache:', err)
    return null
  }
}

export function writeCache<T>(data: T) {
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error writing cache:', err)
  }
}
