'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, GitBranch, Github, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import type { GitHubFile } from '@/types'
import { getRepoContents } from '@/lib/github'

import CodeEditor from './code-editor'
import FileTree from './file-tree'
import { Logo } from '../logo'
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'

interface EditorLayoutProps {
  repoUrl: string
  onBack: () => void
}

interface SelectedFile extends GitHubFile {
  content: string
}

export default function EditorLayout({ repoUrl, onBack }: EditorLayoutProps) {
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [files, setFiles] = useState<GitHubFile[]>([])
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const urlParts = repoUrl.replace(/^(https?:\/\/)?github\.com\//, '').split('/')
    if (urlParts.length >= 2) {
      const [owner, repo] = urlParts
      setOwner(owner)
      setRepo(repo)
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid URL',
        description: 'Please provide a valid GitHub repository URL.',
      })
      onBack()
    }
  }, [repoUrl, onBack, toast])

  const loadRootFiles = useCallback(async () => {
    if (owner && repo) {
      setIsLoading(true)
      try {
        const rootFiles = await getRepoContents(owner, repo)
        setFiles(rootFiles)
      } catch (error) {
        console.error(error)
        toast({
          variant: 'destructive',
          title: 'Failed to load repository',
          description:
            'Could not fetch repository files. Please check the URL and make sure it is a public repository.',
        })
        onBack()
      } finally {
        setIsLoading(false)
      }
    }
  }, [owner, repo, onBack, toast])

  useEffect(() => {
    loadRootFiles()
  }, [loadRootFiles])

  const handleFileSelect = (file: SelectedFile) => {
    setSelectedFile(file)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 font-semibold">
            <Logo className="h-6 w-6 text-primary" />
            GitSync Starter
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="h-4 w-4" />
            <span>{owner}/{repo}</span>
          </div>
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <Sidebar>
            <SidebarHeader>
              <h3 className="text-lg font-semibold">Project Files</h3>
            </SidebarHeader>
            <SidebarContent>
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="animate-spin text-primary" />
                </div>
              ) : (
                <FileTree owner={owner} repo={repo} onFileSelect={handleFileSelect} initialFiles={files} />
              )}
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <CodeEditor selectedFile={selectedFile} />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
