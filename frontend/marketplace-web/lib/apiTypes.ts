export interface JobCategory {
  id: number
  name: string
  slug?: string
  description?: string
}

export interface ExperienceLevel {
  id: number
  name: string
}

export type ApiList<T> = T[]
