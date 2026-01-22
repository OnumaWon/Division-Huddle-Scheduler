
export interface Employee {
  name: string;
  position: string;
  department: string;
}

export interface Holiday {
  date: string; // ISO string YYYY-MM-DD
  name: string;
}

export interface WeeklySchedule {
  weekNumber: number;
  startDate: string; // ISO string (Monday)
  endDate: string; // ISO string (Friday)
  lead: Employee;
  coLead: Employee;
  workingDays: string[]; // List of dates YYYY-MM-DD excluding holidays
  holidaysInWeek: Holiday[];
}

export enum ViewType {
  CALENDAR = 'CALENDAR',
  LIST = 'LIST',
  DASHBOARD = 'DASHBOARD',
  SWAP = 'SWAP',
  HOLIDAYS = 'HOLIDAYS'
}
