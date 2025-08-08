import { NextResponse } from 'next/server'

interface PinnedRepo {
  name: string
  description: string
  stars: number
  forks: number
  language: string
  url: string
  topics: string[]
}

export async function GET() {
  try {
    const username = 'nicstrong' // You can make this configurable via environment variable

    // Check if GitHub token is available
    if (!process.env.GITHUB_TOKEN) {
      console.warn('GITHUB_TOKEN not found, returning empty array')
      return NextResponse.json([])
    }

    // Fetch user's pinned repositories using GitHub GraphQL API
    const query = `
      query {
        user(login: "${username}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                id
                name
                description
                stargazerCount
                forkCount
                primaryLanguage {
                  name
                }
                url
                repositoryTopics(first: 10) {
                  nodes {
                    topic {
                      name
                    }
                  }
                }
                homepageUrl
              }
            }
          }
        }
      }
    `

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'nicstrong.com',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
    }

    const pinnedRepos = data.data.user.pinnedItems.nodes.map((repo: any) => ({
      name: repo.name,
      description: repo.description || 'No description available',
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      language: repo.primaryLanguage?.name || 'Unknown',
      url: repo.url,
      topics: repo.repositoryTopics.nodes.map((node: any) => node.topic.name),
    }))

    return NextResponse.json(pinnedRepos)
  } catch (error) {
    console.error('Error fetching pinned repos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pinned repositories' },
      { status: 500 },
    )
  }
}
