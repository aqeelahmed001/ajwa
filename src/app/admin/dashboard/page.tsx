"use client"

import data from '@/app/dashboard/data.json'
import { DashboardCards } from '@/components/admin/DashboardCards'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { Card } from '@/components/ui/card'

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardCards layout="horizontal" theme="light" />
      <div className="mt-4">
        <ChartAreaInteractive />
      </div>
      <Card className="border-none shadow-none">
        <DataTable data={data} />
      </Card>
    </div>
  )
}
