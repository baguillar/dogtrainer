
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isPremium: boolean;
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isPremium, activeView, onViewChange, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-guauDark">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-guauDark text-white flex flex-col shrink-0 md:h-screen sticky top-0 z-40 print-hidden">
        <div className="p-8 flex flex-col items-center border-b border-white/5">
          <img 
            src="https://eventosguau.es/wp-content/uploads/2024/08/Eventos-Guau-CON-BORDE-pequeno.png" 
            alt="Eventos GUAU" 
            className="w-24 mb-4 bg-white rounded-2xl p-2 shadow-xl"
          />
          <h1 className="text-[9px] font-black text-guauYellow tracking-[0.3em] uppercase text-center">Dog Personal Trainer</h1>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <SidebarLink 
            icon="📅" label="Entrenamiento" active={activeView === 'dashboard'} 
            onClick={() => onViewChange('dashboard')} 
          />
          <SidebarLink 
            icon="🐶" label="Mi Perro" active={activeView === 'profile'} 
            onClick={() => onViewChange('profile')} 
          />
        </nav>

        <div className="p-6 space-y-4 border-t border-white/5 bg-black/5">
          <button 
            onClick={onLogout}
            className="w-full p-4 rounded-xl font-black hover:bg-white/5 transition text-[10px] flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md shadow-sm p-6 flex justify-between items-center sticky top-0 z-30 print-hidden">
          <h2 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-300">
            {activeView}
          </h2>
          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isPremium ? 'bg-guauYellow text-guauDark' : 'bg-gray-100 text-gray-400'}`}>
            {isPremium ? 'Socio Premium ⭐' : 'Plan Básico'}
          </div>
        </header>
        <div className="p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-4 rounded-2xl font-black transition text-[11px] uppercase tracking-widest flex items-center gap-4 ${active ? 'bg-guauYellow text-guauDark shadow-xl' : 'hover:bg-white/5 text-white/50'}`}
  >
    <span className="text-xl">{icon}</span>
    {label}
  </button>
);
