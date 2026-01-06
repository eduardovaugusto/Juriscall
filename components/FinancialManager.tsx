
import React, { useState } from 'react';
import { FinancialTransaction, Customer } from '../types';
import { 
  DollarSign, Search, Plus, X, Save, TrendingUp, TrendingDown, 
  Clock, CheckCircle, AlertCircle, Filter, Download, User, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface FinancialManagerProps {
  transactions: FinancialTransaction[];
  customers: Customer[];
  onAddTransaction: (t: FinancialTransaction) => void;
  onUpdateStatus: (id: string, status: FinancialTransaction['status']) => void;
}

const FinancialManager: React.FC<FinancialManagerProps> = ({ 
  transactions, 
  customers, 
  onAddTransaction,
  onUpdateStatus
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Entrada' | 'Saída'>('Todos');

  const [newTx, setNewTx] = useState({
    description: '',
    amount: '',
    type: 'Entrada' as 'Entrada' | 'Saída',
    category: 'Honorários Iniciais' as any,
    status: 'Pendente' as any,
    dueDate: new Date().toISOString().split('T')[0],
    customerId: ''
  });

  const stats = {
    income: transactions.filter(t => t.type === 'Entrada' && t.status === 'Pago').reduce((acc, t) => acc + t.amount, 0),
    expense: transactions.filter(t => t.type === 'Saída' && t.status === 'Pago').reduce((acc, t) => acc + t.amount, 0),
    pending: transactions.filter(t => t.type === 'Entrada' && t.status !== 'Pago').reduce((acc, t) => acc + t.amount, 0),
  };

  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'Todos' || t.type === typeFilter;
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tx: FinancialTransaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
      amount: parseFloat(newTx.amount),
      dueDate: new Date(newTx.dueDate).toISOString()
    };
    onAddTransaction(tx);
    setIsAdding(false);
    setNewTx({
      description: '',
      amount: '',
      type: 'Entrada',
      category: 'Honorários Iniciais',
      status: 'Pendente',
      dueDate: new Date().toISOString().split('T')[0],
      customerId: ''
    });
  };

  const getCustomerName = (id?: string) => customers.find(c => c.id === id)?.name || 'Geral / Administrativo';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-500 uppercase">Receita Realizada</h4>
          </div>
          <p className="text-3xl font-black text-slate-900">R$ {stats.income.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <TrendingDown size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-500 uppercase">Despesas Pagas</h4>
          </div>
          <p className="text-3xl font-black text-slate-900">R$ {stats.expense.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-500 uppercase">A Receber</h4>
          </div>
          <p className="text-3xl font-black text-slate-900">R$ {stats.pending.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-1 gap-4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar lançamento..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm font-medium"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
          >
            <option>Todos</option>
            <option>Entrada</option>
            <option>Saída</option>
          </select>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          <Plus size={18} /> Novo Lançamento
        </button>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Descrição</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Vencimento</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{tx.description}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><User size={10}/> {getCustomerName(tx.customerId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(tx.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600 uppercase">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    <span className={tx.type === 'Entrada' ? 'text-emerald-600' : 'text-rose-600'}>
                      {tx.type === 'Entrada' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                      tx.status === 'Pago' ? 'bg-emerald-100 text-emerald-700' : 
                      tx.status === 'Atrasado' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {tx.status !== 'Pago' && (
                      <button 
                        onClick={() => onUpdateStatus(tx.id, 'Pago')}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Marcar como Pago"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold flex items-center gap-2"><DollarSign /> Novo Lançamento</h2>
              <button onClick={() => setIsAdding(false)} className="hover:bg-white/10 p-2 rounded-full"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Descrição</label>
                  <input required placeholder="Ex: Honorários Provisórios" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500" value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Tipo</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setNewTx({...newTx, type: 'Entrada'})} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${newTx.type === 'Entrada' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200'}`}>Entrada</button>
                    <button type="button" onClick={() => setNewTx({...newTx, type: 'Saída'})} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${newTx.type === 'Saída' ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-200'}`}>Saída</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Valor (R$)</label>
                  <input required type="number" step="0.01" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Categoria</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500 bg-white" value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value as any})}>
                    <option>Honorários Iniciais</option>
                    <option>Honorários de Êxito</option>
                    <option>Consultoria</option>
                    <option>Marketing</option>
                    <option>Custas</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Vencimento</label>
                  <input required type="date" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500 bg-white" value={newTx.dueDate} onChange={e => setNewTx({...newTx, dueDate: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Cliente Vinculado (Opcional)</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500 bg-white" value={newTx.customerId} onChange={e => setNewTx({...newTx, customerId: e.target.value})}>
                    <option value="">Geral / Sem vínculo</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"><Save size={18} /> Salvar Lançamento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialManager;
