
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { CallRecord, FinancialTransaction } from '../types';
import { Phone, Users, TrendingUp, DollarSign, ArrowUpRight, Briefcase, Calendar } from 'lucide-react';

interface DashboardProps {
  calls: CallRecord[];
  transactions: FinancialTransaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ calls, transactions }) => {
  const stats = useMemo(() => {
    const total = calls.length;
    const firstTime = calls.filter(c => c.isFirstTime).length;

    // Financial calculations
    const revenue = transactions.filter(t => t.type === 'Entrada' && t.status === 'Pago').reduce((acc, t) => acc + t.amount, 0);
    const pendingFinance = transactions.filter(t => t.type === 'Entrada' && t.status !== 'Pago').reduce((acc, t) => acc + t.amount, 0);

    // Lawyer Distribution
    const lawyerMap: Record<string, number> = {};
    calls.forEach(c => {
      lawyerMap[c.lawyerName] = (lawyerMap[c.lawyerName] || 0) + 1;
    });
    const callsPerLawyer = Object.entries(lawyerMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Category Distribution (for list view instead of pie)
    const categoryMap: Record<string, number> = {};
    calls.forEach(c => {
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Calls by Day (Last 7 days) - Area Chart
    const dayMap: Record<string, number> = {};
    const last7Days = Array.from({length: 7}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('pt-BR', { weekday: 'short' });
    }).reverse();

    last7Days.forEach(day => dayMap[day] = 0);
    calls.forEach(c => {
      const day = new Date(c.dateTime).toLocaleDateString('pt-BR', { weekday: 'short' });
      if (dayMap[day] !== undefined) dayMap[day]++;
    });

    const trendData = last7Days.map(day => ({ date: day, total: dayMap[day] }));

    return { total, firstTime, topCategories, callsPerLawyer, trendData, revenue, pendingFinance };
  }, [calls, transactions]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Top Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Atendimentos" 
          value={stats.total} 
          icon={<Phone size={20} />} 
          color="blue"
          trend="+12% este mês"
        />
        <StatCard 
          title="Receita Realizada" 
          value={`R$ ${stats.revenue.toLocaleString('pt-BR')}`} 
          icon={<DollarSign size={20} />} 
          color="emerald"
          trend="+8% vs meta"
        />
        <StatCard 
          title="Novos Leads" 
          value={stats.firstTime} 
          icon={<Users size={20} />} 
          color="amber"
          trend="Crescimento constante"
        />
        <StatCard 
          title="Conversão" 
          value={`${Math.round((stats.firstTime/stats.total || 0) * 100)}%`} 
          icon={<TrendingUp size={20} />} 
          color="purple"
          trend="Alta performance"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Fluxo de Demandas</h3>
              <p className="text-sm text-slate-400">Volume de chamadas nos últimos 7 dias</p>
            </div>
            <div className="flex gap-2">
               <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  <Calendar size={12} /> ESTA SEMANA
               </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trendData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#1e40af' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Quick Card */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
              <DollarSign size={140} />
           </div>
           
           <div>
              <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Saúde Financeira</p>
              <h3 className="text-2xl font-bold mb-8">Resumo de Caixa</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-slate-400 text-xs mb-1 font-medium">Faturamento Confirmado</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">R$ {stats.revenue.toLocaleString('pt-BR')}</span>
                    <ArrowUpRight size={16} className="text-emerald-400" />
                  </div>
                </div>
                
                <div className="h-px bg-slate-800 w-full"></div>
                
                <div>
                  <p className="text-slate-400 text-xs mb-1 font-medium">Honorários em Aberto</p>
                  <p className="text-xl font-bold text-slate-200">R$ {stats.pendingFinance.toLocaleString('pt-BR')}</p>
                </div>
              </div>
           </div>

           <div className="mt-8">
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-2xl text-xs font-bold border border-white/10">
                Gerar Relatório Completo
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lawyer Productivity - Cleaner Bars */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Briefcase size={18} className="text-slate-400" /> Produtividade por Advogado
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.callsPerLawyer} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                  width={140}
                />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={16}>
                   {stats.callsPerLawyer.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories - List View (Better than Pie for clean look) */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-slate-400" /> Assuntos Predominantes
          </h3>
          <div className="space-y-5">
             {stats.topCategories.map((cat, idx) => (
               <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-semibold text-slate-700">{cat.name}</span>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-amber-500 transition-colors">{cat.value} ligações</span>
                  </div>
                  <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-amber-500' : 'bg-slate-200'}`}
                      style={{ width: `${(cat.value / stats.total) * 100}%` }}
                    ></div>
                  </div>
               </div>
             ))}
             {stats.topCategories.length === 0 && (
               <div className="text-center py-10 text-slate-400 text-sm italic">
                  Aguardando registros para análise...
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend }: any) => {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100"
  };

  return (
    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]} border`}>
          {icon}
        </div>
        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</h4>
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
      <p className="mt-2 text-[10px] font-bold text-slate-400 flex items-center gap-1">
        <ArrowUpRight size={10} className="text-emerald-500" /> {trend}
      </p>
    </div>
  );
};

export default Dashboard;
