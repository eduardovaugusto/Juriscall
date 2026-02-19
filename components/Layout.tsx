
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
    <div className="flex h-screen bg-[#FFF9F9] overflow-hidden">
      {/* Sidebar - Desktop Only */}
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
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#FFF9F9]">
        <header className="h-16 bg-[#FFF9F9]/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 z-20">
          <div className="flex items-center gap-3 md:hidden">
            <div className="bg-amber-500 p-1.5 rounded-lg">
              <Scale size={18} className="text-white" />
            </div>
            <h1 className="text-base font-black text-slate-900">JurisCall</h1>
          </div>
          <h1 className="text-sm md:text-lg font-bold text-slate-800 capitalize hidden md:block">
            {NAV_ITEMS.find(i => i.id === activeView)?.label}
          </h1>
          <div className="flex items-center gap-4">
             <div className="bg-slate-100/50 px-3 py-1 rounded-full text-[10px] md:text-xs font-medium text-slate-600">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-24 md:pb-8">
          {children}
        </div>
      </main>
      
      {/* Mobile Navigation - Fixed Bottom Horizontal Scroll */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#FFF9F9]/90 backdrop-blur-lg border-t border-slate-100 md:hidden z-50 overflow-x-auto no-scrollbar shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="flex items-center w-max min-w-full px-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`flex flex-col items-center justify-center py-4 px-4 min-w-[84px] transition-all duration-300 relative ${
                activeView === item.id ? 'text-amber-600 scale-105' : 'text-slate-400'
              }`}
            >
              <div className={`transition-all duration-300 ${activeView === item.id ? 'mb-1.5' : 'mb-1'}`}>
                {/* Fixed: Added <any> type to ReactElement to allow dynamic properties like 'size' which Lucide icons accept */}
                {React.cloneElement(item.icon as React.ReactElement<any>, { 
                  size: activeView === item.id ? 22 : 20,
                  className: activeView === item.id ? 'text-amber-500' : 'text-slate-400'
                })}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-tighter transition-all whitespace-nowrap ${
                activeView === item.id ? 'opacity-100' : 'opacity-60'
              }`}>
                {item.label}
              </span>
              {activeView === item.id && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-500 rounded-b-full"></div>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
