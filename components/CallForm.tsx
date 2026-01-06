
import React, { useState, useEffect } from 'react';
import { CallRecord } from '../types';
import { LAWYERS, CATEGORIES, PROCESS_PHASES } from '../constants';
import { analyzeCallContext } from '../services/geminiService';
import { Send, Loader2, Sparkles, User, Info, Scale, History, Layers } from 'lucide-react';

interface CallFormProps {
  onSave: (call: CallRecord) => void;
  existingCalls: CallRecord[];
}

const CallForm: React.FC<CallFormProps> = ({ onSave, existingCalls }) => {
  const [formData, setFormData] = useState({
    callerName: '',
    information: '',
    lawyerName: LAWYERS[0],
    processNumber: '',
    processPhase: PROCESS_PHASES[0],
    isProcess: false
  });
  const [analyzing, setAnalyzing] = useState(false);

  const callerHistory = existingCalls.filter(c => c.callerName.toLowerCase().trim() === formData.callerName.toLowerCase().trim());
  const isFirstTime = callerHistory.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    
    // AI analysis
    const aiAnalysis = await analyzeCallContext(formData.information);
    
    const newCall: CallRecord = {
      id: Math.random().toString(36).substr(2, 9),
      callerName: formData.callerName,
      information: formData.information,
      dateTime: new Date().toISOString(),
      lawyerName: formData.lawyerName,
      processNumber: formData.isProcess ? formData.processNumber : '',
      processPhase: formData.isProcess ? formData.processPhase : undefined,
      isFirstTime,
      callCount: callerHistory.length + 1,
      priority: aiAnalysis.priority as any,
      category: aiAnalysis.category
    };

    onSave(newCall);
    setAnalyzing(false);
    setFormData({
      callerName: '',
      information: '',
      lawyerName: LAWYERS[0],
      processNumber: '',
      processPhase: PROCESS_PHASES[0],
      isProcess: false
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white relative">
          <h2 className="text-2xl font-bold">Registrar Nova Ligação</h2>
          <p className="text-slate-400 mt-1">Insira os detalhes da chamada recebida.</p>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
             <Scale size={80} />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <User size={16} /> Nome de quem ligou
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder="Ex: Maria José Rodrigues"
                value={formData.callerName}
                onChange={e => setFormData({...formData, callerName: e.target.value})}
              />
              {formData.callerName && (
                <div className="mt-2 flex items-center gap-2 text-xs font-medium">
                  {isFirstTime ? (
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Primeira ligação deste contato</span>
                  ) : (
                    <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded">Já ligou {callerHistory.length} vezes antes</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Info size={16} /> Informação buscada
              </label>
              <textarea
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all h-32 resize-none"
                placeholder="Descreva brevemente o motivo da ligação..."
                value={formData.information}
                onChange={e => setFormData({...formData, information: e.target.value})}
              />
              <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                <Sparkles size={12} className="text-amber-500" /> A IA analisará a prioridade e categoria automaticamente
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <User size={16} /> Advogado Destinatário
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                  value={formData.lawyerName}
                  onChange={e => setFormData({...formData, lawyerName: e.target.value})}
                >
                  {LAWYERS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              
              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-300"
                    checked={formData.isProcess}
                    onChange={e => setFormData({...formData, isProcess: e.target.checked})}
                  />
                  Processo em trânsito?
                </label>
              </div>
            </div>

            {formData.isProcess && (
              <div className="space-y-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Número do Processo</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                    placeholder="0000000-00.0000.0.00.0000"
                    value={formData.processNumber}
                    onChange={e => setFormData({...formData, processNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <Layers size={16} /> Fase Atual do Processo
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PROCESS_PHASES.map((phase) => (
                      <button
                        key={phase}
                        type="button"
                        onClick={() => setFormData({...formData, processPhase: phase})}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                          formData.processPhase === phase 
                            ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
                        }`}
                      >
                        {phase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            disabled={analyzing}
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
          >
            {analyzing ? (
              <>
                <Loader2 className="animate-spin" /> Analisando Contexto...
              </>
            ) : (
              <>
                <Send size={20} /> Finalizar Registro
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CallForm;
