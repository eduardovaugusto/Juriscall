
import React, { useState } from 'react';
import { Lawyer, LegalProcess, CallRecord, Customer, View } from '../types';
import { 
  Mail, Briefcase, Phone, Percent, Award, ChevronRight, User, Star, 
  X, FileText, Users, ListFilter, GraduationCap, MapPin, ExternalLink,
  Gavel
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

    return {
      processCount: lawyerProcesses.length,
      callCount: lawyerCalls.length,
      conversionRate,
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {lawyers.map(lawyer => {
          const stats = getLawyerStats(lawyer.name);
          const isPartner = lawyer.role === 'Sócio';
          
          return (
            <div key={lawyer.id} className={`bg-white rounded-[32px] border ${isPartner ? 'border-slate-900 ring-1 ring-slate-900/5' : 'border-slate-100'} shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group relative`}>
              {isPartner && (
                <div className="absolute top-4 right-4 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={10} className="fill-amber-400 text-amber-400" /> SÓCIO
                </div>
              )}

              {/* Header with Avatar */}
              <div className="p-8 pb-4 text-center">
                <div className={`w-20 h-20 ${lawyer.avatarColor} rounded-[1.8rem] mx-auto flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-slate-200 mb-6 transform group-hover:scale-105 transition-transform`}>
                  {lawyer.name.split(' ').map(n => n[0]).slice(-2).join('')}
                </div>
                <h3 className="text-lg font-black text-slate-900">{lawyer.name}</h3>
                <p className={`text-[10px] font-bold ${isPartner ? 'text-slate-600' : 'text-amber-600'} mt-1 uppercase tracking-widest`}>{lawyer.specialty}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">{lawyer.oab}</p>
              </div>

              {/* Stats Bar */}
              <div className="px-6 py-4 grid grid-cols-3 gap-2 border-y border-slate-50 bg-slate-50/30">
                 <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Casos</p>
                    <p className="text-sm font-black text-slate-900">{stats.processCount}</p>
                 </div>
                 <div className="text-center border-x border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Ligs</p>
                    <p className="text-sm font-black text-slate-900">{stats.callCount}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Conv</p>
                    <p className={`text-sm font-black ${stats.conversionRate >= 80 ? 'text-emerald-600' : 'text-slate-900'}`}>{stats.conversionRate}%</p>
                 </div>
              </div>

              {/* Content List */}
              <div className="p-6 space-y-4 flex-1">
                 <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <Mail size={14} className="text-slate-300 shrink-0" />
                    <span className="truncate">{lawyer.email}</span>
                 </div>
                 
                 <div className="pt-2">
                    <div className="w-full h-1.5 bg-slate-50 rounded-full border border-slate-100 overflow-hidden relative">
                       <div 
                        className={`h-full ${isPartner ? 'bg-slate-900' : 'bg-amber-500'} transition-all duration-1000`}
                        style={{ width: `${stats.conversionRate}%` }}
                       />
                    </div>
                 </div>
              </div>

              {/* Action */}
              <div className="p-4 bg-slate-50 mt-auto">
                 <button 
                  onClick={() => setSelectedLawyer(lawyer)}
                  className={`w-full py-2.5 bg-white border ${isPartner ? 'border-slate-900 text-slate-900' : 'border-slate-200 text-slate-600'} rounded-xl text-[11px] font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-2`}
                 >
                    Visualizar Perfil <ChevronRight size={12} />
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Detail Modal */}
      {selectedLawyer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-slate-900 p-8 flex justify-between items-start text-white shrink-0 relative overflow-hidden">
              <div className="absolute right-0 top-0 p-8 opacity-5">
                <Gavel size={200} />
              </div>
              <div className="flex items-center gap-6 relative z-10">
                <div className={`w-24 h-24 ${selectedLawyer.avatarColor} rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-black/20`}>
                   {selectedLawyer.name.split(' ').map(n => n[0]).slice(-2).join('')}
                </div>
                <div>
                   <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black">{selectedLawyer.name}</h2>
                    {selectedLawyer.role === 'Sócio' && (
                      <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star size={10} className="fill-slate-900" /> SÓCIO-DIRETOR
                      </span>
                    )}
                   </div>
                   <p className="text-amber-400 font-bold uppercase tracking-widest text-sm mt-1">{selectedLawyer.specialty}</p>
                   <div className="flex items-center gap-4 mt-3 text-slate-400 text-xs font-medium">
                      <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-500"/> {selectedLawyer.email}</span>
                      <span className="flex items-center gap-1.5"><FileText size={14} className="text-slate-500"/> {selectedLawyer.oab}</span>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLawyer(null)} 
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors relative z-10"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8 space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Bio & Stats */}
                  <div className="lg:col-span-1 space-y-6">
                     <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <GraduationCap size={16} /> Currículo Profissional
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                           "{selectedLawyer.bio || "Advogado especializado com foco em resultados e excelência jurídica no escritório JurisCall."}"
                        </p>
                     </section>

                     <section className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
                        <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4">KPIs de Performance</h4>
                        <div className="space-y-4">
                           {(() => {
                             const s = getLawyerStats(selectedLawyer.name);
                             return (
                               <>
                                 <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-slate-400">Eficiência de Fechamento</span>
                                    <span className="text-2xl font-black text-white">{s.conversionRate}%</span>
                                 </div>
                                 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400" style={{ width: `${s.conversionRate}%` }}></div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                       <p className="text-[9px] font-bold text-slate-500 uppercase">Casos Totais</p>
                                       <p className="text-xl font-black text-white">{s.processCount}</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                       <p className="text-[9px] font-bold text-slate-500 uppercase">Atendimentos</p>
                                       <p className="text-xl font-black text-white">{s.callCount}</p>
                                    </div>
                                 </div>
                               </>
                             );
                           })()}
                        </div>
                     </section>

                     {/* Quick Actions / Navigation */}
                     <section className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Ações de Gestão</h4>
                        <button 
                          onClick={() => onNavigate('processes', selectedLawyer.name)}
                          className="w-full bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between group hover:bg-amber-500 hover:border-amber-500 transition-all"
                        >
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-white/20">
                                 <Briefcase size={16} className="text-slate-600 group-hover:text-white" />
                              </div>
                              <span className="text-xs font-bold text-slate-700 group-hover:text-white">Gerenciar Processos</span>
                           </div>
                           <ExternalLink size={14} className="text-slate-300 group-hover:text-white" />
                        </button>
                        <button 
                          onClick={() => onNavigate('customers', selectedLawyer.name)}
                          className="w-full bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between group hover:bg-blue-500 hover:border-blue-500 transition-all"
                        >
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-white/20">
                                 <Users size={16} className="text-slate-600 group-hover:text-white" />
                              </div>
                              <span className="text-xs font-bold text-slate-700 group-hover:text-white">Lista de Clientes</span>
                           </div>
                           <ExternalLink size={14} className="text-slate-300 group-hover:text-white" />
                        </button>
                        <button 
                          onClick={() => onNavigate('logs', selectedLawyer.name)}
                          className="w-full bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between group hover:bg-slate-900 hover:border-slate-900 transition-all"
                        >
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-white/20">
                                 <ListFilter size={16} className="text-slate-600 group-hover:text-white" />
                              </div>
                              <span className="text-xs font-bold text-slate-700 group-hover:text-white">Ligações Recentes</span>
                           </div>
                           <ExternalLink size={14} className="text-slate-300 group-hover:text-white" />
                        </button>
                     </section>
                  </div>

                  {/* Right Column: Cases and Clients */}
                  <div className="lg:col-span-2 space-y-8">
                     {/* Clientes Section */}
                     <section>
                        <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                           <Users size={18} className="text-amber-500" /> Clientes Gerenciados
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {getLawyerClients(selectedLawyer.name).map(client => (
                             <div 
                              key={client.id} 
                              onClick={() => onNavigate('customers', client.name)}
                              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-amber-200 hover:shadow-md transition-all cursor-pointer group/card"
                             >
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 group-hover/card:bg-amber-50 group-hover/card:text-amber-500">
                                   {client.name[0]}
                                </div>
                                <div className="flex-1">
                                   <p className="text-sm font-bold text-slate-900">{client.name}</p>
                                   <p className="text-[10px] text-slate-400 font-medium">{client.document}</p>
                                </div>
                                <ChevronRight size={14} className="text-slate-200 group-hover/card:text-amber-500 group-hover/card:translate-x-1 transition-all" />
                             </div>
                           ))}
                           {getLawyerClients(selectedLawyer.name).length === 0 && (
                             <p className="text-xs text-slate-400 italic">Nenhum cliente associado no momento.</p>
                           )}
                        </div>
                     </section>

                     {/* Casos Section */}
                     <section>
                        <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                           <Briefcase size={18} className="text-amber-500" /> Casos em Atividade
                        </h4>
                        <div className="space-y-4">
                           {getLawyerStats(selectedLawyer.name).lawyerProcesses.map(proc => (
                             <div 
                              key={proc.id} 
                              onClick={() => onNavigate('processes', proc.processNumber)}
                              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group/case hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                             >
                                <div className="flex items-center gap-4">
                                   <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover/case:bg-blue-600 group-hover/case:text-white transition-colors">
                                      <FileText size={20} />
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-slate-900">{proc.title}</p>
                                      <p className="text-[10px] font-mono text-slate-400">{proc.processNumber}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  <div className="text-right">
                                     <span className="text-[10px] font-black px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full">
                                        {proc.phase}
                                     </span>
                                     <p className="text-[10px] text-slate-400 mt-1 font-bold">Desde {new Date(proc.startDate).toLocaleDateString()}</p>
                                  </div>
                                  <ChevronRight size={18} className="text-slate-200 group-hover/case:text-blue-500 group-hover/case:translate-x-1 transition-all" />
                                </div>
                             </div>
                           ))}
                           {getLawyerStats(selectedLawyer.name).lawyerProcesses.length === 0 && (
                             <p className="text-xs text-slate-400 italic">Nenhum processo registrado sob esta titularidade.</p>
                           )}
                        </div>
                     </section>
                  </div>
               </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-white border-t border-slate-100 flex justify-center shrink-0">
               <button 
                onClick={() => setSelectedLawyer(null)}
                className="px-12 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-slate-200"
               >
                 Fechar Perfil Profissional
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Insights */}
      <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
         <div className="absolute right-0 top-0 p-10 opacity-10">
            <Award size={120} />
         </div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
               <h2 className="text-3xl font-black mb-4">Liderança JurisCall</h2>
               <p className="text-slate-400 leading-relaxed mb-8">
                  Nossa equipe de elite entrega resultados estratégicos e manutenção de alto padrão jurídico sob a gestão unificada de processos e métricas.
               </p>
               <div className="flex gap-4">
                  <div className="p-4 bg-white/10 rounded-3xl border border-white/10">
                     <p className="text-2xl font-black">100%</p>
                     <p className="text-[10px] font-bold text-amber-400 uppercase">Comprometimento</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-3xl border border-white/10">
                     <p className="text-2xl font-black">Elite</p>
                     <p className="text-[10px] font-bold text-emerald-400 uppercase">Status</p>
                  </div>
               </div>
            </div>
            <div className="space-y-6">
               <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Benchmarking de Eficiência</h4>
               {lawyers.map(l => {
                 const s = getLawyerStats(l.name);
                 return (
                   <div key={l.id} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg ${l.avatarColor} flex items-center justify-center font-bold text-xs`}>
                        {l.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                           <span className="text-sm font-bold">{l.name}</span>
                           <span className="text-xs text-slate-400">{s.conversionRate}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className={`h-full ${l.role === 'Sócio' ? 'bg-white' : l.avatarColor}`} style={{ width: `${s.conversionRate}%` }}></div>
                        </div>
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
