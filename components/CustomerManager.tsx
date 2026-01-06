
import React, { useState, useEffect } from 'react';
import { Customer, LegalProcess } from '../types';
import { 
  UserPlus, Search, Mail, Phone, MapPin, CreditCard, X, Save, 
  AlertCircle, Briefcase, ChevronRight, MessageSquare, Sparkles, 
  Loader2, BadgeCheck, Zap, Scale, FileText, Clock, CheckCircle2, Activity
} from 'lucide-react';
import { summarizeInterview } from '../services/geminiService';

interface CustomerManagerProps {
  customers: Customer[];
  processes: LegalProcess[];
  onAddCustomer: (customer: Customer) => void;
  onViewProcesses: (customerName: string) => void;
  initialSearchTerm?: string;
}

const CustomerManager: React.FC<CustomerManagerProps> = ({ customers, processes, onAddCustomer, onViewProcesses, initialSearchTerm = '' }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedLead, setSelectedLead] = useState<Customer | null>(null);
  const [analyzingLead, setAnalyzingLead] = useState(false);
  const [leadAnalysis, setLeadAnalysis] = useState<any>(null);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    document: '',
    phone: '',
    email: '',
    address: '',
    status: 'Ativo' as 'Ativo' | 'Lead',
    interviewNotes: ''
  });

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const getCustomerProcesses = (customerId: string) => {
    return processes.filter(p => p.customerId === customerId);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.document.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenLeadDetails = (customer: Customer) => {
    setSelectedLead(customer);
    setLeadAnalysis(null);
  };

  const handleAnalyzeInterview = async () => {
    if (!selectedLead?.interviewNotes) return;
    setAnalyzingLead(true);
    try {
      const summary = await summarizeInterview(selectedLead.interviewNotes);
      setLeadAnalysis(summary);
    } catch (err) {
      alert("Erro ao analisar entrevista.");
    } finally {
      setAnalyzingLead(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      ...newCustomer,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    onAddCustomer(customer);
    setIsAdding(false);
    setNewCustomer({ name: '', document: '', phone: '', email: '', address: '', status: 'Ativo', interviewNotes: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou e-mail..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <UserPlus size={18} /> Novo Cliente / Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => {
            const customerProcesses = getCustomerProcesses(customer.id);
            const activeProcesses = customerProcesses.filter(p => p.phase !== 'Arquivado').length;
            const finishedProcesses = customerProcesses.filter(p => p.phase === 'Arquivado').length;

            return (
              <div key={customer.id} className={`bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden ${customer.status === 'Lead' ? 'border-indigo-100' : 'border-slate-200'}`}>
                {/* Status Ribbon */}
                <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-tighter text-white ${customer.status === 'Lead' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                  {customer.status === 'Lead' ? 'Candidato' : 'Ativo'}
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${customer.status === 'Lead' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                    {customer.name.charAt(0)}
                  </div>
                  
                  {/* Process Indicators */}
                  <div className="flex flex-col items-end gap-1">
                    {customerProcesses.length > 0 && (
                      <>
                        {activeProcesses > 0 && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 animate-pulse">
                            <Activity size={10} />
                            <span className="text-[10px] font-black">{activeProcesses} EM CURSO</span>
                          </div>
                        )}
                        {finishedProcesses > 0 && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-500 rounded-lg border border-slate-200">
                            <CheckCircle2 size={10} />
                            <span className="text-[10px] font-black">{finishedProcesses} FINALIZADOS</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{customer.name}</h3>
                
                <div className="space-y-2 mt-4 flex-1">
                  <p className="flex items-center gap-2 text-sm text-slate-600 truncate">
                    <CreditCard size={14} className="text-slate-400 shrink-0" /> {customer.document}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-600 truncate">
                    <Phone size={14} className="text-slate-400 shrink-0" /> {customer.phone}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-600 truncate">
                    <Mail size={14} className="text-slate-400 shrink-0" /> {customer.email}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-50 flex gap-2">
                  {customer.status === 'Lead' ? (
                    <button 
                      onClick={() => handleOpenLeadDetails(customer)}
                      className="w-full py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all border border-indigo-100"
                    >
                      <MessageSquare size={14} /> Detalhes Entrevista <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => onViewProcesses(customer.name)}
                      className="w-full py-2.5 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-100 transition-all border border-amber-100"
                    >
                      <Briefcase size={14} /> Ver {customerProcesses.length} Processos <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-500">Nenhum registro encontrado</h3>
          </div>
        )}
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
             <div className="bg-indigo-600 p-8 flex justify-between items-center text-white shrink-0">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/20 rounded-2xl">
                    <MessageSquare size={24} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black">Dossiê de Entrevista</h2>
                    <p className="text-sm text-indigo-100">Potencial Cliente: {selectedLead.name}</p>
                 </div>
               </div>
               <button onClick={() => setSelectedLead(null)} className="hover:bg-white/10 p-2 rounded-full"><X /></button>
             </div>

             <div className="p-8 overflow-y-auto space-y-8 bg-slate-50/50">
                <section>
                   <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <FileText size={16} /> Notas Brutas da Entrevista
                      </h4>
                      <button 
                        onClick={handleAnalyzeInterview}
                        disabled={analyzingLead}
                        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                      >
                        {analyzingLead ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        Gerar Parecer Jurídico IA
                      </button>
                   </div>
                   <div className="bg-white p-6 rounded-3xl border border-slate-200 text-slate-600 text-sm italic leading-relaxed shadow-sm">
                      "{selectedLead.interviewNotes || "Nenhuma nota registrada para esta entrevista."}"
                   </div>
                </section>

                {leadAnalysis && (
                  <div className="animate-in slide-in-from-top-4 duration-500 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm col-span-2">
                          <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Resumo Executivo do Caso</p>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            {leadAnalysis.summary}
                          </p>
                       </div>
                       <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm">
                          <p className="text-[10px] font-bold text-rose-400 uppercase mb-2">Urgência do Fechamento</p>
                          <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-rose-600">{leadAnalysis.urgencyScore}</span>
                            <span className="text-xs text-rose-300 font-bold mb-1">/ 10</span>
                          </div>
                          <div className="mt-4 flex items-center gap-1">
                             <Zap size={14} className="text-amber-500" />
                             <span className="text-[10px] font-bold text-slate-400">Prio: {leadAnalysis.urgencyScore > 7 ? 'Crítica' : 'Moderada'}</span>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                       <h5 className="text-xs font-bold text-emerald-600 uppercase mb-4 flex items-center gap-2">
                          <BadgeCheck size={18} /> Direitos e Teses Identificadas
                       </h5>
                       <div className="flex flex-wrap gap-2">
                          {leadAnalysis.rightsFound.map((right: string, i: number) => (
                             <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                                {right}
                             </span>
                          ))}
                       </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                       <div className="absolute right-0 top-0 p-4 opacity-10">
                          <Scale size={80} />
                       </div>
                       <h5 className="text-xs font-bold text-amber-400 uppercase mb-3 flex items-center gap-2">
                          <Zap size={18} /> Argumento de Conversão (Pitch)
                       </h5>
                       <p className="text-sm italic leading-relaxed text-slate-300 relative z-10">
                          "{leadAnalysis.conversionPitch}"
                       </p>
                    </div>
                  </div>
                )}
             </div>

             <div className="p-8 border-t border-slate-100 flex justify-between items-center bg-white shrink-0">
                <button className="text-sm font-bold text-indigo-600 hover:underline">Imprimir Notas</button>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="px-10 py-3 bg-slate-900 text-white rounded-2xl font-bold"
                >
                  Concluir Análise
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Adding Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold flex items-center gap-2"><UserPlus /> Novo Cadastro</h2>
              <button onClick={() => setIsAdding(false)} className="hover:bg-white/10 p-2 rounded-full"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl mb-2">
                   <button 
                    type="button" 
                    onClick={() => setNewCustomer({...newCustomer, status: 'Ativo'})}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${newCustomer.status === 'Ativo' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200'}`}
                   >
                     Cliente Ativo
                   </button>
                   <button 
                    type="button" 
                    onClick={() => setNewCustomer({...newCustomer, status: 'Lead'})}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${newCustomer.status === 'Lead' ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white border-slate-200'}`}
                   >
                     Candidato (Lead)
                   </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Nome Completo</label>
                  <input required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">CPF / CNPJ</label>
                  <input required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" value={newCustomer.document} onChange={e => setNewCustomer({...newCustomer, document: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Telefone</label>
                    <input required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">E-mail</label>
                    <input required type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                  </div>
                </div>

                {newCustomer.status === 'Lead' && (
                  <div className="animate-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-indigo-500 uppercase mb-1 block">Notas da Entrevista / Relato Inicial</label>
                    <textarea 
                      rows={4} 
                      className="w-full px-4 py-2.5 rounded-xl border border-indigo-100 outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50/10 resize-none" 
                      placeholder="Descreva os pontos principais da conversa..."
                      value={newCustomer.interviewNotes} 
                      onChange={e => setNewCustomer({...newCustomer, interviewNotes: e.target.value})} 
                    />
                  </div>
                )}
                
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Endereço</label>
                  <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none" value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2"><Save size={18} /> Salvar Cadastro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManager;
