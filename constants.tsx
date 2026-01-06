
import React from 'react';
import { LayoutDashboard, PhoneCall, ListFilter, Users, Scale, FileText, UserPlus, Briefcase, DollarSign, Gavel } from 'lucide-react';
import { FinancialTransaction, Customer, LegalProcess, CallRecord, Lawyer } from './types';

export const LAWYERS: string[] = [
  "Dr. Eduardo Augusto",
  "Dr. Ricardo Silva",
  "Dra. Maria Fernanda",
  "Dr. André Oliveira",
  "Dr. Mateus Mendes Darri"
];

export const INITIAL_LAWYERS_DATA: Lawyer[] = [
  {
    id: 'l0',
    name: "Dr. Eduardo Augusto",
    specialty: "Direito Empresarial e Estratégico",
    oab: "OAB/SP 001.001",
    email: "eduardo.augusto@juriscall.com.br",
    avatarColor: "bg-slate-900",
    role: 'Sócio',
    bio: "Mestre em Direito Comercial pela USP. Especialista em fusões, aquisições e estruturação de holdings familiares com mais de 20 anos de atuação no mercado corporativo paulista."
  },
  {
    id: 'l1',
    name: "Dr. Ricardo Silva",
    specialty: "Direito Civil e Sucessões",
    oab: "OAB/SP 123.456",
    email: "ricardo.silva@juriscall.com.br",
    avatarColor: "bg-blue-500",
    role: 'Associado',
    bio: "Especialista em Direito de Família e Sucessões. Atuação focada em inventários complexos e planejamentos sucessórios de alta complexidade técnica."
  },
  {
    id: 'l2',
    name: "Dra. Maria Fernanda",
    specialty: "Direito do Trabalho",
    oab: "OAB/SP 234.567",
    email: "maria.fernanda@juriscall.com.br",
    avatarColor: "bg-rose-500",
    role: 'Associado',
    bio: "Pós-graduada em Direito e Processo do Trabalho. Ampla experiência em defesas patronais e reclamações trabalhistas estratégicas para executivos."
  },
  {
    id: 'l3',
    name: "Dr. André Oliveira",
    specialty: "Direito Previdenciário",
    oab: "OAB/SP 345.678",
    email: "andre.oliveira@juriscall.com.br",
    avatarColor: "bg-emerald-500",
    role: 'Associado',
    bio: "Especialista em RPPS e RGPS. Focado na concessão de benefícios complexos e revisões de aposentadoria com teses inovadoras perante os tribunais superiores."
  },
  {
    id: 'l4',
    name: "Dr. Mateus Mendes Darri",
    specialty: "Direito Penal e Criminal",
    oab: "OAB/SP 456.789",
    email: "mateus.darri@juriscall.com.br",
    avatarColor: "bg-amber-700",
    role: 'Associado',
    bio: "Atuação em crimes de 'colarinho branco' e defesas criminais estratégicas. Professor convidado de processo penal em cursos de especialização."
  }
];

export const CATEGORIES = [
  "Consulta Inicial",
  "Andamento Processual",
  "Dúvida Financeira",
  "Agendamento",
  "Urgência",
  "Outros"
];

