
import React, { useState, useEffect } from 'react';
import { UserData, USERS_DB_KEY, ExerciseTemplate, EXERCISE_LIBRARY_KEY, DayPlan, Exercise } from '../types';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [library, setLibrary] = useState<ExerciseTemplate[]>([]);
  const [activeDayIdx, setActiveDayIdx] = useState<number | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [editingExercise, setEditingExercise] = useState<{dayIdx: number, exIndex: number, ex: Exercise} | null>(null);

  useEffect(() => { refreshData(); }, []);

  const refreshData = () => {
    setUsers(JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]'));
    setLibrary(JSON.parse(localStorage.getItem(EXERCISE_LIBRARY_KEY) || '[]'));
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(1);
      const newItems: ExerciseTemplate[] = lines
        .filter(l => l.trim() && l.split(',').length >= 4)
        .map(l => {
          const [title, description, category, duration, videoUrl] = l.split(',');
          return { id: 'csv_' + Date.now() + Math.random(), title, description, category, duration, videoUrl: videoUrl?.trim() };
        });
      const updated = [...library, ...newItems];
      localStorage.setItem(EXERCISE_LIBRARY_KEY, JSON.stringify(updated));
      setLibrary(updated);
      alert(`¡Importados ${newItems.length} ejercicios con éxito!`);
    };
    reader.readAsText(file);
  };

  const downloadCSVTemplate = () => {
    const content = "title,description,category,duration,videoUrl\nEjemplo de Ejercicio,Instrucciones detalladas aquí,Obediencia,10 min,https://youtube.com/v=...\n";
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_eventos_guau.csv';
    a.click();
  };

  const addExercise = (dayIdx: number, template: ExerciseTemplate) => {
    if (!selectedUser) return;
    const absoluteIdx = 14 + (weekOffset * 7) + dayIdx;
    const newPlan = [...(selectedUser.plan || [])];
    
    while(newPlan.length <= absoluteIdx) {
      newPlan.push({ date: '', exercises: [], isRestDay: true });
    }

    newPlan[absoluteIdx].exercises.push({ ...template, completed: false });
    newPlan[absoluteIdx].isRestDay = false;
    
    updateUserPlan(newPlan);
    setActiveDayIdx(null);
  };

  const updateUserPlan = (newPlan: DayPlan[]) => {
    if (!selectedUser) return;
    const updatedUser = { ...selectedUser, plan: newPlan };
    const updatedUsers = users.map(u => u.email === selectedUser.email ? updatedUser : u);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setSelectedUser(updatedUser);
  };

  const handleUpdateSpecificExercise = () => {
    if (!editingExercise || !selectedUser) return;
    const newPlan = [...(selectedUser.plan || [])];
    newPlan[editingExercise.dayIdx].exercises[editingExercise.exIndex] = editingExercise.ex;
    updateUserPlan(newPlan);
    setEditingExercise(null);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[3rem] shadow-sm gap-4">
        <h2 className="text-2xl font-black text-guauDark uppercase tracking-tighter">Panel Maestro</h2>
        <div className="flex gap-4 items-center">
          <button onClick={downloadCSVTemplate} className="text-[9px] font-black uppercase text-gray-400 hover:text-guauDark underline">Descargar Plantilla CSV</button>
          <label className="bg-guauDark text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg cursor-pointer hover:bg-black transition">
            📥 Subir Ejercicios CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-4">Clientes en Sistema</h3>
          <div className="space-y-2">
            {users.filter(u => u.role !== 'admin').map(u => (
              <button key={u.email} onClick={() => { setSelectedUser(u); setWeekOffset(0); }} className={`w-full text-left p-6 rounded-[2.5rem] border-2 transition ${selectedUser?.email === u.email ? 'border-guauYellow bg-yellow-50' : 'bg-white border-transparent'}`}>
                <div className="font-black text-xs uppercase">{u.dogName || u.email}</div>
                <div className="text-[8px] text-gray-400 font-bold uppercase mt-1">Plan {u.subscription} • {u.status}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-9">
          {selectedUser ? (
            <div className="bg-white p-12 rounded-[4rem] border shadow-sm space-y-10 animate-in zoom-in">
               <div className="flex justify-between items-start border-b pb-8">
                  <div>
                    <h3 className="text-4xl font-black uppercase tracking-tighter">Planificación: {selectedUser.dogName}</h3>
                    <div className="flex gap-4 mt-2">
                      <button onClick={() => setWeekOffset(weekOffset-1)} className="text-[10px] font-black uppercase text-gray-300 hover:text-guauDark">← Anterior</button>
                      <span className="text-[10px] font-black uppercase text-guauYellow bg-guauDark px-4 py-1 rounded-full">Semana: {weekOffset === 0 ? 'Actual' : weekOffset}</span>
                      <button onClick={() => setWeekOffset(weekOffset+1)} className="text-[10px] font-black uppercase text-gray-300 hover:text-guauDark">Siguiente →</button>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-[9px] font-black uppercase text-gray-400">Objetivo: {selectedUser.profile?.goals}</p>
                    <textarea 
                      placeholder="Escribe comentarios técnicos para el usuario (se verán en su entrenamiento)..."
                      className="text-[10px] p-4 bg-gray-50 rounded-2xl w-64 h-24 border outline-none"
                      defaultValue={selectedUser.profile?.adminComments}
                      onBlur={(e) => {
                         const updated = users.map(u => u.email === selectedUser.email ? { ...u, profile: { ...u.profile!, adminComments: e.target.value } } : u);
                         localStorage.setItem(USERS_DB_KEY, JSON.stringify(updated));
                         setUsers(updated);
                      }}
                    />
                  </div>
               </div>

               <div className="grid grid-cols-7 gap-2">
                  {selectedUser.plan?.slice(14 + (weekOffset*7), 14 + (weekOffset*7) + 7).map((day, dIdx) => {
                    const absIdx = 14 + (weekOffset*7) + dIdx;
                    const isPreferred = selectedUser.profile?.preferredDaysNextWeek?.includes(dIdx);
                    return (
                      <div key={dIdx} className={`border-2 rounded-3xl p-3 min-h-[220px] flex flex-col transition ${isPreferred ? 'bg-yellow-50 border-guauYellow/30 shadow-inner' : 'bg-gray-50 border-gray-50'}`}>
                        <div className="text-[8px] font-black uppercase text-center mb-3 flex items-center justify-center gap-1">
                          Día {dIdx+1} {isPreferred && <span title="Día preferido por el cliente">⭐</span>}
                        </div>
                        <div className="flex-1 space-y-1">
                          {day.exercises.map((ex, exIdx) => (
                            <div 
                              key={ex.id} 
                              onClick={() => setEditingExercise({ dayIdx: absIdx, exIndex: exIdx, ex: { ...ex } })}
                              className={`p-2 rounded-xl text-[7px] font-bold leading-tight cursor-pointer hover:bg-black transition border-2 flex flex-col gap-1 ${ex.feedback ? 'bg-red-500 text-white border-white animate-pulse' : 'bg-guauDark text-white border-transparent'}`}
                            >
                              <div className="flex justify-between items-center">
                                <span>{ex.title}</span>
                                {ex.feedback && <span title="¡El cliente tiene dudas!" className="bg-white text-red-500 rounded-full w-3 h-3 flex items-center justify-center text-[6px]">!</span>}
                              </div>
                              {ex.feedback && <div className="text-[5px] uppercase opacity-70 italic truncate">Duda: {ex.feedback}</div>}
                            </div>
                          ))}
                        </div>
                        <button onClick={() => setActiveDayIdx(dIdx)} className="mt-2 py-2 bg-white border border-dashed text-[8px] font-black uppercase text-gray-300 hover:text-guauYellow hover:border-guauYellow transition">ASIGNAR</button>
                      </div>
                    );
                  })}
               </div>
            </div>
          ) : (
            <div className="h-[500px] flex flex-col items-center justify-center text-gray-200 border-8 border-dashed border-gray-100 rounded-[5rem] font-black uppercase tracking-[0.4em] opacity-30 text-center p-20">
              🦴 Selecciona un cliente para planificar sus ejercicios de forma manual
            </div>
          )}
        </div>
      </div>

      {editingExercise && (
        <div className="fixed inset-0 bg-guauDark/95 backdrop-blur-md flex items-center justify-center z-[200] p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 space-y-6 overflow-y-auto max-h-[90vh]">
            <h4 className="text-xl font-black uppercase tracking-tighter">Personalizar Ejercicio</h4>
            
            {editingExercise.ex.feedback && (
              <div className="bg-red-50 border-2 border-red-100 p-6 rounded-2xl space-y-2">
                <h5 className="text-[10px] font-black text-red-500 uppercase tracking-widest">💬 Duda del Cliente:</h5>
                <p className="text-sm font-bold text-guauDark italic">"{editingExercise.ex.feedback}"</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase">Responde editando las instrucciones de abajo.</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-300 uppercase ml-2">Título Ejercicio</label>
                <input 
                  className="w-full p-4 bg-gray-50 border rounded-xl outline-none font-bold" 
                  value={editingExercise.ex.title} 
                  onChange={e => setEditingExercise({...editingExercise, ex: {...editingExercise.ex, title: e.target.value}})} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-300 uppercase ml-2">Instrucciones Personalizadas</label>
                <textarea 
                  className="w-full p-4 bg-gray-50 border rounded-xl outline-none text-sm h-32" 
                  value={editingExercise.ex.description} 
                  onChange={e => setEditingExercise({...editingExercise, ex: {...editingExercise.ex, description: e.target.value}})} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-300 uppercase ml-2">Duración</label>
                <input 
                  className="w-full p-4 bg-gray-50 border rounded-xl outline-none font-bold text-xs" 
                  value={editingExercise.ex.duration} 
                  onChange={e => setEditingExercise({...editingExercise, ex: {...editingExercise.ex, duration: e.target.value}})} 
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setEditingExercise(null)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black uppercase text-[10px]">Cancelar</button>
              <button onClick={handleUpdateSpecificExercise} className="flex-1 py-4 bg-guauYellow rounded-2xl font-black uppercase text-[10px]">Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}

      {activeDayIdx !== null && (
        <div className="fixed inset-0 bg-guauDark/95 backdrop-blur-md flex items-center justify-center z-[200] p-6">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 space-y-6 animate-in zoom-in">
              <div className="flex justify-between items-center border-b pb-4">
                <h4 className="text-xl font-black uppercase tracking-tighter">Añadir de Biblioteca</h4>
                <button onClick={() => setActiveDayIdx(null)} className="text-2xl text-gray-300">✕</button>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                 {library.length === 0 ? <p className="text-center py-10 text-gray-400 font-bold uppercase text-xs">La biblioteca está vacía. Sube un CSV.</p> : 
                 library.map(l => (
                   <button key={l.id} onClick={() => addExercise(activeDayIdx!, l)} className="text-left p-5 border rounded-2xl hover:bg-yellow-50 hover:border-guauYellow transition flex justify-between items-center group">
                     <div>
                        <div className="text-xs font-black uppercase text-guauDark">{l.title}</div>
                        <div className="text-[8px] text-gray-400 font-bold uppercase">{l.duration} • {l.category}</div>
                     </div>
                     <span className="text-xl group-hover:scale-125 transition">⊕</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
