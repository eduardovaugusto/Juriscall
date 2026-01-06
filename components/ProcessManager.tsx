
import React, { useState, useMemo, useEffect } from 'react';
import { LegalProcess, Customer } from '../types';
import { 
  Plus, X, ChevronRight, ArrowLeft, Briefcase, 
  Search, Sparkles, FileText, Download, Loader2,
  Scale, History, BrainCircuit,
  AlertTriangle, Lightbulb
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
  const getCustomerName = (id: string) => getCustomer(id)?.name || 'Cliente Geral';

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

  const handleExportPDF = () => {
    if (!selectedProcess) return;
    const doc = new jsPDF();
    const margin = 20;
    let cursorY = 25;

    // Cabeçalho Profissional
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text('JurisCall - Dossiê Jurídico', margin, cursorY);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Documento gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, cursorY + 6);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, cursorY + 12, 190, cursorY + 12);
    cursorY += 25;

    // I. Identificação
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text('I. IDENTIFICAÇÃO DO PROCESSO', margin, cursorY);
    cursorY += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const info = [
      ['Número:', selectedProcess.processNumber],
      ['Título:', selectedProcess.title],
      ['Cliente:', getCustomerName(selectedProcess.customerId)],
      ['Advogado:', selectedProcess.lawyerName],
      ['Fase:', selectedProcess.phase]
    ];

    info.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, margin, cursorY);
      doc.setFont("helvetica", "normal");
      doc.text(String(value), margin + 30, cursorY);
      cursorY += 7;
    });
    cursorY += 10;

    // II. Relato
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('II. RELATO DOS FATOS', margin, cursorY);
    cursorY += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const splitDesc = doc.splitTextToSize(selectedProcess.description || 'Sem descrição.', 170);
    doc.text(splitDesc, margin, cursorY);
    cursorY += (splitDesc.length * 5) + 15;

    // III. Parecer IA
    if (aiAnalysis) {
      if (cursorY > 200) { doc.addPage(); cursorY = 20; }
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin - 5, cursorY - 5, 180, 80, 5, 5, 'F');
      doc.setFontSize(12);
      doc.setTextColor(245, 158, 11);
      doc.setFont("helvetica", "bold");
      doc.text('III. PARECER ESTRATÉGICO IA', margin, cursorY + 5);
      cursorY += 15;

      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.setFont("helvetica", "bold");
      doc.text('Análise:', margin, cursorY);
      cursorY += 6;
      doc.setFont("helvetica", "normal");
      const splitAi = doc.splitTextToSize(aiAnalysis.situationSummary, 165);
      doc.text(splitAi, margin, cursorY);
      cursorY += (splitAi.length * 5) + 8;

      doc.setFont("helvetica", "bold");
      doc.text('Recomendações:', margin, cursorY);
      cursorY += 6;
      doc.setFont("helvetica", "normal");
      aiAnalysis.suggestions.slice(0, 3).forEach((s: string) => {
        doc.text(`• ${s}`, margin + 5, cursorY);
        cursorY += 6;
      });
    }

    doc.save(`JurisCall_Dossie_${selectedProcess.processNumber}.pdf`);
  };

  const isSearching = searchTerm.length > 0 && !selectedCategory;

  if (!selectedCategory && !isSearching) {
    return (
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-3">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Acervo Judicial</h2>
            <p className="text-lg text-slate-400 font-medium">Gestão centralizada por área de atuação.</p>
          </div>
          <div className="flex gap-4">
            <StatusToggle active={statusFilter === 'ativos'} label="Ativos" onClick={() => setStatusFilter('ativos')} />
            <StatusToggle active={statusFilter === 'arquivados'} label="Arquivados" onClick={() => setStatusFilter('arquivados')} />
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
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{items.length} itens</p>
                <div className="mt-auto">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                   </div>
                </div>
              </div>
            </button>
          ))}
          <button className="h-64 bg-slate-900 rounded-[40px] p-8 flex flex-col justify-center items-center gap-3 hover:scale-[1.02] transition-transform">
             <Plus size={32} className="text-amber-500" />
             <span className="text-white text-sm font-bold">Novo Registro</span>
          </button>
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
          placeholder="Pesquisar..."
          className="w-full bg-white border border-slate-100 rounded-[25px] pl-16 pr-10 py-5 text-lg font-bold outline-none focus:border-amber-500 transition-all shadow-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {displayProcesses.map(p => (
          <button key={p.id} onClick={() => handleOpenProcess(p)} className="group flex items-center justify-between p-5 bg-white border border-slate-100 hover:border-amber-500 transition-all rounded-[25px] text-left shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-[8px] font-mono text-slate-300 font-black">{p.processNumber}</p>
                <h4 className="text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors">{p.title}</h4>
                <p className="text-[10px] font-bold text-slate-400">{getCustomerName(p.customerId)}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-100 group-hover:text-amber-500" />
          </button>
        ))}
      </div>

      {selectedProcess && (
        <>
          <div onClick={() => { setSelectedProcess(null); setShowAiPanel(false); }} className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[40] md:ml-64"></div>

          {/* PAINEL DE CONSULTA IA (ESQUERDA) */}
          <div className={`fixed top-0 bottom-0 left-64 w-full max-w-xl bg-slate-900 shadow-2xl z-[50] transition-transform duration-500 ease-in-out border-r border-slate-800 flex flex-col ${showAiPanel ? 'translate-x-0' : '-translate-x-full'}`}>
             <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-amber-500 rounded-lg text-slate-900">
                      <BrainCircuit size={20} />
                   </div>
                   <div>
                      <h3 className="text-white font-black uppercase text-xs tracking-[0.2em]">Parecer IA</h3>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Visão Estratégica JurisCall</p>
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
                        <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto text-amber-500 animate-pulse" size={24} />
                      </div>
                      <p className="text-slate-400 text-sm font-medium animate-pulse">Analisando jurisprudência...</p>
                   </div>
                ) : aiAnalysis ? (
                   <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
                      <section className="space-y-3">
                         <h5 className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Resumo Estratégico</h5>
                         <p className="text-slate-300 text-sm leading-relaxed bg-white/5 p-6 rounded-3xl border border-white/5">{aiAnalysis.situationSummary}</p>
                      </section>
                      <section className="space-y-4">
                         <h5 className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={12}/> Riscos</h5>
                         <div className="grid grid-cols-1 gap-3">
                            {aiAnalysis.risks.map((risk: string, i: number) => (
                               <div key={i} className="flex gap-4 p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 text-xs text-rose-200">
                                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0"></div>
                                  {risk}
                               </div>
                            ))}
                         </div>
                      </section>
                      <section className="space-y-4">
                         <h5 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><Lightbulb size={12}/> Próximos Passos</h5>
                         <div className="grid grid-cols-1 gap-3">
                            {aiAnalysis.suggestions.map((sug: string, i: number) => (
                               <div key={i} className="flex gap-4 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-xs text-emerald-200">
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>
                                  {sug}
                               </div>
                            ))}
                         </div>
                      </section>
                   </div>
                ) : (
                   <div className="text-center py-20 text-slate-600 italic text-sm">Aguardando solicitação de análise pelo advogado...</div>
                )}
             </div>
          </div>

          {/* PAINEL DE DETALHES (DIREITA) */}
          <div className="fixed top-0 bottom-0 right-0 w-full max-w-2xl bg-[#fdfdfd] shadow-2xl z-[50] animate-in slide-in-from-right duration-500 flex flex-col border-l-8 border-amber-500/30">
             <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
                <div className="space-y-1">
                   <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">{selectedProcess.phase}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-black">{selectedProcess.processNumber}</span>
                   </div>
                   <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedProcess.title}</h2>
                </div>
                <button onClick={() => { setSelectedProcess(null); setShowAiPanel(false); }} className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                   <X size={28} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 bg-amber-50 rounded-[30px] border border-amber-100 shadow-sm">
                      <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-1">Honorários Estimados</p>
                      <p className="text-sm font-black text-slate-800">R$ {selectedProcess.honoraryValue?.toLocaleString('pt-BR')}</p>
                   </div>
                   <div className="p-5 bg-slate-100 rounded-[30px] border border-slate-200 shadow-sm">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Iniciado em</p>
                      <p className="text-sm font-black text-slate-800">{new Date(selectedProcess.startDate).toLocaleDateString()}</p>
                   </div>
                </div>

                <section className="space-y-3">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileText size={14} className="text-amber-500" /> Relatório de Fatos</h5>
                   <div className="bg-white p-8 rounded-[35px] border border-slate-100 italic text-lg text-slate-600 leading-relaxed shadow-sm">"{selectedProcess.description}"</div>
                </section>

                <section className="space-y-6 pt-2">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><History size={16} className="text-amber-500" /> Cronologia de Decisões</h5>
                   <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-1 before:bg-slate-100">
                      <TimelinePoint title="Protocolo Inicial" date={new Date(selectedProcess.startDate).toLocaleDateString()} desc="Início do processo judicial." status="info" />
                      {selectedProcess.decisions?.map((dec, idx) => (
                         <TimelinePoint key={idx} title={`Decisão Judicial #${idx + 1}`} date="Registro Histórico" desc={dec} status="decision" />
                      ))}
                   </div>
                </section>
             </div>

             <div className="px-10 py-8 bg-white border-t border-slate-100 flex gap-4 shrink-0 shadow-inner">
                <button 
                  onClick={handleAiConsultation}
                  disabled={isAnalyzing}
                  className={`flex-1 py-5 rounded-[22px] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${showAiPanel ? 'bg-slate-900 text-white' : 'bg-amber-500 text-slate-900 hover:bg-amber-600 shadow-lg shadow-amber-100'}`}
                >
                   {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />} 
                   {showAiPanel ? 'IA Aberta' : 'Análise JurisCall IA'}
                </button>
                <button 
                  onClick={handleExportPDF}
                  className="px-8 py-5 bg-slate-100 text-slate-600 rounded-[22px] text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                >
                   <Download size={18} /> Gerar Dossiê PDF
                </button>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

const TimelinePoint: React.FC<{ title: string; date: string; desc: string; status: 'info' | 'decision'; }> = ({ title, date, desc, status }) => {
   const colors = { info: 'bg-slate-300', decision: 'bg-blue-500' };
   return (
      <div className="relative group">
         <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-[#fdfdfd] shadow-sm ${colors[status]}`}></div>
         <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{date}</span>
         </div>
         <h6 className="text-base font-black text-slate-800 leading-tight group-hover:text-amber-600 transition-colors">{title}</h6>
         <p className="text-sm text-slate-500 mt-2 italic leading-relaxed bg-white p-4 rounded-2xl border border-slate-50 shadow-sm">"{desc}"</p>
      </div>
   );
};

const StatusToggle = ({ active, label, onClick }: any) => (
  <button onClick={onClick} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${active ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-300 border border-slate-100 hover:text-slate-500'}`}>{label}</button>
);

export default ProcessManager;
