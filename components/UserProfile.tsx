
import React, { useState } from 'react';
import { UserData, DogProfile, Frequency, SubscriptionLevel } from '../types';

interface UserProfileProps {
  user: UserData;
  onUpdate: (profile: DogProfile, frequency: Frequency) => void;
  onSubscriptionChange: (level: SubscriptionLevel) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate, onSubscriptionChange }) => {
  const [profile, setProfile] = useState<DogProfile>(user.profile || {});
  const [freq, setFreq] = useState<Frequency>(user.frequency || '3-4');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleChange = (key: keyof DogProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    onUpdate(profile, freq);
    setHasUnsavedChanges(false);
    alert("¡Ficha actualizada correctamente!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sidebar Info Perro */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-gray-50 text-center space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-guauYellow"></div>
            <div className="w-40 h-40 bg-guauYellow rounded-[3.5rem] mx-auto flex items-center justify-center text-7xl shadow-2xl transform group-hover:rotate-6 transition-transform duration-500">
              🐶
            </div>
            <div>
               <h3 className="text-4xl font-black text-guauDark uppercase tracking-tighter leading-none">{user.dogName}</h3>
               <div className="mt-4 flex flex-col gap-2">
                 <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${user.subscription === 'premium' ? 'bg-guauYellow text-guauDark' : 'bg-gray-100 text-gray-400'}`}>
                    Socio {user.subscription}
                 </span>
                 {hasUnsavedChanges && (
                   <span className="text-[9px] font-black text-red-500 uppercase animate-pulse italic">⚠️ Tienes cambios sin guardar</span>
                 )}
               </div>
            </div>
          </div>

          <div className="bg-blue-600 p-10 rounded-[3.5rem] text-white shadow-2xl space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl">📋</div>
             <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-200">Datos Legales / Detalle</h4>
             <p className="text-sm font-medium leading-relaxed opacity-90">Completa el formulario externo para validar tu seguro y datos de comportamiento avanzado.</p>
             <a href="https://forms.gle/66WsWp24NwYxKWo26" target="_blank" className="block w-full bg-white text-blue-600 text-center py-5 rounded-[2rem] font-black uppercase text-xs shadow-xl hover:bg-gray-50 hover:scale-105 transition-all">Abrir Google Forms ↗</a>
          </div>

          <div className="bg-guauDark p-10 rounded-[3.5rem] text-white space-y-6 shadow-2xl">
             <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-guauYellow">Gestión Suscripción</h4>
             <div className="space-y-3">
               <button onClick={() => alert("Historial Redsys próximamente...")} className="w-full text-left text-[10px] font-black uppercase text-white/30 hover:text-white transition">Historial de Facturas</button>
               <button 
                onClick={() => onSubscriptionChange(user.subscription === 'premium' ? 'basic' : 'premium')}
                className="w-full text-left text-[10px] font-black uppercase text-guauYellow hover:underline py-2"
               >
                 {user.subscription === 'premium' ? 'Bajar a Plan Básico 📉' : 'Subir a Plan Premium ⭐'}
               </button>
             </div>
          </div>
        </div>

        {/* Detalles Técnicos Editables */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white p-14 rounded-[4rem] shadow-xl border border-gray-50 space-y-12">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black text-guauDark uppercase tracking-tighter leading-none">Mi Ficha Técnica</h3>
              {hasUnsavedChanges && (
                <button onClick={handleSave} className="bg-guauYellow text-guauDark px-10 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:scale-110 transition-all animate-bounce">Guardar Cambios 💾</button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              <EditableItem 
                label="Nombre del Perro" value={profile.dogName} 
                onChange={(v) => handleChange('dogName', v)} 
              />
              <EditableItem 
                label="Raza" value={profile.breed} 
                onChange={(v) => handleChange('breed', v)} 
              />
              <EditableItem 
                label="Fecha de Nacimiento" type="date" value={profile.birthDate} 
                onChange={(v) => handleChange('birthDate', v)} 
              />
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Género</label>
                <div className="flex gap-2">
                  {['macho', 'hembra'].map(g => (
                    <button 
                      key={g} onClick={() => handleChange('gender', g)}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${profile.gender === g ? 'bg-guauDark text-white shadow-lg' : 'bg-gray-50 text-gray-300'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Nivel de Energía</label>
                <div className="flex gap-2">
                  {['baja', 'media', 'alta', 'extrema'].map(e => (
                    <button 
                      key={e} onClick={() => handleChange('energyLevel', e)}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${profile.energyLevel === e ? 'bg-guauYellow text-guauDark shadow-lg' : 'bg-gray-50 text-gray-300'}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Frecuencia Entrenamiento</label>
                <select 
                  value={freq} onChange={(e) => { setFreq(e.target.value as Frequency); setHasUnsavedChanges(true); }}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none font-black uppercase text-xs focus:border-guauYellow transition-all"
                >
                  <option value="1-2">1-2 Días / Semana</option>
                  <option value="3-4">3-4 Días / Semana</option>
                  <option value="daily">Diario (7 Días)</option>
                </select>
              </div>

              <div className="col-span-full border-t border-dashed pt-10">
                <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-4">Nuestros Objetivos</label>
                <textarea 
                  value={profile.goals || ''}
                  onChange={(e) => handleChange('goals', e.target.value)}
                  className="w-full p-8 bg-gray-50 border-2 border-transparent rounded-[2.5rem] outline-none font-medium text-sm focus:border-guauYellow h-40 transition-all"
                  placeholder="Describe qué quieres conseguir con tu perro..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditableItem = ({ label, value, onChange, type = "text" }: { label: string, value?: string, onChange: (v: string) => void, type?: string }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block ml-2">{label}</label>
    <input 
      type={type} value={value || ''} onChange={(e) => onChange(e.target.value)}
      className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none font-black text-xs uppercase focus:border-guauYellow transition-all"
      placeholder={`Escribe ${label.toLowerCase()}...`}
    />
  </div>
);
