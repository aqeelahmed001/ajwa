import { Metadata } from 'next'
import AdminLayoutShell from '@/components/admin/AdminLayoutShell'

export const metadata: Metadata = {
  title: 'Admin Panel | Ajwa Trading',
  description: 'Admin panel for Ajwa Trading website content management',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>
}
