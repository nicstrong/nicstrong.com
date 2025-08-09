import { GitHubUser, GraphQLResponse, PinnedRepo } from '@/lib/types'
import { writeCache, readCache } from '@/lib/cache'
import { PINNED_REPOS_CACHE_KEY } from '@/lib/constants'
import { checkRateLimit, updateRateLimit } from '@/lib/rateLimit'
import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

const { logger } = Sentry

export async function GET() {
  try {
    // Check server-side rate limit first
    const rateLimitCheck = await checkRateLimit()

    if (!rateLimitCheck.allowed) {
      // Update rate limit to track this attempt (even though it was blocked)
      await updateRateLimit()

      // Return cached data if available
      const cachedData = await readCache<PinnedRepo[]>(PINNED_REPOS_CACHE_KEY)
      if (cachedData) {
        logger.info(`Ratelimit exceeded, returning cached data`)
        return NextResponse.json(cachedData, {
          headers: {
            'X-Rate-Limited': 'true',
            'X-Retry-After': Math.ceil(
              (rateLimitCheck.timeRemaining || 900) / 1000,
            ).toString(),
            'X-Rate-Limit-Remaining': '0',
            'X-Rate-Limit-Reset': new Date(
              Date.now() + (rateLimitCheck.timeRemaining || 0),
            ).toISOString(),
          },
        })
      }
      logger.info(`Ratelimit exceeded, no cached data - returning 429`)

      // No cached data available - return error
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(
              (rateLimitCheck.timeRemaining || 900) / 1000,
            ).toString(),
            'X-Rate-Limit-Remaining': '0',
            'X-Rate-Limit-Reset': new Date(
              Date.now() + (rateLimitCheck.timeRemaining || 0),
            ).toISOString(),
          },
        },
      )
    }

    const username = 'nicstrong'

    // Check if GitHub token is available
    if (!process.env.GITHUB_TOKEN) {
      console.warn('GITHUB_TOKEN not found, returning empty array')
      return NextResponse.json([])
    }

    // Update rate limit BEFORE making the GitHub API request
    await updateRateLimit()

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
    logger.info(`Ratelimit not exceeded, fetched update from GitHub`)

    const result = (await response.json()) as GraphQLResponse<GitHubUser>

    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
    }

    const pinnedRepos = result.data.user.pinnedItems.nodes.map((repo) => ({
      name: repo.name,
      description: repo.description || 'No description available',
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      language: repo.primaryLanguage?.name || 'Unknown',
      url: repo.url,
      topics: repo.repositoryTopics.nodes.map((node) => node.topic.name),
    }))

    await writeCache(pinnedRepos, PINNED_REPOS_CACHE_KEY)

    return NextResponse.json(pinnedRepos, {
      headers: {
        'X-Rate-Limit-Remaining': '0', // We just used our 1 request
        'X-Rate-Limit-Reset': new Date(
          Date.now() + 15 * 60 * 1000,
        ).toISOString(),
      },
    })
  } catch (error) {
    console.error('Error fetching pinned repos:', error)

    // Return cached data on error if available
    const cachedData = await readCache<PinnedRepo[]>(PINNED_REPOS_CACHE_KEY)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    return NextResponse.json(
      { error: 'Failed to fetch pinned repositories' },
      { status: 500 },
    )
  }
}
