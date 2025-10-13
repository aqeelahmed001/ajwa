"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function MachineryRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the machinery management page
    router.replace('/admin/content/machinery-management')
  }, [router])
  
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Redirecting to machinery management...</span>
    </div>
  )
}
