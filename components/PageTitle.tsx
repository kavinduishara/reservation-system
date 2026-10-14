import React from 'react'

function PageTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 flex flex-col items-start justify-start space-y-1 text-left">
      <h1 className="text-xl font-bold text-zinc-900">{title}</h1>
      <p className="text-sm text-zinc-600">{description}</p>
    </div>
  )
}

export default PageTitle