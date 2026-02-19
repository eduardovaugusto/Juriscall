
import React, { useState, useMemo, useEffect } from 'react';
import { LegalProcess, Customer } from '../types';
import { 
  Plus, X, ChevronRight, ArrowLeft, Briefcase, 
  Search, Sparkles, FileText, Download, Loader2,
  Scale, History, BrainCircuit,
  AlertTriangle, Lightbulb, Calculator, Calendar, Clock,
  DollarSign
} from 'lucide-react';
import { INITIAL_LAWYERS_DATA } from '../constants';
import { analyzeLegalProcess } from '../services/geminiService';
import { jsPDF } from 'jspdf';

interface ProcessManagerProps {
  processes: LegalProcess[];
  customers: Customer[];
  onAddProcess: (process: LegalProcess) => void;
  initialSearchTerm?: string;
}

const ProcessManager: React.FC<ProcessManagerProps> = ({ processes, customers, onAddProcess, initialSearchTerm = '' }) => {
  const [selectedProcess, setSelectedProcess] = useState<LegalProcess | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [statusFilter, setStatusFilter] = useState<'ativos' | 'arquivados' | 'todos'>('ativos');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const getCustomer = (id: string) => customers.find(c => c.id === id);
  const getCustomerName = (id: string) => getCustomer(id)?.name || 'Segurado';

  const filteredProcesses = useMemo(() => {
    return processes.filter(p => {
      const isArchived = p.phase === 'Arquivado';
      const matchesStatus = statusFilter === 'todos' || (statusFilter === 'ativos' && !isArchived) || (statusFilter === 'arquivados' && isArchived);
      const s = searchTerm.toLowerCase();
      return matchesStatus && (p.title.toLowerCase().includes(s) || p.processNumber.includes(s) || getCustomerName(p.customerId).toLowerCase().includes(s));
    });
  }, [processes, statusFilter, searchTerm, customers]);

  const groupedData = useMemo(() => {
    const groups: Record<string, LegalProcess[]> = {};
    filteredProcesses.forEach(p => {
      const lawyer = INITIAL_LAWYERS_DATA.find(l => l.name === p.lawyerName);
      const category = lawyer?.specialty || 'Estratégico';
      if (!groups[category]) groups[category] = [];
      groups[category].push(p);
    });
    return groups;
  }, [filteredProcesses]);

  const handleOpenProcess = (process: LegalProcess) => {
    setSelectedProcess(process);
    setAiAnalysis(null);
    setShowAiPanel(false);
  };

  const handleAiConsultation = async () => {
    if (!selectedProcess) return;
    setShowAiPanel(true);
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeLegalProcess(selectedProcess);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error("Erro na consulta IA", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isSearching = searchTerm.length > 0 && !selectedCategory;

  if (!selectedCategory && !isSearching) {
    return (
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-3">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Carteira Previdenciária</h2>
            <p className="text-lg text-slate-400 font-medium">Controle de RMI, CNIS e Benefícios.</p>
          </div>
          <div className="flex gap-4">
            <StatusToggle active={statusFilter === 'ativos'} label="Em Curso" onClick={() => setStatusFilter('ativos')} />
            <StatusToggle active={statusFilter === 'arquivados'} label="Concluídos" onClick={() => setStatusFilter('arquivados')} />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(Object.entries(groupedData) as [string, LegalProcess[]][]).map(([category, items]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="group relative h-64 bg-white border border-slate-100 rounded-[40px] p-8 text-left hover:border-amber-500 hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-amber-50 transition-all duration-700 flex items-center justify-center">
                 <Scale size={40} className="text-slate-200 group-hover:text-amber-200" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{category}</h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{items.length} segurados</p>
                <div className="mt-auto">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                   </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const displayProcesses = selectedCategory ? (groupedData[selectedCategory] || []) : filteredProcesses;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24 relative">
      <nav className="flex items-center gap-6">
        <button onClick={() => { setSelectedCategory(null); setSearchTerm(''); }} className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedCategory || 'Resultados'}</h2>
      </nav>

      <div className="relative w-full">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
        <input
          type="text"
          placeholder="Pesquisar segurado ou benefício..."
          className="w-full bg-white border border-slate-100 rounded-[25px] pl-16 pr-10 py-5 text-lg font-bold outline-none focus:border-amber-500 transition-all shadow-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {displayProcesses.map(p => (
          <button key={p.id} onClick={() => handleOpenProcess(p)} className="group flex items-center justify-between p-6 bg-white border border-slate-100 hover:border-amber-500 transition-all rounded-[30px] text-left shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Calculator size={24} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-slate-400 font-black">{p.processNumber}</p>
                <h4 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{p.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                   <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Clock size={12}/> {p.contributionTime}</span>
                   <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">R$ {p.estimatedBenefitValue?.toLocaleString('pt-BR')} /mês</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Segurado</p>
                  <p className="text-xs font-bold text-slate-700">{getCustomerName(p.customerId)}</p>
               </div>
               <ChevronRight size={20} className="text-slate-100 group-hover:text-emerald-500" />
            </div>
          </button>
        ))}
      </div>

      {selectedProcess && (
        <>
          <div onClick={() => { setSelectedProcess(null); setShowAiPanel(false); }} className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[40] md:ml-64"></div>

          {/* PAINEL DE CONSULTA IA */}
          <div className={`fixed top-0 bottom-0 left-64 w-full max-w-xl bg-slate-900 shadow-2xl z-[50] transition-transform duration-500 ease-in-out border-r border-slate-800 flex flex-col ${showAiPanel ? 'translate-x-0' : '-translate-x-full'}`}>
             <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-emerald-500 rounded-lg text-slate-900">
                      <BrainCircuit size={20} />
                   </div>
                   <div>
                      <h3 className="text-white font-black uppercase text-xs tracking-[0.2em]">Cálculo & Tese IA</h3>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Auditória JurisCall</p>
                   </div>
                </div>
                <button onClick={() => setShowAiPanel(false)} className="text-slate-500 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all">
                   <X size={20} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar-dark">
                {isAnalyzing ? (
                   <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto text-emerald-500 animate-pulse" size={24} />
                      </div>
                      <p className="text-slate-400 text-sm font-medium">Analisando carência e tempo especial...</p>
                   </div>
                ) : aiAnalysis ? (
                   <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
                      <section className="space-y-3">
                         <h5 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Parecer sobre RMI</h5>
                         <p className="text-slate-300 text-sm leading-relaxed bg-white/5 p-6 rounded-3xl border border-white/5">{aiAnalysis.situationSummary}</p>
                      </section>
                      <section className="space-y-4">
                         <h5 className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={12}/> Riscos de Indeferimento</h5>
                         <div className="grid grid-cols-1 gap-3">
                            {aiAnalysis.risks.map((risk: string, i: number) => (
                               <div key={i} className="flex gap-4 p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 text-xs text-rose-200">
                                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0"></div>
                                  {risk}
                               </div>
                            ))}
                         </div>
                      </section>
                   </div>
                ) : (
                   <div className="text-center py-20 text-slate-600 italic text-sm">Aguardando solicitação de auditoria da contagem...</div>
                )}
             </div>
          </div>

          {/* PAINEL DE DETALHES */}
          <div className="fixed top-0 bottom-0 right-0 w-full max-w-2xl bg-[#FFF9F9] shadow-2xl z-[50] animate-in slide-in-from-right duration-500 flex flex-col border-l-8 border-emerald-500/30">
             <div className="px-10 py-8 bg-[#FFF9F9] border-b border-slate-100 flex justify-between items-center shrink-0">
                <div className="space-y-1">
                   <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black bg-emerald-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">{selectedProcess.phase}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-black">{selectedProcess.processNumber}</span>
                   </div>
                   <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedProcess.title}</h2>
                </div>
                <button onClick={() => { setSelectedProcess(null); setShowAiPanel(false); }} className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                   <X size={28} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                {/* DESTAQUE DE VALORES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="p-6 bg-emerald-900 text-white rounded-[40px] shadow-xl relative overflow-hidden">
                      {/* Fixed: Icon component used here is now imported from lucide-react */}
                      <div className="absolute right-0 bottom-0 opacity-10 p-4"><DollarSign size={80}/></div>
                      <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">Projeção de RMI</p>
                      <p className="text-3xl font-black">R$ {selectedProcess.estimatedBenefitValue?.toLocaleString('pt-BR')}</p>
                      <p className="text-[10px] text-emerald-300 mt-2 font-bold italic">Valor Mensal Estimado</p>
                   </div>
                   <div className="p-6 bg-slate-100 rounded-[40px] border border-slate-200">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Tempo Contabilizado</p>
                      <p className="text-2xl font-black text-slate-800">{selectedProcess.contributionTime}</p>
                      <div className="mt-2 flex items-center gap-2">
                         <Calendar size={14} className="text-slate-400" />
                         <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Cálculo Atualizado</span>
                      </div>
                   </div>
                </div>

                <section className="space-y-3">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileText size={14} className="text-emerald-500" /> Análise do CNIS</h5>
                   <div className="bg-white p-8 rounded-[35px] border border-slate-100 italic text-lg text-slate-700 leading-relaxed shadow-sm">
                      "{selectedProcess.cnisSummary || "Nenhuma análise de CNIS registrada."}"
                   </div>
                </section>

                <section className="space-y-4">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Lightbulb size={16} className="text-emerald-500" /> Detalhes do Caso</h5>
                   <p className="text-sm text-slate-600 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm leading-relaxed">{selectedProcess.description}</p>
                </section>
             </div>

             <div className="px-10 py-8 bg-white border-t border-slate-100 flex gap-4 shrink-0">
                <button 
                  onClick={handleAiConsultation}
                  disabled={isAnalyzing}
                  className={`flex-1 py-5 rounded-[22px] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${showAiPanel ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100'}`}
                >
                   {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />} 
                   {showAiPanel ? 'Ver Detalhes' : 'Auditoria IA do Tempo'}
                </button>
                <button className="px-8 py-5 bg-slate-100 text-slate-600 rounded-[22px] text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
                   <Download size={18} /> Exportar Dossiê
                </button>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

const StatusToggle = ({ active, label, onClick }: any) => (
  <button onClick={onClick} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${active ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-300 border border-slate-100 hover:text-slate-500'}`}>{label}</button>
);

export default ProcessManager;
