import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Types } from 'mongoose'

import dbConnect from '@/lib/db'
import MachineryItemModel from '@/models/MachineryItem'
import MachineryDetailClient from '@/components/machinery/MachineryDetailClient'

interface MachineryDetail {
  id: string
  slug: string
  categorySlug: string
  name: string
  category: string
  subcategory?: string
  manufacturer: string
  modelNumber: string
  year: number
  hours: number
  price: number
  priceFormatted: string
  priceJPY: string
  images: string[]
  location: string
  condition: string
  weight?: string
  featured: boolean
  availability: string
  description: string
  specifications: Record<string, string>
  tags: string[]
}

function normalizeMachineryDoc(doc: Record<string, any>): MachineryDetail {
  const {
    _id,
    priceFormatted,
    priceJPY,
    images,
    specifications,
    tags,
    ...rest
  } = doc

  const specsEntries = specifications instanceof Map
    ? Object.fromEntries(specifications.entries())
    : specifications ?? {}

  const preparedImages = Array.isArray(images) && images.length > 0
    ? images
    : ['https://placehold.co/800x600?text=No+Image+Available']

  const numericPrice = typeof rest.price === 'number' ? rest.price : Number(rest.price) || 0

  return {
    id: _id.toString(),
    slug: rest.slug ?? 'unknown-machine',
    categorySlug: rest.categorySlug ?? 'machinery',
    name: rest.name ?? 'Unnamed Machinery',
    category: rest.category ?? 'Other',
    subcategory: rest.subcategory ?? undefined,
    manufacturer: rest.manufacturer ?? '',
    modelNumber: rest.modelNumber ?? '',
    year: typeof rest.year === 'number' ? rest.year : Number(rest.year) || new Date().getFullYear(),
    hours: typeof rest.hours === 'number' ? rest.hours : Number(rest.hours) || 0,
    price: numericPrice,
    priceFormatted:
      priceFormatted ?? (numericPrice > 0 ? `$${numericPrice.toLocaleString()}` : 'Contact for price'),
    priceJPY: priceJPY ?? '',
    images: preparedImages,
    location: rest.location ?? 'N/A',
    condition: rest.condition ?? 'N/A',
    weight: rest.weight ?? undefined,
    featured: Boolean(rest.featured),
    availability: rest.availability ?? 'In Stock',
    description: rest.description ?? '',
    specifications: specsEntries,
    tags: Array.isArray(tags) ? tags : []
  }
}

async function getMachineryData(categorySlug: string, slug: string): Promise<MachineryDetail | null> {
  await dbConnect()
  
  // First try the exact match with both slugs
  const doc = await MachineryItemModel.findOne({ categorySlug, slug }).lean()
  
  if (!doc) {
    // Try with just the slug
    const docBySlug = await MachineryItemModel.findOne({ slug }).lean()
    
    if (docBySlug) {
      return normalizeMachineryDoc(docBySlug as Record<string, any>)
    }
    
    // Try to find by ID in case slug is actually an ID
    if (Types.ObjectId.isValid(slug)) {
      const docById = await MachineryItemModel.findById(slug).lean()
      if (docById) {
        return normalizeMachineryDoc(docById as Record<string, any>)
      }
    }
    
    // Last resort - try case insensitive search
    const docCaseInsensitive = await MachineryItemModel.findOne({
      categorySlug: { $regex: new RegExp('^' + categorySlug + '$', 'i') },
      slug: { $regex: new RegExp('^' + slug + '$', 'i') }
    }).lean()
    
    if (docCaseInsensitive) {
      return normalizeMachineryDoc(docCaseInsensitive as Record<string, any>)
    }
    
    return null
  }

  return normalizeMachineryDoc(doc as Record<string, any>)
}

async function getSimilarMachinery(currentId: string, categorySlug: string) {
  await dbConnect()
  
  // First get the current machinery details to find similar ones
  const currentMachinery = await MachineryItemModel.findById(currentId).lean()
  
  if (!currentMachinery) {
    // Fallback to category-only filter if current machinery not found
    const docs = await MachineryItemModel.find({
      _id: { $ne: currentId },
      categorySlug
    })
      .sort({ featured: -1, createdAt: -1 })
      .limit(12)
      .lean()
    
    return docs.map(doc => normalizeMachineryDoc(doc as Record<string, any>))
  }
  
  // Build a query to find similar machinery
  const queries = [
    // Same manufacturer and category but different model
    {
      _id: { $ne: currentId },
      manufacturer: currentMachinery.manufacturer,
      category: currentMachinery.category,
      modelNumber: { $ne: currentMachinery.modelNumber }
    },
    
    // Same category and similar year range (±5 years)
    {
      _id: { $ne: currentId },
      category: currentMachinery.category,
      year: { 
        $gte: Number(currentMachinery.year) - 5, 
        $lte: Number(currentMachinery.year) + 5 
      }
    },
    
    // Similar price range (±20%)
    {
      _id: { $ne: currentId },
      category: currentMachinery.category,
      price: { 
        $gte: Number(currentMachinery.price) * 0.8, 
        $lte: Number(currentMachinery.price) * 1.2 
      }
    },
    
    // Same subcategory if available
    ...(currentMachinery.subcategory ? [{
      _id: { $ne: currentId },
      subcategory: currentMachinery.subcategory
    }] : []),
    
    // Same condition
    {
      _id: { $ne: currentId },
      condition: currentMachinery.condition
    },
    
    // Fallback to category only
    {
      _id: { $ne: currentId },
      categorySlug
    }
  ]
  
  // Execute the queries in parallel for better performance
  const results = await Promise.all(
    queries.map(query => 
      MachineryItemModel.find(query)
        .sort({ featured: -1, createdAt: -1 })
        .limit(8)
        .lean()
    )
  )
  
  // Combine results, remove duplicates, and limit to 12 items
  const combinedResults = []
  const seenIds = new Set()
  
  for (const resultSet of results) {
    for (const item of resultSet) {
      if (!seenIds.has(item._id.toString())) {
        seenIds.add(item._id.toString())
        combinedResults.push(item)
        
        if (combinedResults.length >= 12) {
          break
        }
      }
    }
    
    if (combinedResults.length >= 12) {
      break
    }
  }
  
  return combinedResults.map(doc => normalizeMachineryDoc(doc as Record<string, any>))
}

export async function generateMetadata({
  params
}: {
  params: { slug: string; category: string; lang: string }
}): Promise<Metadata> {
  const machinery = await getMachineryData(params.category, params.slug)

  if (!machinery) {
    return {
      title: 'Machine Not Found'
    }
  }

  return {
    title: `${machinery.name} | Ajwa Trading`,
    description: machinery.description.substring(0, 160)
  }
}

// Server component that fetches data and passes it to client component
export default async function MachineryDetailPage({
  params
}: {
  params: { slug: string; category: string; lang: string }
}) {
  const machinery = await getMachineryData(params.category, params.slug)

  if (!machinery) {
    notFound()
  }

  const similarMachinery = await getSimilarMachinery(machinery.id, machinery.categorySlug)
  
  // Pass data to client component
  return (
    <MachineryDetailClient 
      machinery={machinery}
      similarMachinery={similarMachinery}
      params={params}
    />
  )
}