'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface MachineryItem {
  id: string
  slug?: string
  categorySlug?: string
  name: string
  category: string
}

export default function DebugPage() {
  const [items, setItems] = useState<MachineryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        // Use a timestamp to prevent caching
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/content/machinery?_=${timestamp}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
          cache: 'no-store',
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        
        const data = await response.json()
        if (data.success && Array.isArray(data.data)) {
          setItems(data.data)
        } else {
          setItems([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {!loading && !error && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Machinery Items ({items.length})</h2>
          
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Category</th>
                <th className="border border-gray-300 p-2">Slug</th>
                <th className="border border-gray-300 p-2">Category Slug</th>
                <th className="border border-gray-300 p-2">Links</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="border border-gray-300 p-2">{item.id}</td>
                  <td className="border border-gray-300 p-2">{item.name}</td>
                  <td className="border border-gray-300 p-2">{item.category}</td>
                  <td className="border border-gray-300 p-2">{item.slug || '(none)'}</td>
                  <td className="border border-gray-300 p-2">{item.categorySlug || '(none)'}</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex flex-col gap-1">
                      <Link 
                        href={`/en/machinery/${item.categorySlug || 'machinery'}/${item.slug || item.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        New URL
                      </Link>
                      <Link 
                        href={`/en/machinery/detail/${item.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Legacy URL
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
