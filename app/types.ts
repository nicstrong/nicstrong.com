export interface PinnedRepo {
  name: string
  description: string
  stars: number
  forks: number
  language: string
  url: string
  topics: string[]
}

export interface GitHubRepository {
  id: string
  name: string
  description: string | null
  stargazerCount: number
  forkCount: number
  primaryLanguage: {
    name: string
  } | null
  url: string
  repositoryTopics: {
    nodes: Array<{
      topic: {
        name: string
      }
    }>
  }
  homepageUrl: string | null
}

export interface GitHubUser {
  user: {
    pinnedItems: {
      nodes: GitHubRepository[]
    }
  }
}

export type GraphQLResponse<T> =
  | {
      data: never
      errors?: Array<{
        message: string
        locations?: Array<{
          line: number
          column: number
        }>
        path?: string[]
      }>
    }
  | {
      data: T
      errors: never
    }
