
import React from 'react';
import { SubscriptionLevel } from '../types';

interface LiveSessionsProps {
  subscription: SubscriptionLevel;
  onUpgrade: () => void;
  onBuyPass: () => void;
  hasOneTimePass?: boolean;
}

export const LiveSessions: React.FC<LiveSessionsProps> = ({ subscription, onUpgrade, onBuyPass, hasOneTimePass }) => {
  const isPremium = subscription === 'premium';
  const hasAccess = isPremium || hasOneTimePass;
  const meetLink = "https://meet.google.com/eventos-guau-live";

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom">
      <div className="bg-guauDark text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-guauYellow/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="bg-red-500 w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_red]"></span>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-guauYellow">Live Directo</span>
            </div>
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Martes de Consultoría</h2>
            <p className="text-white/60 font-medium max-w-xl text-sm leading-relaxed">
              Dudas en directo y corrección técnica. Todos los martes a las 19:30h en Google Meet.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-8 rounded-[3rem] border border-white/10 text-center space-y-6 w-full md:w-80">
            {hasAccess ? (
              <div className="space-y-4">
                 <div className="text-4xl">🎥</div>
                 <a href={meetLink} target="_blank" className="block w-full bg-guauYellow text-guauDark py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition uppercase text-xs tracking-widest">Entrar al Meet 🔗</a>
              </div>
            ) : (
              <div className="space-y-4">
                <button onClick={onBuyPass} className="w-full bg-white text-guauDark py-4 rounded-2xl font-black shadow-lg hover:bg-guauYellow transition uppercase text-xs tracking-widest">Pase de 1 día (5€) 💳</button>
                <div className="flex items-center gap-2">
                   <div className="h-px bg-white/20 flex-1"></div>
                   <span className="text-[8px] uppercase text-white/40">o bien</span>
                   <div className="h-px bg-white/20 flex-1"></div>
                </div>
                <button onClick={onUpgrade} className="w-full bg-transparent border-2 border-guauYellow text-guauYellow py-4 rounded-2xl font-black uppercase text-[9px] hover:bg-guauYellow hover:text-guauDark transition">Ser Premium ⭐</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
