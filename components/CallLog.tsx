
import React, { useState, useEffect } from 'react';
import { CallRecord } from '../types';
import { Search, Filter, Clock, Calendar, Hash, User, AlertCircle, RefreshCcw, Layers, X, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PROCESS_PHASES } from '../constants';

interface CallLogProps {
  calls: CallRecord[];
  onUpdateCall: (call: CallRecord) => void;
  initialSearchTerm?: string;
}

const CallLog: React.FC<CallLogProps> = ({ calls, onUpdateCall, initialSearchTerm = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const filteredCalls = calls.filter(call => {
    const matchesSearch = 
      call.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.information.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.lawyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (call.processNumber && call.processNumber.includes(searchTerm));
    
    const matchesPriority = filterPriority === 'all' || call.priority === filterPriority;
    
    return matchesSearch && matchesPriority;
  }).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Média': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const handleUpdatePhase = (phase: string) => {
    if (selectedCall) {
      const updated = { ...selectedCall, processPhase: phase };
      onUpdateCall(updated);
      setSelectedCall(updated);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, advogado ou processo..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={18} className="text-slate-400" />
          <select 
            className="px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none bg-white min-w-[150px]"
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
          >
            <option value="all">Todas Prioridades</option>
            <option value="Alta">Alta Prioridade</option>
            <option value="Média">Média Prioridade</option>
            <option value="Baixa">Baixa Prioridade</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCalls.length > 0 ? (
          filteredCalls.map(call => (
            <div 
              key={call.id} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all group border-l-4"
              style={{ borderLeftColor: call.priority === 'Alta' ? '#f43f5e' : call.priority === 'Média' ? '#f59e0b' : '#94a3b8' }}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center flex-wrap gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{call.callerName}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${getPriorityColor(call.priority)}`}>
                      {call.priority}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                      {call.category}
                    </span>
                    {call.callCount > 1 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1">
                        <RefreshCcw size={10} /> {call.callCount}ª Ligação
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed">{call.information}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-6 pt-2 border-t border-slate-50 mt-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar size={14} className="text-slate-400" />
                      {format(new Date(call.dateTime), "dd/MM HH:mm", { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User size={14} className="text-slate-400" />
                      {call.lawyerName}
                    </div>
                    {call.processNumber && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Hash size={14} className="text-slate-400" />
                        Proc: <span className="font-mono text-blue-600">{call.processNumber}</span>
                      </div>
                    )}
                    {call.processPhase && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Layers size={14} className="text-slate-400" />
                        Fase: <span className="font-semibold text-amber-600">{call.processPhase}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                   <button 
                    onClick={() => setSelectedCall(call)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center gap-2"
                   >
                     Ver Detalhes <ChevronRight size={14} />
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-500">Nenhum registro encontrado</h3>
            <p className="text-slate-400 text-sm">Tente ajustar seus filtros de busca.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-bold">{selectedCall.callerName}</h2>
                <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Detalhes do Atendimento</p>
              </div>
              <button 
                onClick={() => setSelectedCall(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
              {/* Information */}
              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Relato da Chamada</h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 italic text-slate-700 leading-relaxed">
                  "{selectedCall.information}"
                </div>
              </section>

              {/* Grid Data */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Advogado</h4>
                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                    <User size={16} className="text-amber-500" /> {selectedCall.lawyerName}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Data e Hora</h4>
                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                    <Clock size={16} className="text-amber-500" /> {format(new Date(selectedCall.dateTime), "dd/MM/yyyy 'às' HH:mm")}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Histórico</h4>
                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                    <RefreshCcw size={16} className="text-amber-500" /> {selectedCall.callCount}ª interação registrada
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prioridade</h4>
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${getPriorityColor(selectedCall.priority)}`}>
                    {selectedCall.priority}
                  </span>
                </div>
              </div>

              {/* Process Section */}
              {selectedCall.processNumber ? (
                <section className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                      <Hash size={18} /> Dados do Processo
                    </h4>
                    <span className="font-mono text-sm font-bold text-amber-700 bg-white px-3 py-1 rounded-lg border border-amber-200">
                      {selectedCall.processNumber}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-amber-800 flex items-center gap-2">
                      <Layers size={14} /> Atualizar Fase do Processo:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PROCESS_PHASES.map((phase) => (
                        <button
                          key={phase}
                          onClick={() => handleUpdatePhase(phase)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                            selectedCall.processPhase === phase 
                              ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200' 
                              : 'bg-white border-amber-200 text-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          {phase}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl">
                  <p className="text-sm text-slate-400">Esta chamada não está vinculada a um processo em curso.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedCall(null)}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Concluir Visualização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallLog;
