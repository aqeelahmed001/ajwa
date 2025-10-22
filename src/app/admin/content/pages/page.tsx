"use client"

import { PageContent } from '@/components/admin/content/PageContent'

export default function ContentManagementPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Page Content Management</h1>
      </div>
      <PageContent />
    </div>
  )
}
