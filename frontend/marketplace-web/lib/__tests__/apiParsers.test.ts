import {
    parseCategories,
    parseCategory,
    parseExperienceLevel,
    parseExperienceLevels,
} from '../apiParsers'

describe('apiParsers', () => {
  describe('parseCategory', () => {
    it('should parse a valid category object', () => {
      const input = { id: 1, name: 'Web Development', slug: 'web-dev', description: 'Web dev jobs' }
      const result = parseCategory(input)
      expect(result).toEqual({
        id: 1,
        name: 'Web Development',
        slug: 'web-dev',
        description: 'Web dev jobs',
      })
    })

    it('should parse a category without optional fields', () => {
      const input = { id: 2, name: 'Design' }
      const result = parseCategory(input)
      expect(result).toEqual({ id: 2, name: 'Design' })
    })

    it('should convert string id to number', () => {
      const input = { id: '3', name: 'Mobile Dev' }
      const result = parseCategory(input)
      expect(result).toEqual({ id: 3, name: 'Mobile Dev' })
    })

    it('should trim name whitespace', () => {
      const input = { id: 1, name: '  UI/UX  ' }
      const result = parseCategory(input)
      expect(result?.name).toBe('UI/UX')
    })

    it('should return null for invalid id', () => {
      const input = { id: 'invalid', name: 'Design' }
      const result = parseCategory(input)
      expect(result).toBeNull()
    })

    it('should return null for missing id', () => {
      const input = { name: 'Design' }
      const result = parseCategory(input)
      expect(result).toBeNull()
    })

    it('should return null for missing name', () => {
      const input = { id: 1 }
      const result = parseCategory(input)
      expect(result).toBeNull()
    })

    it('should return null for non-string name', () => {
      const input = { id: 1, name: 123 }
      const result = parseCategory(input)
      expect(result).toBeNull()
    })

    it('should return null for null input', () => {
      const result = parseCategory(null)
      expect(result).toBeNull()
    })

    it('should return null for non-object input', () => {
      expect(parseCategory('string')).toBeNull()
      expect(parseCategory(123)).toBeNull()
      expect(parseCategory(undefined)).toBeNull()
    })
  })

  describe('parseExperienceLevel', () => {
    it('should parse a valid experience level object', () => {
      const input = { id: 1, name: 'Beginner' }
      const result = parseExperienceLevel(input)
      expect(result).toEqual({ id: 1, name: 'Beginner' })
    })

    it('should convert string id to number', () => {
      const input = { id: '2', name: 'Intermediate' }
      const result = parseExperienceLevel(input)
      expect(result).toEqual({ id: 2, name: 'Intermediate' })
    })

    it('should return null for invalid id', () => {
      const input = { id: 'invalid', name: 'Expert' }
      const result = parseExperienceLevel(input)
      expect(result).toBeNull()
    })

    it('should return null for missing name', () => {
      const input = { id: 1 }
      const result = parseExperienceLevel(input)
      expect(result).toBeNull()
    })

    it('should return null for non-object input', () => {
      expect(parseExperienceLevel('string')).toBeNull()
      expect(parseExperienceLevel(null)).toBeNull()
    })
  })

  describe('parseCategories', () => {
    it('should parse an array of valid categories', () => {
      const input = [
        { id: 1, name: 'Web' },
        { id: 2, name: 'Design' },
      ]
      const result = parseCategories(input)
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ id: 1, name: 'Web' })
      expect(result[1]).toEqual({ id: 2, name: 'Design' })
    })

    it('should filter out invalid categories', () => {
      const input = [
        { id: 1, name: 'Web' },
        { id: 'invalid', name: 'Design' },
        { id: 3, name: 'Mobile' },
      ]
      const result = parseCategories(input)
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
      expect(result[1].id).toBe(3)
    })

    it('should return empty array for empty input', () => {
      const result = parseCategories([])
      expect(result).toEqual([])
    })

    it('should return empty array for non-array input', () => {
      expect(parseCategories('string')).toEqual([])
      expect(parseCategories(null)).toEqual([])
      expect(parseCategories({})).toEqual([])
    })

    it('should handle mixed valid and invalid entries', () => {
      const input = [
        { id: 1, name: 'Web' },
        null,
        { id: 2 }, // missing name
        { id: 3, name: 'Mobile' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as const as any
      const result = parseCategories(input)
      expect(result).toHaveLength(2)
      expect(result.map((c) => c.id)).toEqual([1, 3])
    })
  })

  describe('parseExperienceLevels', () => {
    it('should parse an array of valid experience levels', () => {
      const input = [
        { id: 1, name: 'Beginner' },
        { id: 2, name: 'Intermediate' },
        { id: 3, name: 'Expert' },
      ]
      const result = parseExperienceLevels(input)
      expect(result).toHaveLength(3)
    })

    it('should filter out invalid levels', () => {
      const input = [
        { id: 1, name: 'Beginner' },
        { id: 'bad', name: 'Intermediate' },
        { id: 3, name: 'Expert' },
      ]
      const result = parseExperienceLevels(input)
      expect(result).toHaveLength(2)
      expect(result.map((l) => l.id)).toEqual([1, 3])
    })

    it('should return empty array for non-array input', () => {
      expect(parseExperienceLevels('string')).toEqual([])
      expect(parseExperienceLevels(null)).toEqual([])
    })
  })
})