export const PROCESS_PHASES = [
  "Petição Inicial",
  "Citação",
  "Audiência",
  "Instrução",
  "Sentença",
  "Recurso",
  "Execução",
  "Cumprimento de Sentença",
  "Arquivado"
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'customers', label: 'Clientes', icon: <Users size={20} /> },
  { id: 'processes', label: 'Processos', icon: <Briefcase size={20} /> },
  { id: 'lawyers', label: 'Advogados', icon: <Gavel size={20} /> },
  { id: 'finance', label: 'Financeiro', icon: <DollarSign size={20} /> },
  { id: 'logs', label: 'Registros', icon: <ListFilter size={20} /> },
  { id: 'new-call', label: 'Nova Chamada', icon: <PhoneCall size={20} /> },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'João da Silva',
    document: '123.456.789-00',
    phone: '(11) 98888-7777',
    email: 'joao@email.com',
    address: 'Rua das Flores, 123 - São Paulo',
    status: 'Ativo',
    createdAt: new Date(Date.now() - 1000000000).toISOString()
  },
  {
    id: 'c2',
    name: 'Marcos Oliveira',
    document: '987.654.321-11',
    phone: '(11) 97777-6666',
    email: 'marcos.oliveira@email.com',
    address: 'Av. Paulista, 1000 - São Paulo',
    status: 'Ativo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'c3',
    name: 'Roberto Almeida',
    document: '222.333.444-55',
    phone: '(19) 98111-2233',
    email: 'roberto.almeida@email.com',
    address: 'Bairro Cambuí, Campinas/SP',
    status: 'Ativo',
    createdAt: new Date('2020-03-01').toISOString()
  },
  {
    id: 'c4',
    name: 'Beatriz Helena',
    document: '555.666.777-88',
    phone: '(11) 99111-0099',
    email: 'beatriz.helena@email.com',
    address: 'Rua Itapura, 1200 - Tatuapé/SP',
    status: 'Ativo',
    interviewNotes: "Contrato assinado para divórcio consensual.",
    createdAt: new Date().toISOString()
  },
  {
    id: 'c5',
    name: 'Grupo Empresarial X',
    document: '11.222.333/0001-44',
    phone: '(11) 3333-4444',
    email: 'contato@grupox.com',
    address: 'Av. Faria Lima, 4500 - São Paulo',
    status: 'Ativo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'c6',
    name: 'Lúcia Ferreira',
    document: '333.444.555-66',
    phone: '(11) 91234-5678',
    email: 'lucia.ferreira@email.com',
    address: 'Rua Augusta, 500 - São Paulo',
    status: 'Ativo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'c7',
    name: 'Felipe Santos',
    document: '444.555.666-77',
    phone: '(11) 90000-1111',
    email: 'felipe.santos@email.com',
    address: 'Vila Madalena, SP',
    status: 'Lead',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_CALLS: CallRecord[] = [
  // Dr. Eduardo
  {
    id: 'cal-edu-1',
    callerName: 'Grupo Empresarial X',
    information: 'Revisão de contrato social e fusão.',
    dateTime: new Date(Date.now() - 3600000).toISOString(),
    lawyerName: 'Dr. Eduardo Augusto',
    isFirstTime: true,
    callCount: 1,
    priority: 'Alta',
    category: 'Consulta Inicial'
  },
  // Dr. Ricardo
  {
    id: 'cal-ric-1',
    callerName: 'João da Silva',
    information: 'Gostaria de saber sobre o processo de inventário do pai dele.',
    dateTime: new Date(Date.now() - 86400000).toISOString(),
    lawyerName: 'Dr. Ricardo Silva',
    processNumber: '1002345-67.2023.8.26.0100',
    processPhase: 'Instrução',
    isFirstTime: false,
    callCount: 3,
    priority: 'Média',
    category: 'Andamento Processual'
  },
  {
    id: 'cal-ric-2',
    callerName: 'Beatriz Helena',
    information: 'Dúvidas sobre separação de bens.',
    dateTime: new Date(Date.now() - 432000000).toISOString(),
    lawyerName: 'Dr. Ricardo Silva',
    isFirstTime: true,
    callCount: 1,
    priority: 'Média',
    category: 'Consulta Inicial'
  },
  // Dra. Maria Fernanda
  {
    id: 'cal-mar-1',
    callerName: 'Ana Paula',
    information: 'Dúvida sobre rescisão indireta.',
    dateTime: new Date(Date.now() - 172800000).toISOString(),
    lawyerName: 'Dra. Maria Fernanda',
    isFirstTime: true,
    callCount: 1,
    priority: 'Alta',
    category: 'Consulta Inicial'
  },
  {
    id: 'cal-mar-2',
    callerName: 'Marcos Oliveira',
    information: 'Andamento da reclamação trabalhista.',
    dateTime: new Date(Date.now() - 43200000).toISOString(),
    lawyerName: 'Dra. Maria Fernanda',
    processNumber: '1000543-21.2024.5.02.0001',
    isFirstTime: false,
    callCount: 2,
    priority: 'Baixa',
    category: 'Andamento Processual'
  },
  // Dr. André
  {
    id: 'cal-and-1',
    callerName: 'Lúcia Ferreira',
    information: 'Consulta sobre aposentadoria por tempo de contribuição.',
    dateTime: new Date(Date.now() - 172800000).toISOString(),
    lawyerName: 'Dr. André Oliveira',
    isFirstTime: true,
    callCount: 1,
    priority: 'Média',
    category: 'Consulta Inicial'
  },
  // Dr. Mateus Mendes Darri
  { id: 'cal-mat-1', callerName: 'Felipe Santos', information: 'Defesa em processo criminal de trânsito.', dateTime: new Date().toISOString(), lawyerName: 'Dr. Mateus Mendes Darri', isFirstTime: true, callCount: 1, priority: 'Alta', category: 'Consulta Inicial' },
  { id: 'cal-mat-2', callerName: 'Carlos Silva', information: 'Informação sobre habeas corpus.', dateTime: new Date().toISOString(), lawyerName: 'Dr. Mateus Mendes Darri', isFirstTime: true, callCount: 1, priority: 'Alta', category: 'Urgência' },
  { id: 'cal-mat-3', callerName: 'Joana Darc', information: 'Queixa crime por calúnia.', dateTime: new Date().toISOString(), lawyerName: 'Dr. Mateus Mendes Darri', isFirstTime: true, callCount: 1, priority: 'Média', category: 'Consulta Inicial' },
  { id: 'cal-mat-4', callerName: 'Pedro Alvares', information: 'Dúvida sobre execução penal.', dateTime: new Date().toISOString(), lawyerName: 'Dr. Mateus Mendes Darri', isFirstTime: true, callCount: 1, priority: 'Baixa', category: 'Consulta Inicial' },
  { id: 'cal-mat-5', callerName: 'Roberto Carlos', information: 'Pedido de vista em processo criminal.', dateTime: new Date().toISOString(), lawyerName: 'Dr. Mateus Mendes Darri', isFirstTime: true, callCount: 1, priority: 'Média', category: 'Andamento Processual' },
  { id: 'cal-mat-6', callerName: 'Tiago Leifert', information: 'Consultoria para crimes digitais.', dateTime: new Date().toISOString(), lawyerName: 'Dr. Mateus Mendes Darri', isFirstTime: true, callCount: 1, priority: 'Média', category: 'Consulta Inicial' },
  { id: 'cal-mat-7', callerName: 'Fernanda Lima', information: 'Audiência de custódia agendada.', dateTime: new Date().toISOString(), lawyerName: 'Dr. Mateus Mendes Darri', isFirstTime: true, callCount: 1, priority: 'Alta', category: 'Urgência' },
  { id: 'cal-mat-8', callerName: 'Bruno Mezenga', information: 'Dúvidas sobre regime semi-aberto.', dateTime: new Date().toISOString(), lawyerName: 'Dr. Mateus Mendes Darri', isFirstTime: true, callCount: 1, priority: 'Média', category: 'Consulta Inicial' }
];

export const INITIAL_PROCESSES: LegalProcess[] = [
  // Casos do Dr. Eduardo Augusto
  {
    id: 'p-edu-1',
    processNumber: '1009999-00.2024.8.26.0100',
    title: 'Consultoria Societária - Grupo X',
    customerId: 'c5',
    lawyerName: 'Dr. Eduardo Augusto',
    phase: 'Instrução',
    description: 'Processo estratégico de reestruturação de capital.',
    startDate: '2024-01-01',
    honoraryValue: 50000,
    totalEstimatedValue: 500000,
    createdAt: new Date().toISOString()
  },
  // Casos do Dr. Ricardo Silva
  {
    id: 'p-ric-1',
    processNumber: '1002345-67.2023.8.26.0100',
    title: 'Inventário - Espólio de Antonio Silva',
    customerId: 'c1',
    lawyerName: 'Dr. Ricardo Silva',
    phase: 'Instrução',
    description: 'Inventário judicial envolvendo imóveis e ativos.',
    startDate: '2023-01-15',
    honoraryValue: 8000,
    totalEstimatedValue: 40000,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-ric-2',
    processNumber: '1004455-88.2024.8.26.0100',
    title: 'Divórcio Consensual - Beatriz',
    customerId: 'c4',
    lawyerName: 'Dr. Ricardo Silva',
    phase: 'Petição Inicial',
    description: 'Ação de divórcio com partilha de bens amigável.',
    startDate: '2024-02-10',
    honoraryValue: 5000,
    totalEstimatedValue: 15000,
    createdAt: new Date().toISOString()
  },
  // Casos da Dra. Maria Fernanda
  {
    id: 'p-mar-1',
    processNumber: '1000543-21.2024.5.02.0001',
    title: 'Reclamação Trabalhista - Marcos vs. Logística Global',
    customerId: 'c2',
    lawyerName: 'Dra. Maria Fernanda',
    phase: 'Citação',
    description: 'Pedido de horas extras e reconhecimento de vínculo.',
    startDate: '2024-05-20',
    honoraryValue: 12000,
    totalEstimatedValue: 45000,
    createdAt: new Date().toISOString()
  },
  // Casos do Dr. André Oliveira
  {
    id: 'p-and-1',
    processNumber: '5001234-55.2023.4.03.6100',
    title: 'Concessão de Aposentadoria - Lúcia',
    customerId: 'c6',
    lawyerName: 'Dr. André Oliveira',
    phase: 'Sentença',
    description: 'Ação previdenciária para reconhecimento de tempo especial.',
    startDate: '2023-08-05',
    honoraryValue: 9000,
    totalEstimatedValue: 32000,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p-and-2',
    processNumber: '1000888-99.2020.5.15.0001',
    title: 'Sucesso: Roberto vs. Metalúrgica',
    customerId: 'c3',
    lawyerName: 'Dr. André Oliveira',
    phase: 'Arquivado',
    description: 'Causa finalizada com êxito total.',
    startDate: '2020-03-10',
    honoraryValue: 18000,
    totalEstimatedValue: 60000,
    createdAt: new Date('2020-03-10').toISOString()
  },
  // Casos do Dr. Mateus Mendes Darri
  {
    id: 'p-mat-1',
    processNumber: '1501234-11.2024.8.26.0050',
    title: 'Ação de Calúnia - Joana vs. Vizinho',
    customerId: 'c7',
    lawyerName: 'Dr. Mateus Mendes Darri',
    phase: 'Petição Inicial',
    description: 'Defesa de honra e danos morais.',
    startDate: new Date().toISOString().split('T')[0],
    honoraryValue: 3500,
    totalEstimatedValue: 15000,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 't-edu-1',
    customerId: 'c5',
    description: 'Honorários Retainers - Grupo X',
    amount: 15000,
    type: 'Entrada',
    category: 'Consultoria',
    status: 'Pago',
    dueDate: new Date().toISOString(),
    paymentDate: new Date().toISOString()
  },
  {
    id: 't-and-1',
    customerId: 'c3',
    description: 'Honorários Êxito - Roberto Almeida',
    amount: 18000,
    type: 'Entrada',
    category: 'Honorários de Êxito',
    status: 'Pago',
    dueDate: '2024-01-15',
    paymentDate: '2024-01-15'
  },
  {
    id: 't-ric-1',
    customerId: 'c1',
    description: 'Honorários Iniciais - João Silva',
    amount: 4000,
    type: 'Entrada',
    category: 'Honorários Iniciais',
    status: 'Pago',
    dueDate: '2023-02-15',
    paymentDate: '2023-02-15'
  }
];
