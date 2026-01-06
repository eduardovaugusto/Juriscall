
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CallForm from './components/CallForm';
import CallLog from './components/CallLog';
import CustomerManager from './components/CustomerManager';
import ProcessManager from './components/ProcessManager';
import FinancialManager from './components/FinancialManager';
import LawyerManager from './components/LawyerManager';
import { CallRecord, Customer, LegalProcess, View, FinancialTransaction } from './types';
import { INITIAL_LAWYERS_DATA } from './constants';
import { supabase } from './services/supabaseClient';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [processSearchFilter, setProcessSearchFilter] = useState('');
  const [customerSearchFilter, setCustomerSearchFilter] = useState('');
  const [logsSearchFilter, setLogsSearchFilter] = useState('');
  
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [processes, setProcesses] = useState<LegalProcess[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lawyers = INITIAL_LAWYERS_DATA;

  // Funções de Mapeamento para compatibilidade com SQL snake_case
  const mapCallFromDB = (c: any): CallRecord => ({
    id: c.id,
    callerName: c.caller_name,
    information: c.information,
    dateTime: c.date_time,
    lawyerName: c.lawyer_name,
    processNumber: c.process_number,
    processPhase: c.process_phase,
    isFirstTime: c.is_first_time,
    callCount: c.call_count,
    priority: c.priority,
    category: c.category
  });

  const mapCustomerFromDB = (c: any): Customer => ({
    id: c.id,
    name: c.name,
    document: c.document,
    phone: c.phone,
    email: c.email,
    address: c.address,
    status: c.status,
    interviewNotes: c.interview_notes,
    aiInterviewSummary: c.ai_interview_summary,
    createdAt: c.created_at
  });

  const mapProcessFromDB = (p: any): LegalProcess => ({
    id: p.id,
    processNumber: p.process_number,
    title: p.title,
    customerId: p.customer_id,
    lawyerName: p.lawyer_name,
    phase: p.phase,
    description: p.description,
    decisions: p.decisions,
    sentence: p.sentence,
    honoraryValue: p.honorary_value,
    startDate: p.start_date,
    createdAt: p.created_at
  });

  const mapTransactionFromDB = (t: any): FinancialTransaction => ({
    id: t.id,
    customerId: t.customer_id,
    description: t.description,
    amount: t.amount,
    type: t.type,
    category: t.category,
    status: t.status,
    dueDate: t.due_date,
    paymentDate: t.payment_date
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        { data: callsData, error: ce },
        { data: customersData, error: cue },
        { data: processesData, error: pe },
        { data: financeData, error: fe }
      ] = await Promise.all([
        supabase.from('call_records').select('*').order('date_time', { ascending: false }),
        supabase.from('customers').select('*').order('name'),
        supabase.from('legal_processes').select('*'),
        supabase.from('financial_transactions').select('*').order('due_date', { ascending: false })
      ]);

      if (ce || cue || pe || fe) throw new Error("Erro de resposta do Supabase.");

      setCalls((callsData || []).map(mapCallFromDB));
      setCustomers((customersData || []).map(mapCustomerFromDB));
      setProcesses((processesData || []).map(mapProcessFromDB));
      setTransactions((financeData || []).map(mapTransactionFromDB));
    } catch (err: any) {
      console.error("Supabase error:", err);
      setError("Não foi possível conectar ao banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveCall = async (newCall: CallRecord) => {
    const dbCall = {
      caller_name: newCall.callerName,
      information: newCall.information,
      date_time: newCall.dateTime,
      lawyer_name: newCall.lawyerName,
      process_number: newCall.processNumber,
      process_phase: newCall.processPhase,
      is_first_time: newCall.isFirstTime,
      call_count: newCall.callCount,
      priority: newCall.priority,
      category: newCall.category
    };
    const { data, error } = await supabase.from('call_records').insert([dbCall]).select();
    if (!error) {
      setCalls(prev => [mapCallFromDB(data[0]), ...prev]);
      setActiveView('logs');
    }
  };

  const handleUpdateCall = async (updatedCall: CallRecord) => {
    const dbUpdate = {
      process_phase: updatedCall.processPhase
    };
    const { error } = await supabase.from('call_records').update(dbUpdate).eq('id', updatedCall.id);
    if (!error) setCalls(prev => prev.map(c => c.id === updatedCall.id ? updatedCall : c));
  };

  const handleAddCustomer = async (newCustomer: Customer) => {
    const dbCustomer = {
      name: newCustomer.name,
      document: newCustomer.document,
      phone: newCustomer.phone,
      email: newCustomer.email,
      address: newCustomer.address,
      status: newCustomer.status,
      interview_notes: newCustomer.interviewNotes
    };
    const { data, error } = await supabase.from('customers').insert([dbCustomer]).select();
    if (!error) setCustomers(prev => [mapCustomerFromDB(data[0]), ...prev]);
  };

  const handleAddProcess = async (newProcess: LegalProcess) => {
    const dbProcess = {
      process_number: newProcess.processNumber,
      title: newProcess.title,
      customer_id: newProcess.customerId,
      lawyer_name: newProcess.lawyerName,
      phase: newProcess.phase,
      description: newProcess.description,
      honorary_value: newProcess.honoraryValue,
      start_date: newProcess.startDate
    };
    const { data, error } = await supabase.from('legal_processes').insert([dbProcess]).select();
    if (!error) setProcesses(prev => [mapProcessFromDB(data[0]), ...prev]);
  };

  const handleAddTransaction = async (newTx: FinancialTransaction) => {
    const dbTx = {
      customer_id: newTx.customerId || null,
      description: newTx.description,
      amount: newTx.amount,
      type: newTx.type,
      category: newTx.category,
      status: newTx.status,
      due_date: newTx.dueDate
    };
    const { data, error } = await supabase.from('financial_transactions').insert([dbTx]).select();
    if (!error) setTransactions(prev => [mapTransactionFromDB(data[0]), ...prev]);
  };

  const handleUpdateTxStatus = async (id: string, status: FinancialTransaction['status']) => {
    const update = { status, payment_date: status === 'Pago' ? new Date().toISOString() : null };
    const { error } = await supabase.from('financial_transactions').update(update).eq('id', id);
    if (!error) setTransactions(prev => prev.map(t => t.id === id ? { ...t, status, paymentDate: update.payment_date || undefined } : t));
  };

  const handleSetView = (view: View, filter?: string) => {
    setProcessSearchFilter(view === 'processes' ? filter || '' : '');
    setCustomerSearchFilter(view === 'customers' ? filter || '' : '');
    setLogsSearchFilter(view === 'logs' ? filter || '' : '');
    setActiveView(view);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-black uppercase tracking-widest text-[10px]">Conectando ao JurisCall DB...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
           <AlertTriangle size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Erro de Conexão</h2>
        <p className="text-slate-500 max-w-md mb-8 leading-relaxed">{error}</p>
        <button onClick={fetchData} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl">
          <RefreshCw size={18} /> Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <Layout activeView={activeView} setView={(v) => handleSetView(v)} isDbConnected={!error}>
      {activeView === 'dashboard' && <Dashboard calls={calls} transactions={transactions} />}
      {activeView === 'customers' && (
        <CustomerManager 
          customers={customers} 
          processes={processes}
          onAddCustomer={handleAddCustomer} 
          onViewProcesses={(name) => handleSetView('processes', name)}
          initialSearchTerm={customerSearchFilter}
        />
      )}
      {activeView === 'processes' && (
        <ProcessManager 
          processes={processes} 
          customers={customers} 
          onAddProcess={handleAddProcess} 
          initialSearchTerm={processSearchFilter}
        />
      )}
      {activeView === 'lawyers' && (
        <LawyerManager 
          lawyers={lawyers} 
          processes={processes} 
          calls={calls} 
          customers={customers}
          onNavigate={handleSetView}
        />
      )}
      {activeView === 'finance' && (
        <FinancialManager 
          transactions={transactions}
          customers={customers}
          onAddTransaction={handleAddTransaction}
          onUpdateStatus={handleUpdateTxStatus}
        />
      )}
      {activeView === 'new-call' && <CallForm onSave={handleSaveCall} existingCalls={calls} />}
      {activeView === 'logs' && <CallLog calls={calls} onUpdateCall={handleUpdateCall} initialSearchTerm={logsSearchFilter} />}
    </Layout>
  );
};

export default App;
