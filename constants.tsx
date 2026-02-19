
import React from 'react';
import { LayoutDashboard, PhoneCall, ListFilter, Users, Scale, Briefcase, DollarSign, Gavel } from 'lucide-react';
import { Customer, LegalProcess, CallRecord, Lawyer, FinancialTransaction } from './types';

export const LAWYERS: string[] = [
  "Dr. Eduardo Augusto",
  "Dr. André Oliveira",
  "Dra. Maria Fernanda",
  "Dr. Ricardo Silva",
  "Dr. Mateus Mendes Darri"
];

export const INITIAL_LAWYERS_DATA: Lawyer[] = [
  {
    id: 'l3',
    name: "Dr. André Oliveira",
    specialty: "Direito Previdenciário (RPPS/RGPS)",
    oab: "OAB/SP 345.678",
    email: "andre.prev@juriscall.com.br",
    avatarColor: "bg-emerald-600",
    role: 'Sócio',
    bio: "Especialista em cálculos previdenciários complexos e revisão da vida toda."
  },
  {
    id: 'l0',
    name: "Dr. Eduardo Augusto",
    specialty: "Regimes Próprios e Planejamento",
    oab: "OAB/SP 001.001",
    email: "eduardo.augusto@juriscall.com.br",
    avatarColor: "bg-slate-900",
    role: 'Sócio',
    bio: "Mestre em Direito pela USP, focado em servidores públicos e previdência complementar."
  }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'customers', label: 'Segurados', icon: <Users size={20} /> },
  { id: 'processes', label: 'Processos', icon: <Briefcase size={20} /> },
  { id: 'lawyers', label: 'Especialistas', icon: <Gavel size={20} /> },
  { id: 'finance', label: 'Financeiro', icon: <DollarSign size={20} /> },
  { id: 'logs', label: 'Atendimentos', icon: <ListFilter size={20} /> },
  { id: 'new-call', label: 'Triagem', icon: <PhoneCall size={20} /> },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'prev-c1',
    name: 'Benedito dos Santos',
    document: '111.222.333-44',
    phone: '(11) 98888-1111',
    email: 'benedito.santos@email.com',
    address: 'Rua das Indústrias, 450 - São Bernardo do Campo/SP',
    status: 'Ativo',
    interviewNotes: 'Trabalhou 25 anos em fundição com ruído acima de 90dB. Possui PPPs incompletos. CNIS apresenta períodos sem recolhimento em 1994-1996.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prev-c2',
    name: 'Maria do Carmo Silva',
    document: '222.333.444-55',
    phone: '(19) 97777-2222',
    email: 'maria.carmo@email.com',
    address: 'Sítio Boa Esperança - Zona Rural, Paulínia/SP',
    status: 'Ativo',
    interviewNotes: 'Busca aposentadoria por idade híbrida. Trabalhou na roça dos 12 aos 24 anos sem registro. Depois contribuiu como costureira.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prev-c3',
    name: 'Dra. Helena Mendes',
    document: '333.444.555-66',
    phone: '(11) 99999-3333',
    email: 'helena.mendes@hospital.com',
    address: 'Av. Paulista, 2000 - São Paulo/SP',
    status: 'Ativo',
    interviewNotes: 'Enfermeira de UTI. Exposição constante a agentes biológicos. Possui 22 anos de tempo especial comprovado por LTCAT.',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_PROCESSES: LegalProcess[] = [
  {
    id: 'p-prev-1',
    processNumber: '5001234-99.2024.4.03.6100',
    title: 'Aposentadoria por Tempo de Contribuição (Pedágio 50%)',
    customerId: 'prev-c1',
    lawyerName: 'Dr. André Oliveira',
    phase: 'Instrução',
    description: 'Conversão de tempo especial em comum (1.4). Objetivo: Concessão da aposentadoria com base na regra de transição do pedágio de 50%.',
    cnisSummary: '33 anos e 6 meses de contribuição comum. Adição de 7 anos de tempo especial (fundição). Total projetado: 40 anos e 6 meses.',
    estimatedBenefitValue: 4850.00,
    contributionTime: '40 anos e 6 meses',
    honoraryValue: 14550.00,
    startDate: '2024-01-15',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-prev-2',
    processNumber: '5009876-11.2024.4.03.6100',
    title: 'Aposentadoria por Idade Híbrida',
    customerId: 'prev-c2',
    lawyerName: 'Dr. André Oliveira',
    phase: 'Petição Inicial',
    description: 'Averbação de tempo rural (economia familiar) para soma ao tempo urbano. Provas testemunhais e documentos da propriedade rural dos pais.',
    cnisSummary: '12 anos de contribuição urbana. Necessário comprovar 3 anos de atividade rural para atingir a carência de 15 anos.',
    estimatedBenefitValue: 1980.50,
    contributionTime: '15 anos e 2 meses',
    honoraryValue: 5941.50,
    startDate: '2024-03-10',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-prev-3',
    processNumber: '5004433-22.2024.4.03.6100',
    title: 'Aposentadoria Especial (Agentes Biológicos)',
    customerId: 'prev-c3',
    lawyerName: 'Dr. Eduardo Augusto',
    phase: 'Audiência',
    description: 'Concessão de Aposentadoria Especial. Enfermeira com 25 anos de atividade em ambiente hospitalar insalubre (agentes nocivos biológicos).',
    cnisSummary: 'CNIS completo, porém o INSS não reconheceu o enquadramento especial automático de 2 períodos.',
    estimatedBenefitValue: 7507.49, // Teto ou próximo do teto
    contributionTime: '25 anos especiais',
    honoraryValue: 22500.00,
    startDate: '2024-02-05',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_CALLS: CallRecord[] = [];
export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [];
export const PROCESS_PHASES = [
  "Petição Inicial",
  "Citação INSS",
  "Réplica",
  "Perícia Médica",
  "Audiência",
  "Sentença",
  "Recurso (TRF)",
  "Execução / RPV",
  "Arquivado"
];
