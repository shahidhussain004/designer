import { ExperienceLevel, JobCategory } from './apiTypes'

/**
 * Safely parse an unknown value into a JobCategory
 * Returns null if parsing fails
 */
export function parseCategory(value: unknown): JobCategory | null {
  if (typeof value !== 'object' || value === null) return null
  const obj = value as Record<string, unknown>
  const id = obj['id']
  const name = obj['name']

  if (typeof id !== 'number' && typeof id !== 'string') return null
  if (typeof name !== 'string') return null

  return {
    id: Number(id),
    name: name.trim(),
    ...(typeof obj['slug'] === 'string' && { slug: obj['slug'] }),
    ...(typeof obj['description'] === 'string' && { description: obj['description'] }),
  }
}

/**
 * Safely parse an unknown value into an ExperienceLevel
 * Returns null if parsing fails
 */
export function parseExperienceLevel(value: unknown): ExperienceLevel | null {
  if (typeof value !== 'object' || value === null) return null
  const obj = value as Record<string, unknown>
  const id = obj['id']
  const name = obj['name']

  if (typeof id !== 'number' && typeof id !== 'string') return null
  if (typeof name !== 'string') return null

  return {
    id: Number(id),
    name: name.trim(),
  }
}

/**
 * Safely parse an array of unknown values into JobCategories
 * Filters out invalid entries
 */
export function parseCategories(data: unknown): JobCategory[] {
  if (!Array.isArray(data)) return []
  return data
    .map(parseCategory)
    .filter((cat): cat is JobCategory => cat !== null)
}

/**
 * Safely parse an array of unknown values into ExperienceLevels
 * Filters out invalid entries
 */
export function parseExperienceLevels(data: unknown): ExperienceLevel[] {
  if (!Array.isArray(data)) return []
  return data
    .map(parseExperienceLevel)
    .filter((level): level is ExperienceLevel => level !== null)
}
