import React from 'react'

interface WorkspacePageProps {
  params: {
    workspaceId: string
  }
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  return (
    <div>
      <h1>Workspace: {params.workspaceId}</h1>
      <p>This is the dynamic workspace page.</p>
    </div>
  )
}
