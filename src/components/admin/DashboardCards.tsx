"use client"

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Card } from "@/components/ui/card"

interface DashboardCardProps {
  title: string
  value: string
  trend: {
    value: string
    isPositive: boolean
  }
  description: {
    line1: string
    line2: string
  }
  theme?: 'light' | 'dark'
}

function DashboardCard({ title, value, trend, description, theme = 'light' }: DashboardCardProps) {
  const TrendIcon = trend.isPositive ? TrendingUpIcon : TrendingDownIcon
  
  return (
    <Card className={`p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-100 text-gray-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>{title}</div>
        <div className="flex items-center text-xs font-medium">
          <TrendIcon className="h-3 w-3 mr-1" />
          <span className={trend.isPositive ? "text-green-500" : "text-red-500"}>
            {trend.value}
          </span>
        </div>
      </div>
      
      <div className="text-3xl font-bold mb-6">{value}</div>
      
      <div className="flex items-center mb-1">
        <span className="text-sm font-medium">{description.line1}</span>
        <TrendIcon className="h-4 w-4 ml-2" />
      </div>
      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>{description.line2}</div>
    </Card>
  )
}

export interface DashboardCardsProps {
  layout?: 'vertical' | 'horizontal'
  theme?: 'light' | 'dark'
}

export function DashboardCards({ layout = 'vertical', theme = 'light' }: DashboardCardsProps) {
  const cardData: DashboardCardProps[] = [
    {
      title: "Total Revenue",
      value: "$1,250.00",
      trend: {
        value: "+12.5%",
        isPositive: true
      },
      description: {
        line1: "Trending up this month",
        line2: "Visitors for the last 6 months"
      }
    },
    {
      title: "New Customers",
      value: "1,234",
      trend: {
        value: "-20%",
        isPositive: false
      },
      description: {
        line1: "Down 20% this period",
        line2: "Acquisition needs attention"
      }
    },
    {
      title: "Active Accounts",
      value: "45,678",
      trend: {
        value: "+12.5%",
        isPositive: true
      },
      description: {
        line1: "Strong user retention",
        line2: "Engagement exceed targets"
      }
    },
    {
      title: "Growth Rate",
      value: "4.5%",
      trend: {
        value: "+4.5%",
        isPositive: true
      },
      description: {
        line1: "Steady performance",
        line2: "Meets growth projections"
      }
    }
  ]

  return (
    <div className={`grid gap-4 md:gap-6 ${layout === 'horizontal' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
      {cardData.map((card, index) => (
        <DashboardCard key={index} {...card} theme={theme} />
      ))}
    </div>
  )
}
