'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Loader2, Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { DatePicker } from '@/components/ui/date-picker';

interface FoodEntry {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  user: string | number;
  createdAt: string;
  updatedAt: string;
}

interface EntriesByDate {
  [date: string]: FoodEntry[];
}

interface PaginationData {
  totalDocs: number;
  totalPages: number;
  page: number;
  prevPage: number | null;
  nextPage: number | null;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

interface ApiResponse {
  entries: FoodEntry[];
  entriesByDate: EntriesByDate;
  pagination: PaginationData;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function MealsPage() {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [entriesByDate, setEntriesByDate] = useState<EntriesByDate>({});
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [mealType, setMealType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch historical meals with useCallback to prevent dependency issues
  const fetchHistoricalMeals = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('period', 'historical');
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (startDate) {
        params.append('startDate', startDate.toISOString().split('T')[0]);
      }
      
      if (endDate) {
        params.append('endDate', endDate.toISOString().split('T')[0]);
      }
      
      if (mealType) {
        params.append('mealType', mealType);
      }
      
      // Fetch data from API
      const response = await fetch(`/api/food?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch meal data');
      }
      
      const data: ApiResponse = await response.json();
      
      setFoodEntries(data.entries);
      setEntriesByDate(data.entriesByDate);
      setPagination(data.pagination);
      setTotals(data.totals);
    } catch (error) {
      console.error('Error fetching historical meals:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, startDate, endDate, mealType]);

  // Fetch meals when filters change
  useEffect(() => {
    fetchHistoricalMeals();
  }, [fetchHistoricalMeals]);
  
  // Apply date filters
  const applyDateFilters = () => {
    setPage(1); // Reset to first page
    fetchHistoricalMeals();
  };
  
  // Reset all filters
  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setMealType(null);
    setPage(1);
    setActiveTab('all');
    fetchHistoricalMeals();
  };
  
  // Handle meal type filter change
  const handleMealTypeChange = (value: string | null) => {
    setMealType(value as string);
    setActiveTab(value === 'all' ? 'all' : (value as string));
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Set meal type based on tab
    if (value === 'all') {
      setMealType(null);
    } else {
      setMealType(value);
    }
    
    setPage(1); // Reset to first page
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString.split('T')[0]), 'EEEE, MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Get meal type badge color
  const getMealTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lunch':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'dinner':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'snack':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading && !foodEntries.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Meal History</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <span className="font-semibold">{totals.calories}</span> calories
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <span className="font-semibold">{totals.protein}g</span> protein
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <span className="font-semibold">{totals.carbs}g</span> carbs
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <span className="font-semibold">{totals.fat}g</span> fat
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <DatePicker 
                date={startDate} 
                setDate={setStartDate} 
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <DatePicker 
                date={endDate} 
                setDate={setEndDate} 
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Entries per page</label>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Entries per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={applyDateFilters} className="flex-1">Apply Filters</Button>
              <Button onClick={resetFilters} variant="outline">Reset</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Meal Type Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All Meals</TabsTrigger>
          <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">Lunch</TabsTrigger>
          <TabsTrigger value="dinner">Dinner</TabsTrigger>
          <TabsTrigger value="snack">Snacks</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Meal List */}
      {Object.keys(entriesByDate).length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-8">No meal records found with the current filters. Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(entriesByDate)
            .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
            .map(([date, entries]) => (
              <Card key={date} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {formatDate(date)}
                    </CardTitle>
                    <Badge variant="outline" className="ml-2">
                      {entries.reduce((total, entry) => total + entry.calories, 0)} calories
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {entries.map((entry) => (
                        <div key={entry.id} className="p-4 border rounded-md hover:border-primary/50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-start gap-2">
                              <h3 className="font-medium text-lg">{entry.name}</h3>
                              <Badge className={`${getMealTypeBadgeColor(entry.mealType)}`}>
                                {entry.mealType}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span>{format(parseISO(entry.date), 'h:mm a')}</span>
                              <div>{entry.portion}</div>
                            </div>
                          </div>
                          <Separator className="my-3" />
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Calories</p>
                              <p className="font-medium text-lg">{entry.calories}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Protein</p>
                              <p className="font-medium text-lg">{entry.protein}g</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Carbs</p>
                              <p className="font-medium text-lg">{entry.carbs}g</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Fat</p>
                              <p className="font-medium text-lg">{entry.fat}g</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
      
      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{foodEntries.length}</span> of{' '}
            <span className="font-medium">{pagination.totalDocs}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <div className="text-sm font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}