'use client'

import { useState } from 'react'
import ProjectSetup from '@/components/app/project-setup'
import EditorLayout from '@/components/app/editor-layout'

export default function Home() {
  const [repoUrl, setRepoUrl] = useState<string | null>(null)

  const handleImport = (url: string) => {
    setRepoUrl(url)
  }
  
  const handleBack = () => {
    setRepoUrl(null);
  }

  if (!repoUrl) {
    return <ProjectSetup onImport={handleImport} />
  }

  return <EditorLayout repoUrl={repoUrl} onBack={handleBack} />
}
