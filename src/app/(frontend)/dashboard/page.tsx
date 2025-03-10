import React from 'react'
import { requireAuth } from '@/lib/auth'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { SidebarProvider } from '@/components/SidebarContext'
import FloatingActionButton from '@/components/FloatingActionButton'

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
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-4 flex justify-between items-center">
                  <h2 className="text-base font-medium text-gray-900">Today's Meals</h2>
                  <button className="text-sm font-medium text-blue-500 hover:text-blue-700 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Food
                  </button>
                </div>
                
                <div className="px-5 py-1">
                  {/* Breakfast */}
                  <div className="py-3">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <h3 className="text-xs font-medium text-gray-800">Breakfast</h3>
                      <p className="ml-auto text-xs text-gray-500">320 cal</p>
                    </div>
                    <div className="pl-4">
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <div className="flex items-center">
                          <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center">
                            <span className="text-xs text-blue-500">🥣</span>
                          </div>
                          <div className="ml-3">
                            <p className="text-xs font-medium">Oatmeal with Berries</p>
                            <p className="text-xs text-gray-500">1 bowl (250g)</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">320 cal</p>
                          <div className="flex text-xs text-gray-500 space-x-2">
                            <span>P: 12g</span>
                            <span>C: 58g</span>
                            <span>F: 6g</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lunch */}
                  <div className="py-3">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <h3 className="text-xs font-medium text-gray-800">Lunch</h3>
                      <p className="ml-auto text-xs text-gray-500">580 cal</p>
                    </div>
                    <div className="pl-4">
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <div className="flex items-center">
                          <div className="w-7 h-7 bg-green-50 rounded-full flex items-center justify-center">
                            <span className="text-xs text-green-500">🥗</span>
                          </div>
                          <div className="ml-3">
                            <p className="text-xs font-medium">Grilled Chicken Salad</p>
                            <p className="text-xs text-gray-500">1 serving (350g)</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">450 cal</p>
                          <div className="flex text-xs text-gray-500 space-x-2">
                            <span>P: 38g</span>
                            <span>C: 22g</span>
                            <span>F: 25g</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <div className="flex items-center">
                          <div className="w-7 h-7 bg-green-50 rounded-full flex items-center justify-center">
                            <span className="text-xs text-green-500">🍎</span>
                          </div>
                          <div className="ml-3">
                            <p className="text-xs font-medium">Apple</p>
                            <p className="text-xs text-gray-500">1 medium (182g)</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">130 cal</p>
                          <div className="flex text-xs text-gray-500 space-x-2">
                            <span>P: 0g</span>
                            <span>C: 34g</span>
                            <span>F: 0g</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dinner */}
                  <div className="py-3">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <h3 className="text-xs font-medium text-gray-800">Dinner</h3>
                      <p className="ml-auto text-xs text-gray-500">348 cal</p>
                    </div>
                    <div className="pl-4">
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <div className="flex items-center">
                          <div className="w-7 h-7 bg-purple-50 rounded-full flex items-center justify-center">
                            <span className="text-xs text-purple-500">🍲</span>
                          </div>
                          <div className="ml-3">
                            <p className="text-xs font-medium">Grilled Salmon</p>
                            <p className="text-xs text-gray-500">1 fillet (125g)</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">233 cal</p>
                          <div className="flex text-xs text-gray-500 space-x-2">
                            <span>P: 25g</span>
                            <span>C: 0g</span>
                            <span>F: 15g</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <div className="flex items-center">
                          <div className="w-7 h-7 bg-purple-50 rounded-full flex items-center justify-center">
                            <span className="text-xs text-purple-500">🥦</span>
                          </div>
                          <div className="ml-3">
                            <p className="text-xs font-medium">Steamed Vegetables</p>
                            <p className="text-xs text-gray-500">1 cup (150g)</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">115 cal</p>
                          <div className="flex text-xs text-gray-500 space-x-2">
                            <span>P: 5g</span>
                            <span>C: 24g</span>
                            <span>F: 0g</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
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
              {/* Water Intake */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-4 flex justify-between items-center">
                  <h2 className="text-base font-medium text-gray-900">Water Intake</h2>
                  <button className="text-sm font-medium text-blue-500 hover:text-blue-700 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add
                  </button>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-center mb-5">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        {/* Background circle */}
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="2"
                          strokeDasharray="100, 100"
                        />
                        {/* Foreground circle - the progress */}
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2"
                          strokeDasharray="60, 100"
                        />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <p className="text-lg font-bold text-gray-900 mt-1">60%</p>
                        <p className="text-xs text-gray-500">1.2/2L</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">Daily Goal</p>
                      <p className="text-xs font-medium">2.0 L</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">Remaining</p>
                      <p className="text-xs font-medium text-blue-500">0.8 L</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <button className="bg-blue-50 p-2 rounded text-blue-500 hover:bg-blue-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="col-span-2 bg-gray-50 p-2 rounded text-center text-xs font-medium">
                      200 ml
                    </div>
                    <button className="bg-blue-50 p-2 rounded text-blue-500 hover:bg-blue-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
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
    </div>
    
    {/* Floating Action Button for adding food */}
    <FloatingActionButton />
    </SidebarProvider>
  )
}