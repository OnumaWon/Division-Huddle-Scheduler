
import React, { useState, useMemo, useEffect } from 'react';
import { generateSchedule, formatDateThai, getMonthName } from './utils/scheduler';
import { ViewType, WeeklySchedule } from './types';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  List, 
  Download, 
  Search,
  Users,
  CalendarCheck,
  Building2,
  AlertCircle,
  ArrowLeftRight,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>(ViewType.DASHBOARD);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize schedule in state to allow modifications (swaps)
  const [currentSchedule, setCurrentSchedule] = useState<WeeklySchedule[]>([]);
  
  // Swap selection state
  const [weekAIndex, setWeekAIndex] = useState<number>(0);
  const [weekBIndex, setWeekBIndex] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentSchedule(generateSchedule());
  }, []);

  // Explicitly type filteredSchedule to avoid inference issues
  const filteredSchedule: WeeklySchedule[] = useMemo(() => {
    if (!searchTerm) return currentSchedule;
    const lowerSearch = searchTerm.toLowerCase();
    return currentSchedule.filter(s => 
      s.lead.name.toLowerCase().includes(lowerSearch) ||
      s.coLead.name.toLowerCase().includes(lowerSearch) ||
      s.lead.department.toLowerCase().includes(lowerSearch) ||
      s.coLead.department.toLowerCase().includes(lowerSearch)
    );
  }, [currentSchedule, searchTerm]);

  // Explicitly type the result of groupedByMonth to help Object.entries inference
  const groupedByMonth = useMemo<Record<string, WeeklySchedule[]>>(() => {
    return filteredSchedule.reduce((acc, curr) => {
      const month = getMonthName(curr.startDate);
      if (!acc[month]) acc[month] = [];
      acc[month].push(curr);
      return acc;
    }, {} as Record<string, WeeklySchedule[]>);
  }, [filteredSchedule]);

  const currentWeek = useMemo(() => {
    if (currentSchedule.length === 0) return null;
    const today = new Date().toISOString().split('T')[0];
    return currentSchedule.find(w => today >= w.startDate && today <= w.endDate) || currentSchedule[0];
  }, [currentSchedule]);

  const handleExportCSV = () => {
    const headers = "Week,Start Date,End Date,Lead Name,Lead Position,Co-Lead Name,Co-Lead Position,Holidays\n";
    const rows = currentSchedule.map(s => {
      const holidays = s.holidaysInWeek.map(h => h.name).join('; ');
      return `${s.weekNumber},${s.startDate},${s.endDate},"${s.lead.name}","${s.lead.position}","${s.coLead.name}","${s.coLead.position}","${holidays}"`;
    }).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'division_huddle_schedule_2026_2027.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSwap = (type: 'LEAD' | 'COLEAD' | 'BOTH') => {
    const newSchedule = [...currentSchedule];
    const weekA = { ...newSchedule[weekAIndex] };
    const weekB = { ...newSchedule[weekBIndex] };

    if (type === 'LEAD' || type === 'BOTH') {
      const tempLead = weekA.lead;
      weekA.lead = weekB.lead;
      weekB.lead = tempLead;
    }

    if (type === 'COLEAD' || type === 'BOTH') {
      const tempCoLead = weekA.coLead;
      weekA.coLead = weekB.coLead;
      weekB.coLead = tempCoLead;
    }

    newSchedule[weekAIndex] = weekA;
    newSchedule[weekBIndex] = weekB;
    setCurrentSchedule(newSchedule);
    
    setSuccessMessage(`Successfully swapped ${type.toLowerCase()} assignments!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const resetSchedule = () => {
    if (confirm("Are you sure you want to reset all changes to the original generated schedule?")) {
      setCurrentSchedule(generateSchedule());
    }
  };

  if (currentSchedule.length === 0) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-auto md:h-screen z-30">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Division Huddle</h1>
              <p className="text-xs text-slate-500 font-medium">Scheduler 2026-2027</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <button 
              onClick={() => setView(ViewType.DASHBOARD)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === ViewType.DASHBOARD ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => setView(ViewType.CALENDAR)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === ViewType.CALENDAR ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <CalendarIcon size={20} />
              <span>Monthly View</span>
            </button>
            <button 
              onClick={() => setView(ViewType.LIST)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === ViewType.LIST ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <List size={20} />
              <span>Full Schedule</span>
            </button>
            <button 
              onClick={() => setView(ViewType.SWAP)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === ViewType.SWAP ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <ArrowLeftRight size={20} />
              <span>Manage Shifts</span>
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100 space-y-2">
          <button 
            onClick={resetSchedule}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-sm font-medium"
          >
            <RotateCcw size={18} />
            <span>Reset Schedule</span>
          </button>
          <button 
            onClick={handleExportCSV}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-sm font-medium"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {view === ViewType.DASHBOARD && "Overview"}
              {view === ViewType.CALENDAR && "Calendar View"}
              {view === ViewType.LIST && "All Assignments"}
              {view === ViewType.SWAP && "Manage & Swap Shifts"}
            </h2>
            <p className="text-slate-500">Bangkok Hospital Division Huddle Schedule</p>
          </div>
          
          {view !== ViewType.SWAP && (
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or department..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
          )}
        </header>

        {/* Success Message Toast */}
        {successMessage && (
          <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
            <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
              <CheckCircle2 size={24} />
              <span className="font-semibold">{successMessage}</span>
            </div>
          </div>
        )}

        {/* View Content */}
        {view === ViewType.DASHBOARD && currentWeek && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
                  <CalendarCheck size={28} />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Active Weeks</p>
                  <p className="text-2xl font-bold text-slate-900">{currentSchedule.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-600">
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Total Assignments</p>
                  <p className="text-2xl font-bold text-slate-900">{currentSchedule.length * 2}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Holidays Managed</p>
                  <p className="text-2xl font-bold text-slate-900">18</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold opacity-90">Current/Target Week</h3>
                  <p className="text-2xl font-bold">Week of {formatDateThai(currentWeek.startDate)}</p>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  Active Schedule
                </div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Lead Team (Manager)</p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl text-center p-2">
                      {currentWeek.lead.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 leading-tight">{currentWeek.lead.name}</h4>
                      <p className="text-slate-500 text-sm">{currentWeek.lead.position}</p>
                      <p className="text-slate-400 text-xs">{currentWeek.lead.department}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Co-Lead Team (HOD)</p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl text-center p-2">
                      {currentWeek.coLead.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 leading-tight">{currentWeek.coLead.name}</h4>
                      <p className="text-slate-500 text-sm">{currentWeek.coLead.position}</p>
                      <p className="text-slate-400 text-xs">{currentWeek.coLead.department}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === ViewType.SWAP && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <ArrowLeftRight size={20} />
              </div>
              <div>
                <h3 className="font-bold text-blue-900">Shift Management Tool</h3>
                <p className="text-sm text-blue-700 mt-1">Select two weeks to swap their assigned Lead or Co-Lead personnel. Changes will be reflected across all views and the CSV export.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Selector A */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">Assignment A</span>
                  <span className="text-slate-400 text-sm font-medium">Week {currentSchedule[weekAIndex].weekNumber}</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Select Target Week</label>
                  <select 
                    value={weekAIndex}
                    onChange={(e) => setWeekAIndex(parseInt(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  >
                    {currentSchedule.map((w, i) => (
                      <option key={i} value={i}>Week {w.weekNumber}: {formatDateThai(w.startDate).split(' ')[0]} {formatDateThai(w.startDate).split(' ')[1]}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">{currentSchedule[weekAIndex].lead.name.charAt(0)}</div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Lead (Manager)</p>
                      <p className="text-sm font-bold text-slate-900">{currentSchedule[weekAIndex].lead.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">{currentSchedule[weekAIndex].coLead.name.charAt(0)}</div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Co-Lead (HOD)</p>
                      <p className="text-sm font-bold text-slate-900">{currentSchedule[weekAIndex].coLead.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selector B */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">Assignment B</span>
                  <span className="text-slate-400 text-sm font-medium">Week {currentSchedule[weekBIndex].weekNumber}</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Select Target Week</label>
                  <select 
                    value={weekBIndex}
                    onChange={(e) => setWeekBIndex(parseInt(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  >
                    {currentSchedule.map((w, i) => (
                      <option key={i} value={i}>Week {w.weekNumber}: {formatDateThai(w.startDate).split(' ')[0]} {formatDateThai(w.startDate).split(' ')[1]}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">{currentSchedule[weekBIndex].lead.name.charAt(0)}</div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Lead (Manager)</p>
                      <p className="text-sm font-bold text-slate-900">{currentSchedule[weekBIndex].lead.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">{currentSchedule[weekBIndex].coLead.name.charAt(0)}</div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Co-Lead (HOD)</p>
                      <p className="text-sm font-bold text-slate-900">{currentSchedule[weekBIndex].coLead.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Choose Swap Operation</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  disabled={weekAIndex === weekBIndex}
                  onClick={() => handleSwap('LEAD')}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-200 text-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <ArrowLeftRight className="group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">Swap Leads Only</span>
                  <span className="text-[10px] opacity-60">Managers will exchange weeks</span>
                </button>
                <button 
                  disabled={weekAIndex === weekBIndex}
                  onClick={() => handleSwap('COLEAD')}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-emerald-50 hover:bg-emerald-100 rounded-2xl border border-emerald-200 text-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <ArrowLeftRight className="group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">Swap Co-Leads Only</span>
                  <span className="text-[10px] opacity-60">HODs will exchange weeks</span>
                </button>
                <button 
                  disabled={weekAIndex === weekBIndex}
                  onClick={() => handleSwap('BOTH')}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-900 hover:bg-slate-800 rounded-2xl border border-slate-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <ArrowLeftRight className="group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">Swap Entire Team</span>
                  <span className="text-[10px] opacity-60">Exchange both Lead and Co-lead</span>
                </button>
              </div>
              {weekAIndex === weekBIndex && (
                <p className="text-center mt-6 text-xs text-rose-500 font-medium">Please select two different weeks to perform a swap.</p>
              )}
            </div>
          </div>
        )}

        {view === ViewType.CALENDAR && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {Object.entries(groupedByMonth).map(([month, weeks]) => (
              <section key={month}>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  {month}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Fixed Property 'map' does not exist on type 'unknown' by casting weeks to WeeklySchedule[] */}
                  {(weeks as WeeklySchedule[]).map((w) => (
                    <div key={w.weekNumber} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Week {w.weekNumber}</span>
                        {w.holidaysInWeek.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] text-blue-600 font-bold uppercase">Lead</p>
                          <p className="text-sm font-bold text-slate-900 truncate">{w.lead.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase">Co-Lead</p>
                          <p className="text-sm font-bold text-slate-900 truncate">{w.coLead.name}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-50">
                          <p className="text-[10px] text-slate-400 font-medium">
                            {formatDateThai(w.startDate).split(' ')[0]} - {formatDateThai(w.endDate).split(' ')[0]} {formatDateThai(w.endDate).split(' ')[1]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {view === ViewType.LIST && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Week</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date Range</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Lead Team (Manager)</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Co-Lead Team (HOD)</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Holidays</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchedule.map((w) => (
                    <tr key={w.weekNumber} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                          {w.weekNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">{formatDateThai(w.startDate)}</span>
                          <span className="text-xs text-slate-400">to {formatDateThai(w.endDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                            {w.lead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{w.lead.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">{w.lead.position}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
                            {w.coLead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{w.coLead.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">{w.coLead.position}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {w.holidaysInWeek.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {w.holidaysInWeek.map((h, i) => (
                              <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md border border-amber-100">
                                {h.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
