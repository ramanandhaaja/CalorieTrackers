// Helper function to get today's date range in the user's timezone
export function getTodayDateRange() {
  // Use the current date in the user's timezone
  const now = new Date();
  
  // Create start of day in user's timezone
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  
  // Create end of day in user's timezone
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Log the date range for debugging
  console.log('Today date range (local):', {
    now: now.toISOString(),
    startOfDay: startOfDay.toISOString(),
    endOfDay: endOfDay.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  
  return {
    startOfDay: startOfDay.toISOString(),
    endOfDay: endOfDay.toISOString()
  };
}

// Helper function to get this week's date range
export function getWeekDateRange() {
  const now = new Date();
  
  // Get the day of the week (1 = Monday, 2 = Tuesday, etc., 0 = Sunday)
  const dayOfWeek = now.getDay();
  
  // Convert Sunday (0) to 7 for easier calculation
  const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
  
  // Calculate the start of the week (Monday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - (adjustedDayOfWeek - 1));
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Calculate the end of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  // Log the date range for debugging
  console.log('Week date range:', {
    now: now.toISOString(),
    dayOfWeek: dayOfWeek,
    adjustedDayOfWeek: adjustedDayOfWeek,
    startOfWeek: startOfWeek.toISOString(),
    endOfWeek: endOfWeek.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  
  return {
    startOfWeek: startOfWeek.toISOString(),
    endOfWeek: endOfWeek.toISOString()
  };
}

// Helper function to get a date range for a specific date range
export function getDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  return {
    startDate: start.toISOString(),
    endDate: end.toISOString()
  };
}

// Helper function to format a date as YYYY-MM-DD
export function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Helper function to group entries by date (YYYY-MM-DD)
export function groupEntriesByDate<T extends { date: string }>(entries: T[]): Record<string, T[]> {
  const groupedEntries: Record<string, T[]> = {};
  
  entries.forEach(entry => {
    const date = new Date(entry.date);
    const dateKey = formatDateToYYYYMMDD(date);
    
    if (!groupedEntries[dateKey]) {
      groupedEntries[dateKey] = [];
    }
    
    groupedEntries[dateKey].push(entry);
  });
  
  return groupedEntries;
}
