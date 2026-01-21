
import { 
  GENERAL_MANAGERS, 
  LAST_PRIORITY_MANAGERS, 
  PRIORITY_HODS, 
  GENERAL_HODS, 
  HOLIDAYS_2026 
} from '../constants';
import { WeeklySchedule, Employee, Holiday } from '../types';

/**
 * Generates the Division Huddle schedule from Feb 2026 to Jan 2027.
 */
export const generateSchedule = (): WeeklySchedule[] => {
  const schedules: WeeklySchedule[] = [];
  
  // Define start and end boundaries
  const startDate = new Date('2026-02-02'); // First Monday of Feb 2026
  const endDate = new Date('2027-01-31');
  
  // Combine lists based on requirements
  const managersPool = [...GENERAL_MANAGERS, ...LAST_PRIORITY_MANAGERS];
  const hodsPool = [...PRIORITY_HODS, ...GENERAL_HODS];
  
  let currentMonday = new Date(startDate);
  let weekIndex = 0;
  
  while (currentMonday <= endDate) {
    // Lead Team (Managers) Cycle
    const lead = managersPool[weekIndex % managersPool.length];
    
    // Co-lead Team (HODs) Cycle
    const coLead = hodsPool[weekIndex % hodsPool.length];
    
    // Calculate Friday of the same week
    const currentFriday = new Date(currentMonday);
    currentFriday.setDate(currentMonday.getDate() + 4);
    
    // Determine working days and find holidays within this week
    const workingDays: string[] = [];
    const holidaysInWeek: Holiday[] = [];
    
    for (let i = 0; i < 5; i++) {
      const day = new Date(currentMonday);
      day.setDate(currentMonday.getDate() + i);
      const dateString = day.toISOString().split('T')[0];
      
      const holiday = HOLIDAYS_2026.find(h => h.date === dateString);
      if (holiday) {
        holidaysInWeek.push(holiday);
      } else {
        workingDays.push(dateString);
      }
    }
    
    schedules.push({
      weekNumber: weekIndex + 1,
      startDate: currentMonday.toISOString().split('T')[0],
      endDate: currentFriday.toISOString().split('T')[0],
      lead,
      coLead,
      workingDays,
      holidaysInWeek
    });
    
    // Advance to next Monday
    currentMonday.setDate(currentMonday.getDate() + 7);
    weekIndex++;
  }
  
  return schedules;
};

export const formatDateThai = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const getMonthName = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
};
