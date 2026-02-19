
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 bg-[#FFF9F9]">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Carteira de Segurados</h2>
          <p className="text-sm text-slate-500 font-medium">Gestão de clientes ativos e leads previdenciários.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              type="text"
              placeholder="Nome, CPF ou E-mail..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-white focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all font-semibold"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <UserPlus size={16} /> Novo Segurado
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCustomers.map(customer => {
          const customerProcesses = getCustomerProcesses(customer.id);
          const activeProcesses = customerProcesses.filter(p => p.phase !== 'Arquivado').length;

          return (
            <div key={customer.id} className="group bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col h-full">
              {/* Status Badge */}
              <div className={`absolute top-0 right-0 px-6 py-1.5 rounded-bl-3xl text-[9px] font-black uppercase tracking-widest text-white ${customer.status === 'Lead' ? 'bg-indigo-500' : 'bg-emerald-600'}`}>
                {customer.status === 'Lead' ? 'Lead Previdenciário' : 'Segurado Ativo'}
              </div>

              <div className="flex items-start gap-5 mb-6">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl shadow-inner ${customer.status === 'Lead' ? 'bg-indigo-50 text-indigo-600' : 'bg-[#FFF9F9] text-amber-600 border border-slate-100'}`}>
                  {customer.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">{customer.name}</h3>
                  <p className="text-[10px] font-mono font-black text-slate-400 mt-1">{customer.document}</p>
                </div>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <div className="p-2 bg-slate-50 rounded-xl"><Phone size={14} className="text-slate-400" /></div>
                  {customer.phone}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <div className="p-2 bg-slate-50 rounded-xl"><Mail size={14} className="text-slate-400" /></div>
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <div className="p-2 bg-slate-50 rounded-xl"><MapPin size={14} className="text-slate-400" /></div>
                  <span className="truncate">{customer.address.split('-')[0]}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 mt-auto flex flex-col gap-3">
                {customer.status === 'Lead' ? (
                  <button 
                    onClick={() => handleOpenLeadDetails(customer)}
                    className="w-full py-4 rounded-2xl bg-indigo-50 text-indigo-700 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all border border-indigo-100"
                  >
                    <MessageSquare size={14} /> Analisar Dossiê <ChevronRight size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={() => onViewProcesses(customer.name)}
                    className="w-full py-4 rounded-2xl bg-[#FFF9F9] text-amber-700 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-white transition-all border border-slate-100 group/btn"
                  >
                    <Briefcase size={14} className="group-hover/btn:scale-110 transition-transform" /> 
                    {activeProcesses} Processos em Curso <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reutilizando Modal de Lead - Atualizado para visual previdenciário */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FFF9F9] w-full max-w-3xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh] border-8 border-indigo-500/10">
             <div className="bg-slate-900 p-10 flex justify-between items-center text-white shrink-0 relative">
               <div className="flex items-center gap-5 relative z-10">
                 <div className="p-4 bg-indigo-500 rounded-3xl text-slate-900">
                    <MessageSquare size={28} />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black">Triagem Previdenciária</h2>
                    <p className="text-sm text-slate-400 font-medium tracking-tight">Segurado: {selectedLead.name}</p>
                 </div>
               </div>
               <button onClick={() => setSelectedLead(null)} className="hover:bg-white/10 p-3 rounded-full transition-all relative z-10"><X /></button>
               <div className="absolute right-0 top-0 opacity-5 p-10">
                  <Scale size={150} />
               </div>
             </div>

             <div className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
                <section className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                         <FileText size={16} className="text-indigo-500" /> Relato do Segurado (CNIS/Vida)
                      </h4>
                      <button 
                        onClick={handleAnalyzeInterview}
                        disabled={analyzingLead}
                        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                      >
                        {analyzingLead ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        Auditoria de Direitos IA
                      </button>
                   </div>
                   <div className="bg-white p-8 rounded-[35px] border border-slate-100 text-slate-600 text-lg italic leading-relaxed shadow-sm">
                      "{selectedLead.interviewNotes || "Nenhuma nota registrada."}"
                   </div>
                </section>

                {leadAnalysis && (
                  <div className="animate-in slide-in-from-top-6 duration-700 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="bg-white p-6 rounded-[35px] border border-indigo-100 shadow-sm col-span-2">
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3">Resumo do Caso</p>
                          <p className="text-base text-slate-700 leading-relaxed font-bold">
                            {leadAnalysis.summary}
                          </p>
                       </div>
                       <div className="bg-slate-900 p-6 rounded-[35px] shadow-xl flex flex-col justify-center items-center text-center">
                          <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2">Viabilidade Técnica</p>
                          <div className="flex items-end gap-1">
                            <span className="text-5xl font-black text-white">{leadAnalysis.urgencyScore}</span>
                            <span className="text-xs text-slate-500 font-bold mb-2">/10</span>
                          </div>
                          <div className="mt-4 px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Probabilidade Êxito</span>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white p-8 rounded-[35px] border border-emerald-100 shadow-sm">
                       <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-5 flex items-center gap-2">
                          <BadgeCheck size={18} /> Benefícios & Teses Prováveis
                       </h5>
                       <div className="flex flex-wrap gap-3">
                          {leadAnalysis.rightsFound.map((right: string, i: number) => (
                             <span key={i} className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                {right}
                             </span>
                          ))}
                       </div>
                    </div>

                    <div className="bg-indigo-600 p-8 rounded-[35px] text-white shadow-xl relative overflow-hidden">
                       <div className="absolute right-0 top-0 p-6 opacity-20">
                          <Zap size={100} />
                       </div>
                       <h5 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Scale size={18} /> Estratégia de Fechamento de Contrato
                       </h5>
                       <p className="text-lg italic leading-relaxed text-white font-medium relative z-10">
                          "{leadAnalysis.conversionPitch}"
                       </p>
                    </div>
                  </div>
                )}
             </div>

             <div className="p-10 border-t border-slate-100 flex justify-between items-center bg-white shrink-0">
                <button className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">Gerar PDF de Triagem</button>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-200"
                >
                  Concluir e Salvar
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Cadastro Rápido Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FFF9F9] w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-100">
            <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
              <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-widest text-sm"><UserPlus size={20} className="text-amber-500" /> Cadastro Segurado</h2>
              <button onClick={() => setIsAdding(false)} className="hover:bg-white/10 p-2 rounded-full"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div className="flex gap-4 p-4 bg-white rounded-3xl border border-slate-100">
                   <button 
                    type="button" 
                    onClick={() => setNewCustomer({...newCustomer, status: 'Ativo'})}
                    className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${newCustomer.status === 'Ativo' ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-100 text-slate-400'}`}
                   >
                     Segurado Ativo
                   </button>
                   <button 
                    type="button" 
                    onClick={() => setNewCustomer({...newCustomer, status: 'Lead'})}
                    className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${newCustomer.status === 'Lead' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400'}`}
                   >
                     Novo Lead
                   </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nome Civil Completo</label>
                    <input required className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 outline-none font-bold text-slate-800 focus:border-amber-500 transition-colors" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">CPF</label>
                    <input required className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 outline-none font-mono text-slate-800 focus:border-amber-500 transition-colors" value={newCustomer.document} onChange={e => setNewCustomer({...newCustomer, document: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Celular / WhatsApp</label>
                      <input required className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 outline-none font-bold text-slate-800" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">E-mail</label>
                      <input required type="email" className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 outline-none font-bold text-slate-800" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                    </div>
                  </div>

                  {newCustomer.status === 'Lead' && (
                    <div className="animate-in slide-in-from-top-4">
                      <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 block">Notas de Entrevista / Histórico CNIS</label>
                      <textarea 
                        rows={5} 
                        className="w-full px-5 py-4 rounded-3xl border border-indigo-100 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 bg-white resize-none text-sm font-medium leading-relaxed" 
                        placeholder="Ex: Trabalhou 20 anos em ambiente ruidoso, possui carência mas o INSS negou..."
                        value={newCustomer.interviewNotes} 
                        onChange={e => setNewCustomer({...newCustomer, interviewNotes: e.target.value})} 
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Endereço Residencial</label>
                    <input className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 outline-none font-bold text-slate-800" value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 rounded-2xl border border-slate-100 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:scale-105 transition-all"><Save size={16} /> Salvar Ficha</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManager;
