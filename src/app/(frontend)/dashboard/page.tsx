import React from 'react'
import { requireAuth } from '@/lib/auth'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'
import FloatingActionButton from '@/components/ui/FloatingActionButton'
import WaterIntakeWidget from '@/components/widget/WaterIntakeWidget'
import DashboardContent from '@/app/(frontend)/dashboard/DashboardContent'
import { Separator } from '@/components/ui/separator';
import FoodEntriesWidget from '@/components/widget/FoodEntriesWidget';
import WeeklyProgressChartWidget from '@/components/widget/WeeklyProgressChartWidget';
import NutrientGoalsWidgetWrapper from '@/components/widget/NutrientGoalsWidgetWrapper';
import SidebarToggleButton from '@/components/layout/SidebarToggleButton'

// Force dynamic rendering for this page since it uses cookies
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Get the current user and redirect if not authenticated
  const user = await requireAuth()
  
  // Get the username to display
  const username = user?.fullName || user?.username || user?.email || 'User'
  
  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="w-full px-4 py-6">
          {/* Header with Toggle Button */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Hello, {username}
              </h1>
              <p className="text-lg text-gray-500 mt-1">
                Welcome to your dashboard
              </p>
            </div>
            <SidebarToggleButton />
          </div>
          
          {/* Nutrient Goals */}
          <NutrientGoalsWidgetWrapper />
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Food Diary with Weekly Progress Chart */}
            <DashboardContent />
            
            {/* Right Column */}
            <div className="space-y-5">
              {/* Water Intake Widget */}
              <WaterIntakeWidget />
            </div>
          </div>
        </div>
      </div>
    
      {/* Floating Action Button for adding food */}
      <FloatingActionButton />
    </div>
  )
}