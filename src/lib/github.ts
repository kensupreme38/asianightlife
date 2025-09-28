'use server'

import { GitHubFile } from '@/types'

const GITHUB_API_URL = 'https://api.github.com'

async function githubFetch(path: string) {
  const res = await fetch(`${GITHUB_API_URL}${path}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      // No token provided for public access, rate limiting will apply
    },
    next: {
        revalidate: 60 // Cache for 1 minute
    }
  })

  if (!res.ok) {
    throw new Error(`GitHub API request failed: ${res.statusText}`)
  }

  return res.json()
}

export async function getRepoContents(owner: string, repo: string, path: string = ''): Promise<GitHubFile[]> {
  const data = await githubFetch(`/repos/${owner}/${repo}/contents/${path}`)
  return data
}

export async function getFileContent(owner: string, repo: string, sha: string): Promise<string> {
  const data = await githubFetch(`/repos/${owner}/${repo}/git/blobs/${sha}`)
  if (data.encoding === 'base64') {
    // Check if running in browser or server
    if (typeof window !== 'undefined') {
        return atob(data.content);
    } else {
        return Buffer.from(data.content, 'base64').toString('utf-8');
    }
  }
  return data.content
}
