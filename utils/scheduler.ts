
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
 * Applies specific manual overrides for leads and swaps for co-leads as requested.
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
    const weekNumber = weekIndex + 1;
    
    // 1. LEAD ASSIGNMENT (Manager)
    let lead = managersPool[weekIndex % managersPool.length];
    
    /**
     * Lead Overrides:
     * W2 Lead: สุพรรณิการ์ พูนธนานิวัฒน์กุล
     * W4 Lead: ปฏิพัทธฬ์ ประเสริฐวิทยากิจ
     * W36 Lead: ราตรี แซ่ตัน
     * W38 Lead: นิติพงศ์ รักมาก
     */
    if (weekNumber === 2) {
      const override = managersPool.find(m => m.name.includes("สุพรรณิการ์ พูนธนานิวัฒน์กุล"));
      if (override) lead = override;
    } else if (weekNumber === 4) {
      const override = managersPool.find(m => m.name.includes("ปฏิพัทธฬ์ ประเสริฐวิทยากิจ"));
      if (override) lead = override;
    } else if (weekNumber === 36) {
      const override = managersPool.find(m => m.name.includes("ราตรี แซ่ตัน"));
      if (override) lead = override;
    } else if (weekNumber === 38) {
      const override = managersPool.find(m => m.name.includes("นิติพงศ์ รักมาก"));
      if (override) lead = override;
    }
    
    // 2. CO-LEAD ASSIGNMENT (HOD)
    let coLead = hodsPool[weekIndex % hodsPool.length];
    
    /**
     * Co-Lead Overrides (Swaps):
     * W42 <-> W45
     * W51 <-> W52
     */
    if (weekNumber === 42) {
      coLead = hodsPool[(45 - 1) % hodsPool.length];
    } else if (weekNumber === 45) {
      coLead = hodsPool[(42 - 1) % hodsPool.length];
    } else if (weekNumber === 51) {
      coLead = hodsPool[(52 - 1) % hodsPool.length];
    } else if (weekNumber === 52) {
      coLead = hodsPool[(51 - 1) % hodsPool.length];
    }
    
    // 3. DATE AND HOLIDAY CALCULATIONS
    const currentFriday = new Date(currentMonday);
    currentFriday.setDate(currentMonday.getDate() + 4);
    
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
      weekNumber,
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
