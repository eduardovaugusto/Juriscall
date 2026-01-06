
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { View } from '../types';
import { Scale, Database } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  setView: (view: View) => void;
  isDbConnected?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, isDbConnected = true }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex shadow-xl z-10">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-amber-500 p-2 rounded-lg">
            <Scale size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">JurisCall</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeView === item.id 
                  ? 'bg-amber-500 text-white font-medium shadow-md shadow-amber-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Database size={14} className={isDbConnected ? "text-emerald-500" : "text-rose-500"} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {isDbConnected ? "Supabase Online" : "DB Offline"}
              </span>
            </div>
            {isDbConnected && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
              ADM
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Administrador</span>
              <span className="text-xs text-slate-500">Escritório Principal</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-0">
          <h1 className="text-lg font-semibold text-slate-800 capitalize">
            {NAV_ITEMS.find(i => i.id === activeView)?.label}
          </h1>
          <div className="flex items-center gap-4">
             <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-600">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {children}
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 md:hidden">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`flex flex-col items-center gap-1 ${
              activeView === item.id ? 'text-amber-500' : 'text-slate-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
