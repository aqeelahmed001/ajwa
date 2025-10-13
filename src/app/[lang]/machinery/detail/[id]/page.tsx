import { redirect } from 'next/navigation'
import { Types } from 'mongoose'

import dbConnect from '@/lib/db'
import MachineryItemModel from '@/models/MachineryItem'

export async function generateMetadata() {
  return {
    title: 'Machinery detail'
  }
}

export default async function LegacyMachineryDetailRedirect({
  params
}: {
  params: { id: string; lang: string }
}) {
  if (!Types.ObjectId.isValid(params.id)) {
    redirect(`/${params.lang}/machinery`)
  }

  await dbConnect()

  const machinery = await MachineryItemModel.findById(params.id)
    .select('slug categorySlug')
    .lean()

  if (!machinery) {
    redirect(`/${params.lang}/machinery`)
  }

  const slug = machinery.slug || machinery._id.toString()
  const categorySlug = machinery.categorySlug || 'machinery'

  redirect(`/${params.lang}/machinery/${categorySlug}/${slug}`)
}
