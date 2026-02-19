
export interface Customer {
  id: string;
  name: string;
  document: string; // CPF or CNPJ
  phone: string;
  email: string;
  address: string;
  status: 'Lead' | 'Ativo';
  interviewNotes?: string;
  aiInterviewSummary?: string;
  createdAt: string;
}

export interface LegalProcess {
  id: string;
  processNumber: string;
  title: string;
  customerId: string;
  lawyerName: string;
  phase: string;
  description: string;
  initialPetition?: string;
  decisions?: string[];
  sentence?: string;
  honoraryValue?: number;
  totalEstimatedValue?: number; // Total value of the cause
  estimatedBenefitValue?: number; // VALOR DA APOSENTADORIA (MENSAL)
  cnisSummary?: string; // Resumo da contagem do CNIS
  contributionTime?: string; // Ex: 35 anos, 2 meses e 10 dias
  paymentPrediction?: string;
  startDate: string; 
  createdAt: string;
}

export interface FinancialTransaction {
  id: string;
  customerId?: string;
  description: string;
  amount: number;
  type: 'Entrada' | 'Saída';
  category: 'Honorários Iniciais' | 'Honorários de Êxito' | 'Consultoria' | 'Marketing' | 'Custas' | 'Outros';
  status: 'Pago' | 'Pendente' | 'Atrasado';
  dueDate: string;
  paymentDate?: string;
}

export interface CallRecord {
  id: string;
  callerName: string;
  information: string;
  dateTime: string;
  lawyerName: string;
  processNumber?: string;
  processPhase?: string;
  isFirstTime: boolean;
  callCount: number;
  priority: 'Baixa' | 'Média' | 'Alta';
  category: string;
}

export interface Lawyer {
  id: string;
  name: string;
  specialty: string;
  oab: string;
  email: string;
  avatarColor: string;
  role?: 'Sócio' | 'Associado';
  bio?: string;
}

export type View = 'dashboard' | 'logs' | 'new-call' | 'customers' | 'processes' | 'finance' | 'lawyers';
