'use client'

import { useState, useEffect, useRef } from 'react'
import { File, Bot, Clipboard, Check, Loader2, FileWarning } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { generateCommitMessage } from '@/ai/flows/generate-commit-message'
import { useToast } from '@/hooks/use-toast'
import type { GitHubFile } from '@/types'
import { Separator } from '../ui/separator'

interface CodeEditorProps {
  selectedFile: (GitHubFile & { content: string }) | null
}

export default function CodeEditor({ selectedFile }: CodeEditorProps) {
  const [editedContent, setEditedContent] = useState('')
  const [lineCount, setLineCount] = useState(1)
  const [commitMessage, setCommitMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)

  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { toast } = useToast()

  useEffect(() => {
    if (selectedFile) {
      setEditedContent(selectedFile.content)
      setCommitMessage('')
    }
  }, [selectedFile])

  useEffect(() => {
    const lines = editedContent.split('\n').length
    setLineCount(lines)
  }, [editedContent])

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const handleGenerateCommit = async () => {
    if (!selectedFile || editedContent === selectedFile.content) {
      toast({
        title: 'No changes detected',
        description: 'Please make some changes to the file before generating a commit message.',
      })
      return
    }
    setIsGenerating(true)
    setCommitMessage('')
    try {
      const result = await generateCommitMessage({ codeChanges: editedContent })
      setCommitMessage(result.commitMessage)
    } catch (error) {
      console.error('Failed to generate commit message:', error)
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'An error occurred while generating the commit message.',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(commitMessage)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 2000)
  }

  if (!selectedFile) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-background p-8 text-center">
        <FileText size={48} className="mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No file selected</h2>
        <p className="text-muted-foreground">Select a file from the project tree to view and edit its content.</p>
      </div>
    )
  }

  const isChanged = editedContent !== selectedFile.content

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <File className="h-5 w-5" />
          <span className="font-medium">{selectedFile.name}</span>
          {isChanged && <span className="text-xs text-primary">(modified)</span>}
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col p-4">
            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle className="text-lg">Code Editor</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex overflow-hidden">
                    <div className="flex w-full rounded-md border bg-muted/20">
                    <div ref={lineNumbersRef} className="w-12 select-none overflow-hidden bg-muted/30 p-2 text-right text-muted-foreground font-code text-sm">
                        {Array.from({ length: lineCount }, (_, i) => (
                        <div key={i}>{i + 1}</div>
                        ))}
                    </div>
                    <Textarea
                        ref={textareaRef}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        onScroll={handleScroll}
                        className="h-full flex-1 resize-none border-0 bg-transparent p-2 font-code text-sm !ring-0 !outline-none"
                        placeholder="File content goes here..."
                    />
                    </div>
                </CardContent>
            </Card>
        </div>
        <Separator orientation="vertical" />
        <div className="w-full lg:w-1/3 flex-shrink-0 p-4 overflow-y-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Bot className="text-accent" />
                        Commit Message Generator
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        After making changes, generate a commit message with AI.
                    </p>
                    <Button onClick={handleGenerateCommit} disabled={!isChanged || isGenerating} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        {isGenerating ? <Loader2 className="animate-spin" /> : 'Generate Commit Message'}
                    </Button>
                    {(isGenerating || commitMessage) && (
                        <div className="mt-4 rounded-md border bg-muted/50 p-4">
                            {isGenerating && (
                                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                                    <Loader2 className="animate-spin" />
                                    <span>Generating...</span>
                                </div>
                            )}
                            {commitMessage && (
                                <div className="space-y-2">
                                <p className="text-sm font-medium">Suggested Commit Message:</p>
                                <div className="relative rounded-md bg-background p-3 font-code text-sm">
                                    <pre className="whitespace-pre-wrap">{commitMessage}</pre>
                                    <Button size="icon" variant="ghost" className="absolute top-1 right-1 h-7 w-7" onClick={handleCopy}>
                                    {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                                    </Button>
                                </div>
                                </div>
                            )}
                        </div>
                    )}
                    {!isChanged && !isGenerating && !commitMessage &&
                        <div className="flex items-center text-sm text-muted-foreground p-4 border-dashed border rounded-md">
                            <FileWarning className="w-4 h-4 mr-2" />
                            No changes made to the file yet.
                        </div>
                    }
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
