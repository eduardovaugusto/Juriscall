
import React, { useState } from 'react';
import { Lawyer, LegalProcess, CallRecord, Customer, View } from '../types';
import { 
  Mail, Briefcase, Phone, Percent, Award, ChevronRight, User, Star, 
  X, FileText, Users, ListFilter, GraduationCap, MapPin, ExternalLink,
  Gavel, TrendingUp, Calculator, ShieldCheck
} from 'lucide-react';

interface LawyerManagerProps {
  lawyers: Lawyer[];
  processes: LegalProcess[];
  calls: CallRecord[];
  customers: Customer[];
  onNavigate: (view: View, filter?: string) => void;
}

const LawyerManager: React.FC<LawyerManagerProps> = ({ lawyers, processes, calls, customers, onNavigate }) => {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);

  const getLawyerStats = (lawyerName: string) => {
    const lawyerProcesses = processes.filter(p => p.lawyerName === lawyerName);
    const lawyerCalls = calls.filter(c => c.lawyerName === lawyerName);
    
    const conversionRate = lawyerCalls.length > 0 
      ? Math.round((lawyerProcesses.length / lawyerCalls.length) * 100) 
      : 0;

    const totalHonoraries = lawyerProcesses.reduce((acc, p) => acc + (p.honoraryValue || 0), 0);

    return {
      processCount: lawyerProcesses.length,
      callCount: lawyerCalls.length,
      conversionRate,
      totalHonoraries,
      lawyerProcesses,
      lawyerCalls
    };
  };

  const getLawyerClients = (lawyerName: string) => {
    const lawyerProcessCustomerIds = processes
      .filter(p => p.lawyerName === lawyerName)
      .map(p => p.customerId);
    
    const uniqueIds = Array.from(new Set(lawyerProcessCustomerIds));
    return customers.filter(c => uniqueIds.includes(c.id));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 bg-[#FFF9F9]">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Corpo Jurídico</h2>
          <p className="text-lg text-slate-400 font-medium">Gestão de performance e especialidades previdenciárias.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="flex -space-x-3">
              {lawyers.map(l => (
                <div key={l.id} className={`w-8 h-8 rounded-full border-2 border-white ${l.avatarColor} flex items-center justify-center text-[10px] font-black text-white`}>
                  {l.name[0]}
                </div>
              ))}
           </div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lawyers.length} Especialistas Ativos</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {lawyers.map(lawyer => {
          const stats = getLawyerStats(lawyer.name);
          const isPartner = lawyer.role === 'Sócio';
          
          return (
            <div key={lawyer.id} className={`bg-white rounded-[48px] border ${isPartner ? 'border-slate-900 ring-2 ring-slate-900/5' : 'border-slate-100'} shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group relative`}>
              {isPartner && (
                <div className="absolute top-6 right-6 bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 z-10">
                  <ShieldCheck size={10} className="text-amber-400" /> SÓCIO-DIRETOR
                </div>
              )}

              {/* Top Profile Section */}
              <div className="p-10 pb-6 text-center">
                <div className={`w-24 h-24 ${lawyer.avatarColor} rounded-[2.5rem] mx-auto flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-slate-200 mb-8 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {lawyer.name.split(' ').map(n => n[0]).slice(-2).join('')}
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{lawyer.name}</h3>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-[#FFF9F9] rounded-full border border-slate-100">
                   <div className={`w-1.5 h-1.5 rounded-full ${isPartner ? 'bg-slate-900' : 'bg-amber-500'}`}></div>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{lawyer.specialty}</span>
                </div>
              </div>

              {/* Performance Grid */}
              <div className="px-8 py-6 grid grid-cols-3 gap-4 border-y border-slate-50 bg-[#FFF9F9]/50">
                 <div className="text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">Processos</p>
                    <p className="text-lg font-black text-slate-900">{stats.processCount}</p>
                 </div>
                 <div className="text-center border-x border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">Triagens</p>
                    <p className="text-lg font-black text-slate-900">{stats.callCount}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">Conversão</p>
                    <p className={`text-lg font-black ${stats.conversionRate >= 80 ? 'text-emerald-600' : 'text-slate-900'}`}>{stats.conversionRate}%</p>
                 </div>
              </div>

              {/* Details & Actions */}
              <div className="p-8 space-y-6 flex-1">
                 <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold truncate">
                    <Mail size={16} className="text-slate-300 shrink-0" />
                    {lawyer.email}
                 </div>
                 
                 <div className="space-y-2">
                    <div className="flex justify-between items-end">
                       <span className="text-[9px] font-black text-slate-400 uppercase">Aderência aos Prazos</span>
                       <span className="text-[10px] font-black text-slate-900">98%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
                       <div 
                        className={`h-full ${isPartner ? 'bg-slate-900' : 'bg-amber-500'} transition-all duration-1000`}
                        style={{ width: `98%` }}
                       />
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-slate-50 mt-auto">
                 <button 
                  onClick={() => setSelectedLawyer(lawyer)}
                  className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isPartner ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900'}`}
                 >
                    Ver Perfil Completo <ChevronRight size={14} />
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Detail Modal */}
      {selectedLawyer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FFF9F9] w-full max-w-6xl rounded-[60px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh] border-8 border-slate-900/5">
            {/* Header */}
            <div className="bg-slate-900 p-12 flex justify-between items-start text-white shrink-0 relative overflow-hidden">
              <div className="absolute right-0 top-0 p-12 opacity-5 rotate-12">
                <Gavel size={300} />
              </div>
              <div className="flex items-center gap-10 relative z-10">
                <div className={`w-32 h-32 ${selectedLawyer.avatarColor} rounded-[3rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-black/30 border-4 border-white/10`}>
                   {selectedLawyer.name.split(' ').map(n => n[0]).slice(-2).join('')}
                </div>
                <div className="space-y-3">
                   <div className="flex items-center gap-4">
                    <h2 className="text-4xl font-black tracking-tighter">{selectedLawyer.name}</h2>
                    {selectedLawyer.role === 'Sócio' && (
                      <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-amber-400/20">
                        <Star size={12} className="fill-slate-900" /> SÓCIO-DIRETOR
                      </span>
                    )}
                   </div>
                   <p className="text-amber-400 font-black uppercase tracking-[0.3em] text-sm">{selectedLawyer.specialty}</p>
                   <div className="flex items-center gap-6 mt-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><Mail size={16} className="text-slate-500"/> {selectedLawyer.email}</span>
                      <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><FileText size={16} className="text-slate-500"/> {selectedLawyer.oab}</span>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLawyer(null)} 
                className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all relative z-10 hover:rotate-90"
              >
                <X size={28} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-[#FFF9F9] p-12 space-y-12 custom-scrollbar">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Left Column: Bio & Stats */}
                  <div className="lg:col-span-1 space-y-8">
                     <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-6 opacity-5"><GraduationCap size={60}/></div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <TrendingUp size={16} className="text-amber-500" /> Histórico & Especialidade
                        </h4>
                        <p className="text-base text-slate-700 leading-relaxed font-medium italic">
                           "{selectedLawyer.bio || "Especialista em Direito Previdenciário com foco em revisões de alta complexidade e planejamento para regimes próprios."}"
                        </p>
                     </section>

                     <section className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative">
                        <div className="absolute top-0 right-0 p-6 opacity-10"><Calculator size={60} /></div>
                        <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-6">Métricas de Faturamento</h4>
                        <div className="space-y-6">
                           {(() => {
                             const s = getLawyerStats(selectedLawyer.name);
                             return (
                               <>
                                 <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-slate-400">Eficiência de Conversão</span>
                                    <span className="text-3xl font-black text-white">{s.conversionRate}%</span>
                                 </div>
                                 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]" style={{ width: `${s.conversionRate}%` }}></div>
                                 </div>
                                 <div className="grid grid-cols-1 gap-4 pt-4">
                                    <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex items-center justify-between">
                                       <div>
                                          <p className="text-[9px] font-bold text-slate-500 uppercase">Honorários Projetados</p>
                                          <p className="text-2xl font-black text-white">R$ {s.totalHonoraries.toLocaleString('pt-BR')}</p>
                                       </div>
                                       <TrendingUp size={32} className="text-emerald-500 opacity-50" />
                                    </div>
                                 </div>
                               </>
                             );
                           })()}
                        </div>
                     </section>

                     <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Gestão Estratégica</h4>
                        <button onClick={() => onNavigate('processes', selectedLawyer.name)} className="w-full bg-white p-6 rounded-[30px] border border-slate-100 flex items-center justify-between group hover:bg-amber-500 hover:border-amber-500 transition-all shadow-sm">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white/20"><Briefcase size={20} className="text-slate-600 group-hover:text-white" /></div>
                              <span className="text-sm font-black text-slate-800 group-hover:text-white uppercase tracking-widest">Painel de Processos</span>
                           </div>
                           <ExternalLink size={18} className="text-slate-200 group-hover:text-white" />
                        </button>
                        <button onClick={() => onNavigate('customers', selectedLawyer.name)} className="w-full bg-white p-6 rounded-[30px] border border-slate-100 flex items-center justify-between group hover:bg-indigo-600 hover:border-indigo-600 transition-all shadow-sm">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white/20"><Users size={20} className="text-slate-600 group-hover:text-white" /></div>
                              <span className="text-sm font-black text-slate-800 group-hover:text-white uppercase tracking-widest">Lista de Segurados</span>
                           </div>
                           <ExternalLink size={18} className="text-slate-200 group-hover:text-white" />
                        </button>
                     </section>
                  </div>

                  {/* Right Column: Cases and Clients */}
                  <div className="lg:col-span-2 space-y-12">
                     <section>
                        <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                           <Users size={24} className="text-amber-500" /> Segurados sob Responsabilidade
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {getLawyerClients(selectedLawyer.name).map(client => (
                             <div 
                              key={client.id} 
                              onClick={() => onNavigate('customers', client.name)}
                              className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-amber-500 hover:shadow-xl transition-all cursor-pointer group/card"
                             >
                                <div className="w-14 h-14 rounded-2xl bg-[#FFF9F9] border border-slate-50 flex items-center justify-center font-black text-slate-400 group-hover/card:bg-amber-500 group-hover/card:text-white transition-all">
                                   {client.name[0]}
                                </div>
                                <div className="flex-1">
                                   <p className="text-base font-black text-slate-900 group-hover/card:text-amber-600 transition-colors">{client.name}</p>
                                   <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">{client.status}</p>
                                </div>
                                <ChevronRight size={20} className="text-slate-100 group-hover/card:text-amber-500 group-hover/card:translate-x-2 transition-all" />
                             </div>
                           ))}
                        </div>
                     </section>

                     <section>
                        <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                           <Briefcase size={24} className="text-amber-500" /> Carteira de Processos Ativos
                        </h4>
                        <div className="space-y-4">
                           {getLawyerStats(selectedLawyer.name).lawyerProcesses.map(proc => (
                             <div 
                              key={proc.id} 
                              onClick={() => onNavigate('processes', proc.processNumber)}
                              className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group/case hover:border-slate-900 hover:shadow-2xl transition-all cursor-pointer"
                             >
                                <div className="flex items-center gap-6">
                                   <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl group-hover/case:bg-slate-900 group-hover/case:text-white transition-all">
                                      <Calculator size={24} />
                                   </div>
                                   <div>
                                      <p className="text-lg font-black text-slate-900 group-hover/case:text-slate-600 transition-colors">{proc.title}</p>
                                      <p className="text-[11px] font-mono text-slate-400 font-bold tracking-tight">{proc.processNumber}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-8">
                                  <div className="text-right">
                                     <span className="text-[10px] font-black px-4 py-2 bg-[#FFF9F9] text-amber-600 border border-slate-100 rounded-full uppercase tracking-widest">
                                        {proc.phase}
                                     </span>
                                     <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-tighter">Início: {new Date(proc.startDate).toLocaleDateString()}</p>
                                  </div>
                                  <ChevronRight size={24} className="text-slate-100 group-hover/case:text-slate-900 group-hover/case:translate-x-2 transition-all" />
                                </div>
                             </div>
                           ))}
                        </div>
                     </section>
                  </div>
               </div>
            </div>

            {/* Footer Action */}
            <div className="p-10 bg-white border-t border-slate-100 flex justify-center shrink-0">
               <button 
                onClick={() => setSelectedLawyer(null)}
                className="px-20 py-5 bg-slate-900 text-white rounded-[25px] font-black text-[12px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-slate-300"
               >
                 Retornar à Listagem
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Insights - Re-styling for Off-White */}
      <div className="bg-slate-900 rounded-[60px] p-16 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute right-0 top-0 p-16 opacity-10 rotate-12">
            <Gavel size={180} />
         </div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-8">
               <h2 className="text-5xl font-black leading-none tracking-tighter">Cultura de Alta Performance</h2>
               <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
                  Nossa liderança jurídica combina rigor técnico com agilidade estratégica para maximizar a concessão de benefícios aos nossos segurados.
               </p>
               <div className="flex gap-6">
                  <div className="p-6 bg-white/5 rounded-[35px] border border-white/10 flex-1">
                     <p className="text-4xl font-black mb-1">100%</p>
                     <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Foco Previdenciário</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-[35px] border border-white/10 flex-1">
                     <p className="text-4xl font-black">7.2k</p>
                     <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Benefícios Concedidos</p>
                  </div>
               </div>
            </div>
            <div className="space-y-8 bg-white/5 p-10 rounded-[48px] border border-white/5 backdrop-blur-md">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Eficiência Operacional por Especialista</h4>
               {lawyers.map(l => {
                 const s = getLawyerStats(l.name);
                 return (
                   <div key={l.id} className="group">
                      <div className="flex justify-between mb-2 items-center">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg ${l.avatarColor} flex items-center justify-center font-black text-[10px]`}>
                             {l.name[0]}
                           </div>
                           <span className="text-sm font-black group-hover:text-amber-400 transition-colors">{l.name}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-black">{s.conversionRate}% Eficiência</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <div className={`h-full ${l.role === 'Sócio' ? 'bg-amber-500' : 'bg-slate-400'} group-hover:bg-white transition-all duration-1000`} style={{ width: `${s.conversionRate}%` }}></div>
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>
      </div>
    </div>
  );
};

export default LawyerManager;
