import React, { useState, useMemo, useEffect } from 'react';
import { generateSchedule, formatDateThai, getMonthName } from './utils/scheduler';
import { ViewType, WeeklySchedule, Holiday } from './types';
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
  CheckCircle2,
  UserCheck,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>(ViewType.DASHBOARD);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showLoginError, setShowLoginError] = useState(false);
  
  // Initialize schedule in state to allow modifications
  const [currentSchedule, setCurrentSchedule] = useState<WeeklySchedule[]>([]);
  
  // Swap selection state
  const [weekAIndex, setWeekAIndex] = useState<number>(0);
  const [weekBIndex, setWeekBIndex] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentSchedule(generateSchedule());
  }, []);

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

  const formatShortDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const dayS = s.getDate().toString().padStart(2, '0');
    const dayE = e.getDate().toString().padStart(2, '0');
    const month = s.toLocaleDateString('th-TH', { month: 'short' });
    return `${dayS} - ${dayE} ${month}`;
  };

  const handleExportCSV = () => {
    const BOM = "\uFEFF";
    const headers = "Week,Start Date,End Date,Lead Name,Lead Position,Co-Lead Name,Co-Lead Position,Holidays\n";
    const rows = currentSchedule.map(s => {
      const holidays = s.holidaysInWeek.map(h => h.name).join('; ');
      return `${s.weekNumber},${s.startDate},${s.endDate},"${s.lead.name}","${s.lead.position}","${s.coLead.name}","${s.coLead.position}","${holidays}"`;
    }).join('\n');
    
    const csvContent = BOM + headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'division_huddle_schedule_2026_2027.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSwap = (type: 'LEAD' | 'COLEAD' | 'BOTH') => {
    if (!isAdmin) return;
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
    
    setSuccessMessage(`สลับตารางเวรเรียบร้อยแล้ว (${type === 'BOTH' ? 'ทั้งหมด' : type})`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1054') {
      setIsAdmin(true);
      setShowLoginError(false);
      setPasswordInput('');
    } else {
      setShowLoginError(true);
      setTimeout(() => setShowLoginError(false), 3000);
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
              <h1 className="font-bold text-slate-900 leading-tight text-sm">Division Huddle</h1>
              <p className="text-[10px] text-slate-500 font-medium">Scheduler 2026-2027</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <button 
              onClick={() => setView(ViewType.DASHBOARD)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === ViewType.DASHBOARD ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <LayoutDashboard size={20} />
              <span className="text-sm">Dashboard</span>
            </button>
            <button 
              onClick={() => setView(ViewType.CALENDAR)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === ViewType.CALENDAR ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <CalendarIcon size={20} />
              <span className="text-sm">Monthly View</span>
            </button>
            <button 
              onClick={() => setView(ViewType.LIST)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === ViewType.LIST ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <List size={20} />
              <span className="text-sm">Full Schedule</span>
            </button>
            <button 
              onClick={() => setView(ViewType.SWAP)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === ViewType.SWAP ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <ArrowLeftRight size={20} />
              <span className="text-sm">Manage Shifts</span>
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100 space-y-4">
          {isAdmin ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold">
              <ShieldCheck size={14} />
              <span>Admin Mode Active</span>
            </div>
          ) : (
             <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold">
              <Lock size={14} />
              <span>Read Only Mode</span>
            </div>
          )}
          <button 
            onClick={handleExportCSV}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-xs font-medium"
          >
            <Download size={16} />
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
            <p className="text-slate-500 text-sm">Bangkok Hospital Division Huddle Schedule</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {view !== ViewType.SWAP && (
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search name or department..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>
            )}
            {isAdmin && (
              <button 
                onClick={() => setIsAdmin(false)}
                className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
              >
                Logout Admin
              </button>
            )}
          </div>
        </header>

        {/* Admin Restriction Notice */}
        {view === ViewType.SWAP && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800">
            <ShieldAlert size={20} className="shrink-0" />
            <p className="text-sm font-semibold">
              หมายเหตุ: การแก้ไขตารางเวรอนุญาตให้เฉพาะ Admin เท่านั้น
            </p>
          </div>
        )}

        {successMessage && (
          <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
            <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
              <CheckCircle2 size={24} />
              <span className="font-semibold text-sm">{successMessage}</span>
            </div>
          </div>
        )}

        {view === ViewType.DASHBOARD && currentWeek && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
                  <CalendarCheck size={28} />
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Active Weeks</p>
                  <p className="text-2xl font-bold text-slate-900">{currentSchedule.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-600">
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Total Assignments</p>
                  <p className="text-2xl font-bold text-slate-900">{currentSchedule.length * 2}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Total Holidays</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {currentSchedule.reduce((acc, curr) => acc + curr.holidaysInWeek.length, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold opacity-90">Current Assignments</h3>
                  <p className="text-2xl font-bold">{currentWeek.startDate} — {currentWeek.endDate}</p>
                </div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Lead Team (Manager)</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                      {currentWeek.lead.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 leading-tight">{currentWeek.lead.name}</h4>
                      <p className="text-slate-500 text-xs">{currentWeek.lead.position}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Co-Lead Team (HOD)</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl">
                      {currentWeek.coLead.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 leading-tight">{currentWeek.coLead.name}</h4>
                      <p className="text-slate-500 text-xs">{currentWeek.coLead.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === ViewType.SWAP && !isAdmin && (
          <div className="max-w-md mx-auto w-full py-12 animate-in zoom-in-95 fade-in duration-300">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl text-center space-y-6">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto">
                <KeyRound size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Admin Authentication</h3>
                <p className="text-slate-500 text-sm mt-2">
                  Please enter the admin password to access shift management tools.
                </p>
              </div>
              
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Password</label>
                  <input 
                    type="password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password..."
                    className={`w-full px-5 py-4 bg-slate-50 border ${showLoginError ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all`}
                  />
                  {showLoginError && (
                    <p className="text-xs font-semibold text-red-500 ml-1">Incorrect password. Please try again.</p>
                  )}
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
                >
                  <span>Authenticate</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
              
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-4">
                Restricted Access
              </p>
            </div>
          </div>
        )}

        {view === ViewType.SWAP && isAdmin && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Selector A */}
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Selection A</label>
                    <select 
                      value={weekAIndex}
                      onChange={(e) => setWeekAIndex(parseInt(e.target.value))}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {currentSchedule.map((w, idx) => (
                        <option key={idx} value={idx}>Week {w.weekNumber} ({w.startDate} — {w.endDate}) - {w.lead.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {currentSchedule[weekAIndex].lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase">Lead (Manager)</p>
                        <p className="text-sm font-bold text-slate-900">{currentSchedule[weekAIndex].lead.name}</p>
                        <p className="text-[10px] text-slate-400">{currentSchedule[weekAIndex].lead.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                        {currentSchedule[weekAIndex].coLead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase">Co-Lead (HOD)</p>
                        <p className="text-sm font-bold text-slate-900">{currentSchedule[weekAIndex].coLead.name}</p>
                        <p className="text-[10px] text-slate-400">{currentSchedule[weekAIndex].coLead.department}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selector B */}
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Selection B</label>
                    <select 
                      value={weekBIndex}
                      onChange={(e) => setWeekBIndex(parseInt(e.target.value))}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {currentSchedule.map((w, idx) => (
                        <option key={idx} value={idx}>Week {w.weekNumber} ({w.startDate} — {w.endDate}) - {w.lead.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {currentSchedule[weekBIndex].lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase">Lead (Manager)</p>
                        <p className="text-sm font-bold text-slate-900">{currentSchedule[weekBIndex].lead.name}</p>
                        <p className="text-[10px] text-slate-400">{currentSchedule[weekBIndex].lead.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                        {currentSchedule[weekBIndex].coLead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase">Co-Lead (HOD)</p>
                        <p className="text-sm font-bold text-slate-900">{currentSchedule[weekBIndex].coLead.name}</p>
                        <p className="text-[10px] text-slate-400">{currentSchedule[weekBIndex].coLead.department}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => handleSwap('LEAD')} 
                className="flex flex-col items-center justify-center gap-2 bg-blue-600 text-white p-6 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
              >
                <UserCheck size={24} />
                <span>Swap Leads Only</span>
              </button>
              <button 
                onClick={() => handleSwap('COLEAD')} 
                className="flex flex-col items-center justify-center gap-2 bg-emerald-600 text-white p-6 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95"
              >
                <UserCheck size={24} />
                <span>Swap Co-Leads Only</span>
              </button>
              <button 
                onClick={() => handleSwap('BOTH')} 
                className="flex flex-col items-center justify-center gap-2 bg-slate-900 text-white p-6 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                <ArrowLeftRight size={24} />
                <span>Swap Entire Turn</span>
              </button>
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
                  {(weeks as WeeklySchedule[]).map((w) => (
                    <div key={w.weekNumber} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">W{w.weekNumber}</span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md mt-1 w-fit">
                            {formatShortDateRange(w.startDate, w.endDate)}
                          </span>
                        </div>
                        {w.holidaysInWeek.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[8px] text-blue-600 font-bold uppercase">Lead</p>
                          <p className="text-xs font-bold text-slate-900 truncate">{w.lead.name}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-emerald-600 font-bold uppercase">Co-Lead</p>
                          <p className="text-xs font-bold text-slate-900 truncate">{w.coLead.name}</p>
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
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Week</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Dates (Start — End)</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Lead Team</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Co-Lead Team</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Holidays</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchedule.map((w) => (
                    <tr key={w.weekNumber} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-900">W{w.weekNumber}</td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                        {w.startDate} <span className="mx-1 text-slate-300">—</span> {w.endDate}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-900">{w.lead.name}</p>
                        <p className="text-[10px] text-slate-500">{w.lead.position}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-900">{w.coLead.name}</p>
                        <p className="text-[10px] text-slate-500">{w.coLead.position}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {w.holidaysInWeek.map((h, i) => (
                            <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[8px] font-bold rounded-md border border-amber-100">
                              {h.name}
                            </span>
                          ))}
                        </div>
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