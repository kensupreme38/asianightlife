'use client'

import { useState, useEffect } from 'react'
import { FileText, Folder, FolderOpen, Loader2 } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { getRepoContents, getFileContent } from '@/lib/github'
import type { GitHubFile } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface FileTreeProps {
  owner: string
  repo: string
  initialFiles: GitHubFile[]
  onFileSelect: (file: GitHubFile & { content: string }) => void
}

interface FileTreeNodeProps {
  owner: string
  repo: string
  file: GitHubFile
  onFileSelect: (file: GitHubFile & { content: string }) => void
  level: number
}

function FileTreeNode({ owner, repo, file, onFileSelect, level }: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [children, setChildren] = useState<GitHubFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleToggle = async () => {
    if (file.type === 'dir' && !isOpen && children.length === 0) {
      setIsLoading(true)
      try {
        const contents = await getRepoContents(owner, repo, file.path)
        setChildren(contents)
      } catch (error) {
        console.error(error)
        toast({
          variant: 'destructive',
          title: 'Error loading directory',
          description: `Could not load contents of ${file.path}.`,
        })
      } finally {
        setIsLoading(false)
      }
    }
    setIsOpen(!isOpen)
  }

  const handleFileClick = async () => {
    if (file.type === 'file') {
      try {
        const content = await getFileContent(owner, repo, file.sha)
        onFileSelect({ ...file, content })
      } catch (error) {
        console.error(error)
        toast({
          variant: 'destructive',
          title: 'Error loading file',
          description: `Could not load content of ${file.path}.`,
        })
      }
    }
  }

  if (file.type === 'dir') {
    return (
      <Collapsible open={isOpen} onOpenChange={handleToggle} className="w-full">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start gap-2"
            style={{ paddingLeft: `${level * 1.5}rem` }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isOpen ? (
              <FolderOpen className="h-4 w-4 text-primary" />
            ) : (
              <Folder className="h-4 w-4 text-primary" />
            )}
            <span>{file.name}</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {children.map((child) => (
            <FileTreeNode
              key={child.sha}
              owner={owner}
              repo={repo}
              file={child}
              onFileSelect={onFileSelect}
              level={level + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Button
      variant="ghost"
      className="flex w-full items-center justify-start gap-2"
      style={{ paddingLeft: `${level * 1.5}rem` }}
      onClick={handleFileClick}
    >
      <FileText className="h-4 w-4 text-muted-foreground" />
      <span>{file.name}</span>
    </Button>
  )
}

export default function FileTree({ owner, repo, initialFiles, onFileSelect }: FileTreeProps) {
  const [sortedFiles, setSortedFiles] = useState<GitHubFile[]>([]);

  useEffect(() => {
    const sorted = [...initialFiles].sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === 'dir' ? -1 : 1;
    });
    setSortedFiles(sorted);
  }, [initialFiles]);

  return (
    <div className="p-2">
      {sortedFiles.map((file) => (
        <FileTreeNode key={file.sha} owner={owner} repo={repo} file={file} onFileSelect={onFileSelect} level={1} />
      ))}
    </div>
  )
}
