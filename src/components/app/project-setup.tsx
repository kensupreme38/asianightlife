'use client'

import { useState } from 'react'
import { Github, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '../logo'

interface ProjectSetupProps {
  onImport: (url: string) => void
}

export default function ProjectSetup({ onImport }: ProjectSetupProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!url) {
      setError('Please enter a valid GitHub repository URL.')
      return
    }
    setError(null)
    setLoading(true)
    // Simulate a small delay for better UX
    setTimeout(() => {
      onImport(url)
      setLoading(false)
    }, 500)
  }

  return (
    <main className="flex h-full items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Logo className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-headline">Welcome to GitSync Starter</CardTitle>
          <CardDescription className="text-md">
            Import a public GitHub repository to view and edit files, with AI-powered commit message generation.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="git-url" className="flex items-center">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub Repository URL
                </Label>
                <Input
                  id="git-url"
                  placeholder="e.g., https://github.com/reactjs/react.dev"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Import Project'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
