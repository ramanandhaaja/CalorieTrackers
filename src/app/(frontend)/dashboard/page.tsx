import React from 'react'
import { requireAuth } from '@/lib/auth'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { SidebarProvider } from '@/components/SidebarContext'
import FloatingActionButton from '@/components/FloatingActionButton'
import WaterIntakeWidget from '@/components/WaterIntakeWidget'
import FoodEntriesWidget from '@/components/FoodEntriesWidget'

export default async function DashboardPage() {
  // Get the current user and redirect if not authenticated
  const user = await requireAuth()
  
  // Get the username to display
  const username = user?.fullName || user?.username || user?.email || 'User'
  
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex relative">
        {/* Sidebar */}
        <Sidebar username={username} />
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="w-full px-4 py-6">
            {/* Header with Toggle Button */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Hello, {username}
                </h1>
                <p className="text-gray-500 mt-1">
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
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Rest of the content remains the same */}
              {/* ... */}
            </div>
          
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Food Diary */}
              <div className="lg:col-span-2 space-y-5">
                {/* Today's Meals Card */}
                <FoodEntriesWidget />
                
                {/* Weekly Progress Chart Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 px-5 py-4 flex justify-between items-center">
                    <h2 className="text-base font-medium text-gray-900">Weekly Progress</h2>
                    <div className="flex">
                      <button className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md mr-2">Calories</button>
                      <button className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded-md">Macros</button>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500">This Week</p>
                        <p className="text-sm font-medium">Daily Average: 1,465 cal</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                        <span className="text-xs text-gray-500 mr-3">Calories</span>
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                        <span className="text-xs text-gray-500 mr-3">Target</span>
                      </div>
                    </div>
                    
                    {/* Simplified chart (just for visual representation) */}
                    <div className="h-40 flex items-end justify-between space-x-2">
                      {[65, 80, 70, 90, 75, 62, 50].map((height, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="relative w-8">
                            <div 
                              className="bg-blue-100 rounded-t-md w-full"
                              style={{ height: `${height}%` }}
                            >
                              <div 
                                className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md"
                                style={{ height: `${height - 15}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-5">
                {/* Water Intake Widget */}
                <WaterIntakeWidget />
                
                {/* Nutrient Goals */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 px-5 py-4">
                    <h2 className="text-base font-medium text-gray-900">Nutrient Goals</h2>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-medium text-gray-700">Protein</p>
                        <p className="text-xs text-gray-500">68g / 120g</p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '57%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-medium text-gray-700">Carbs</p>
                        <p className="text-xs text-gray-500">158g / 200g</p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '79%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-medium text-gray-700">Fat</p>
                        <p className="text-xs text-gray-500">42g / 65g</p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-medium text-gray-700">Fiber</p>
                        <p className="text-xs text-gray-500">18g / 25g</p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-medium text-gray-700">Sugar</p>
                        <p className="text-xs text-gray-500">24g / 30g</p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
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