"use client";

import RoleGuard from '@/components/admin/RoleGuard';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Protect the dashboard with RoleGuard
  return (
    <RoleGuard requiredPermission="viewDashboard">
      {children}
    </RoleGuard>
  )
}
