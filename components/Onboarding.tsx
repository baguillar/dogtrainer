
import React, { useState } from 'react';
import { DogProfile, Frequency } from '../types';

interface OnboardingProps {
  onComplete: (profile: DogProfile, frequency: Frequency) => void;
  initialProfile?: DogProfile;
  initialFrequency?: Frequency;
  isEditing?: boolean;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialProfile, initialFrequency, isEditing = false }) => {
  const [step, setStep] = useState<'basic' | 'technical' | 'google_form' | 'frequency'>('basic');
  
  const [profile, setProfile] = useState<DogProfile>(initialProfile || {
    ownerEmail: '',
    ownerName: '',
    ownerPhone: '',
    dogName: '',
    breed: '',
    birthDate: '',
    gender: 'macho',
    isCastrated: false,
    energyLevel: 'media',
    healthIssues: '',
    behaviorProblems: [],
    currentLevel: 'nada',
    goals: '',
    updatedAt: new Date().toISOString(),
    preferredDaysNextWeek: []
  });
  const [frequency, setFrequency] = useState<Frequency>(initialFrequency || '3-4');

  return (
    <div className={`max-w-3xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden mb-10 border border-gray-100 ${isEditing ? '' : 'mt-6'}`}>
      <div className="bg-guauYellow p-10 text-center">
        <h2 className="text-3xl font-black text-guauDark uppercase">{isEditing ? 'Actualizar Ficha' : 'Bienvenido a Eventos GUAU'}</h2>
        <p className="text-guauDark/60 font-bold text-sm uppercase tracking-widest italic">Personaliza el entrenamiento de tu mejor amigo</p>
      </div>

      <div className="p-10">
        <div className="flex gap-2 mb-10 justify-center">
          {['basic', 'technical', 'google_form', 'frequency'].map((s) => (
            <div key={s} className={`h-2 w-12 rounded-full transition-all ${step === s ? 'bg-guauYellow w-20' : 'bg-gray-100'}`} />
          ))}
        </div>

        {step === 'basic' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h3 className="text-xl font-black uppercase tracking-tighter border-b pb-2">1. Datos del Tutor y Perro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Tu Nombre</label>
                <input 
                  placeholder="Ej: Carlos" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-guauYellow font-bold"
                  value={profile.ownerName || ''} onChange={e => setProfile({...profile, ownerName: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nombre del Perro</label>
                <input 
                  placeholder="Ej: Lia" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-guauYellow font-bold"
                  value={profile.dogName || ''} onChange={e => setProfile({...profile, dogName: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2">¿Cuál es tu objetivo principal?</label>
              <textarea 
                placeholder="Ej: Quiero que venga cuando le llamo y que camine tranquilo." className="w-full p-4 bg-gray-50 border rounded-2xl h-32 outline-none focus:ring-2 focus:ring-guauYellow"
                value={profile.goals} onChange={e => setProfile({...profile, goals: e.target.value})}
              />
            </div>
            <button 
              onClick={() => setStep('technical')}
              disabled={!profile.ownerName || !profile.dogName || !profile.goals}
              className="w-full bg-guauDark text-white py-4 rounded-2xl font-black uppercase shadow-lg disabled:opacity-30 hover:scale-[1.01] transition"
            >SIGUIENTE PASO</button>
          </div>
        )}

        {step === 'technical' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h3 className="text-xl font-black uppercase tracking-tighter border-b pb-2">2. Ficha Técnica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Fecha de Nacimiento</label>
                <input 
                  type="date" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-guauYellow font-bold"
                  value={profile.birthDate || ''} onChange={e => setProfile({...profile, birthDate: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Género</label>
                <select 
                  className="w-full p-4 bg-gray-50 border rounded-2xl outline-none font-bold"
                  value={profile.gender} onChange={e => setProfile({...profile, gender: e.target.value as any})}
                >
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                </select>
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nivel de Energía</label>
                <div className="grid grid-cols-3 gap-2">
                  {['baja', 'media', 'alta'].map(lvl => (
                    <button 
                      key={lvl}
                      onClick={() => setProfile({...profile, energyLevel: lvl as any})}
                      className={`p-3 rounded-xl border-2 font-black uppercase text-[10px] transition ${profile.energyLevel === lvl ? 'bg-guauYellow border-guauYellow' : 'bg-gray-50 border-transparent'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep('basic')} className="w-1/3 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase text-xs">Atrás</button>
              <button onClick={() => setStep('google_form')} className="flex-1 bg-guauDark text-white py-4 rounded-2xl font-black uppercase shadow-lg">Continuar</button>
            </div>
          </div>
        )}

        {step === 'google_form' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300 text-center">
            <h3 className="text-xl font-black uppercase tracking-tighter border-b pb-2 text-left">3. Formulario Detallado</h3>
            <div className="bg-blue-50 p-8 rounded-[2rem] space-y-4 border-2 border-blue-100">
               <p className="text-sm font-bold text-blue-800 leading-relaxed uppercase italic">
                 ¡IMPORTANTE! Necesitamos este formulario para validar tu inscripción:
               </p>
               <a 
                href="https://forms.gle/66WsWp24NwYxKWo26" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-blue-700 hover:scale-105 transition"
               >
                 Abrir Google Forms ↗
               </a>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep('technical')} className="w-1/3 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase text-xs">Atrás</button>
              <button onClick={() => setStep('frequency')} className="w-2/3 bg-guauDark text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg">Ya lo he completado</button>
            </div>
          </div>
        )}

        {step === 'frequency' && (
          <div className="space-y-8 animate-in zoom-in duration-300">
            <h3 className="text-xl font-black uppercase tracking-tighter border-b pb-2 text-center">Plan Semanal</h3>
            <p className="text-center text-gray-400 text-sm font-bold uppercase italic">¿Con qué frecuencia quieres que trabajemos?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['1-2', '3-4', 'daily'] as Frequency[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`p-6 rounded-2xl border-2 transition text-center flex flex-col items-center gap-2 ${
                    frequency === f ? 'border-guauYellow bg-yellow-50 text-guauDark shadow-md scale-105' : 'border-gray-100 text-gray-400'
                  }`}
                >
                  <div className="text-3xl">{f === 'daily' ? '⚡' : f === '3-4' ? '🔥' : '🌱'}</div>
                  <div className="font-black uppercase text-[10px] tracking-widest">{f === 'daily' ? 'Diario' : f + ' días'}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep('google_form')} className="w-1/3 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase text-xs">Atrás</button>
              <button 
                onClick={() => onComplete(profile, frequency)}
                className="w-2/3 bg-guauYellow text-guauDark py-6 rounded-[2rem] font-black text-lg uppercase shadow-xl hover:scale-[1.02] transition"
              >
                {isEditing ? 'Guardar Cambios 🐾' : '¡Finalizar Registro! 🐾'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
