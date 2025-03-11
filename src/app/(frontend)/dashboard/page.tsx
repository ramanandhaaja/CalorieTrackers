import React from 'react'
import { requireAuth } from '@/lib/auth'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'
import { SidebarProvider } from '@/components/layout/SidebarContext'
import FloatingActionButton from '@/components/ui/FloatingActionButton'
import WaterIntakeWidget from '@/components/widget/WaterIntakeWidget'
import DashboardContent from '@/app/(frontend)/dashboard/DashboardContent'
import { Separator } from '@/components/ui/separator';
import FoodEntriesWidget from '@/components/widget/FoodEntriesWidget';
import WeeklyProgressChartWidget from '@/components/widget/WeeklyProgressChartWidget';
import NutrientGoalsWidget from '@/components/widget/NutrientGoalsWidget';

export default async function DashboardPage() {
  // Get the current user and redirect if not authenticated
  const user = await requireAuth()
  
  // Get the username to display
  const username = user?.fullName || user?.username || user?.email || 'User'
  
  return (
    <SidebarProvider>
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
              <button 
                className="p-2 rounded-md bg-white shadow-sm text-gray-500 hover:text-blue-500 md:hidden"
                aria-label="Toggle sidebar"
                id="sidebar-toggle"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            {/* Nutrient Goals */}
            <NutrientGoalsWidget />
            
          
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Food Diary with Weekly Progress Chart */}
              <DashboardContent />
              
              {/* Right Column */}
              <div className="space-y-5">
                {/* Water Intake Widget */}
                <WaterIntakeWidget />
                
                {/* Nutrient Goals widget has been moved to the top */}
              </div>
            </div>
          </div>
        </div>
      
        {/* Floating Action Button for adding food */}
        <FloatingActionButton />
      </div>
    </SidebarProvider>
  )
}