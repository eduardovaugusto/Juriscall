
import React, { useState } from 'react';
import { CallRecord } from '../types';
import { LAWYERS, PROCESS_PHASES } from '../constants';
import { analyzeCallContext } from '../services/geminiService';
import { Send, Loader2, Sparkles, User, Info, Scale, Layers } from 'lucide-react';

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
      <div className="bg-[#FFF9F9] rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-10 text-white relative">
          <h2 className="text-3xl font-black">Registrar Nova Ligação</h2>
          <p className="text-slate-400 mt-2 font-medium">Capture os detalhes estratégicos do atendimento.</p>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
             <Scale size={100} />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                <User size={14} /> Nome de quem ligou
              </label>
              <input
                required
                type="text"
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-semibold text-slate-900"
                placeholder="Ex: Maria José Rodrigues"
                value={formData.callerName}
                onChange={e => setFormData({...formData, callerName: e.target.value})}
              />
              {formData.callerName && (
                <div className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter">
                  {isFirstTime ? (
                    <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Novo Contato</span>
                  ) : (
                    <span className="text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Já ligou {callerHistory.length} vezes</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                <Info size={14} /> Informação buscada
              </label>
              <textarea
                required
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all h-40 resize-none font-medium text-slate-800"
                placeholder="Descreva brevemente o motivo da ligação..."
                value={formData.information}
                onChange={e => setFormData({...formData, information: e.target.value})}
              />
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-black tracking-widest">
                <Sparkles size={12} className="text-amber-500" /> IA analisa prioridade automaticamente
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  <User size={14} /> Advogado Destinatário
                </label>
                <select
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all appearance-none font-bold text-slate-800"
                  value={formData.lawyerName}
                  onChange={e => setFormData({...formData, lawyerName: e.target.value})}
                >
                  {LAWYERS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              
              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-lg text-amber-500 focus:ring-amber-500 border-slate-200 bg-slate-50"
                    checked={formData.isProcess}
                    onChange={e => setFormData({...formData, isProcess: e.target.checked})}
                  />
                  Processo em trânsito?
                </label>
              </div>
            </div>

            {formData.isProcess && (
              <div className="space-y-6 p-8 bg-slate-50 rounded-[32px] border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Número do Processo</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-amber-500/10 outline-none bg-white font-mono text-blue-600 font-bold"
                    placeholder="0000000-00.0000.0.00.0000"
                    value={formData.processNumber}
                    onChange={e => setFormData({...formData, processNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                    <Layers size={14} /> Fase Atual
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PROCESS_PHASES.map((phase) => (
                      <button
                        key={phase}
                        type="button"
                        onClick={() => setFormData({...formData, processPhase: phase})}
                        className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${
                          formData.processPhase === phase 
                            ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200' 
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
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-slate-200"
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
