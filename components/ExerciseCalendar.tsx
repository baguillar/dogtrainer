
import React, { useState } from 'react';
import { DayPlan, Exercise, UserData, Frequency, DogProfile } from '../types';

interface CalendarProps {
  user: UserData | null;
  plan: DayPlan[];
  onToggleComplete: (dayIndex: number, exerciseId: string) => void;
  onUpdateFeedback: (dayIndex: number, exerciseId: string, feedback: string) => void;
  onUpdateFrequency: (freq: Frequency) => void;
  onUpdateProfile?: (profile: DogProfile) => void;
}

export const ExerciseCalendar: React.FC<CalendarProps> = ({ 
  user, plan, onToggleComplete, onUpdateFeedback, onUpdateFrequency, onUpdateProfile 
}) => {
  const [selectedExercise, setSelectedExercise] = useState<{dayIdx: number, exercise: Exercise} | null>(null);
  const [weekOffset, setWeekOffset] = useState(0); 

  const getWeekPlan = () => {
    const startIdx = 14 + (weekOffset * 7);
    return plan.slice(startIdx, startIdx + 7);
  };

  const weekPlan = getWeekPlan();

  const handleToggleDayPreference = (dayIdx: number) => {
    if (!user?.profile || !onUpdateProfile) return;
    const current = user.profile.preferredDaysNextWeek || [];
    const next = current.includes(dayIdx) 
      ? current.filter(d => d !== dayIdx) 
      : [...current, dayIdx];
    
    onUpdateProfile({ ...user.profile, preferredDaysNextWeek: next });
  };

  const downloadICS = () => {
    if (!user || !plan) return;
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Eventos GUAU//Training Calendar//ES\n";
    
    plan.forEach(day => {
      day.exercises.forEach(ex => {
        const dateStr = day.date.replace(/-/g, '');
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `SUMMARY:GUAU: ${ex.title}\n`;
        icsContent += `DESCRIPTION:${ex.description.replace(/\n/g, '\\n')} (Duración: ${ex.duration})\n`;
        icsContent += `DTSTART;VALUE=DATE:${dateStr}\n`;
        icsContent += `DTEND;VALUE=DATE:${dateStr}\n`;
        icsContent += "END:VEVENT\n";
      });
    });
    
    icsContent += "END:VCALENDAR";
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `entrenamiento_${user.dogName}.ics`;
    link.click();
    alert("Calendario descargado. Puedes importarlo en Google Calendar, Outlook o iCal para recibir notificaciones.");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {user?.profile?.adminComments && (
        <div className="bg-guauYellow p-10 rounded-[3rem] shadow-xl border-4 border-guauDark/5 animate-in slide-in-from-top duration-700">
           <div className="flex items-center gap-4 mb-3">
              <span className="text-3xl">💡</span>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-guauDark opacity-60">Instrucciones Técnicas del Entrenador:</h4>
           </div>
           <p className="text-lg font-black text-guauDark leading-tight italic ml-12">"{user.profile.adminComments}"</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end print-hidden gap-6 px-4 md:px-0">
        <div>
          <h3 className="text-4xl font-black text-guauDark uppercase tracking-tighter leading-none mb-2">Mi Entrenamiento</h3>
          <div className="flex gap-2">
            <button onClick={() => setWeekOffset(weekOffset - 1)} className="px-4 py-2 bg-white border rounded-xl hover:bg-gray-50 transition text-[10px] font-black uppercase">← Ant.</button>
            <div className="px-6 py-2 bg-guauDark text-guauYellow rounded-xl text-[10px] font-black uppercase flex items-center shadow-lg">
              {weekOffset === 0 ? 'Semana Actual' : weekOffset < 0 ? `Hace ${Math.abs(weekOffset)} sem.` : `En ${weekOffset} sem.`}
            </div>
            <button onClick={() => setWeekOffset(weekOffset + 1)} className="px-4 py-2 bg-white border rounded-xl hover:bg-gray-50 transition text-[10px] font-black uppercase">Sig. →</button>
          </div>
        </div>

        <div className="flex gap-4">
           <button 
            onClick={downloadICS}
            className="bg-white text-guauDark border-2 border-guauDark px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase shadow-sm hover:bg-guauDark hover:text-white transition flex items-center gap-2"
           >
            📅 Sincronizar Calendario
           </button>
           <button 
            onClick={() => window.print()}
            className="bg-guauYellow text-guauDark px-10 py-4 rounded-[1.5rem] text-xs font-black uppercase shadow-xl hover:scale-105 transition"
          >
            🖨️ Exportar PDF
          </button>
        </div>
      </div>

      <div className="bg-guauDark p-8 rounded-[3rem] text-white print-hidden shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-guauYellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <h4 className="text-[10px] font-black uppercase text-guauYellow tracking-[0.3em] mb-4 flex items-center gap-2">
           <span className="text-lg">⭐</span> Marca tus días de entrenamiento preferidos para que el entrenador los vea
        </h4>
        <div className="flex flex-wrap gap-2">
           {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, idx) => {
             const isSelected = user?.profile?.preferredDaysNextWeek?.includes(idx);
             return (
               <button 
                key={day}
                onClick={() => handleToggleDayPreference(idx)}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase transition-all duration-300 ${isSelected ? 'bg-guauYellow text-guauDark scale-110 shadow-lg' : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'}`}
               >
                 {day} {isSelected && '✨'}
               </button>
             );
           })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekPlan.map((day, dIdx) => (
          <div key={day.date} className={`day-box rounded-[3rem] border-2 transition-all duration-500 flex flex-col min-h-[260px] ${day.exercises.length === 0 ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-guauYellow/10 shadow-xl scale-[1.01]'}`}>
            <div className="p-6 border-b border-gray-50 text-center">
               <div className="text-[10px] font-black uppercase text-gray-300 mb-1">Día {dIdx + 1}</div>
               <div className="text-xs font-black text-guauDark uppercase tracking-tighter">
                  {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
               </div>
            </div>
            <div className="p-4 space-y-3 flex-1 flex flex-col">
              {day.exercises.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-30 italic text-center px-4">
                  <div className="text-2xl transform rotate-12">🦴</div>
                  <div className="text-[9px] font-black uppercase tracking-tighter">Día de descanso</div>
                </div>
              ) : (
                day.exercises.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise({ dayIdx: 14 + (weekOffset * 7) + dIdx, exercise: ex })}
                    className={`w-full text-left p-4 rounded-[2rem] transition-all border-2 group ${ex.completed ? 'bg-green-50 border-green-100' : 'bg-white border-gray-50 shadow-sm hover:border-guauYellow hover:scale-105'}`}
                  >
                    <div className={`text-[11px] font-black uppercase leading-tight ${ex.completed ? 'text-green-700 opacity-50' : 'text-guauDark'}`}>{ex.title}</div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">⏱️ {ex.duration}</span>
                      {ex.completed && <span className="text-[10px]">✅</span>}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedExercise && (
        <div className="fixed inset-0 bg-guauDark/95 backdrop-blur-md flex items-center justify-center p-6 z-[200]">
          <div className="bg-white rounded-[4rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-12 relative animate-in zoom-in duration-300">
            <button onClick={() => setSelectedExercise(null)} className="absolute top-10 right-10 text-3xl text-gray-200 hover:text-guauDark transition">✕</button>
            <div className="space-y-8">
               <div className="space-y-4">
                  <span className="bg-guauYellow text-guauDark text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest">{selectedExercise.exercise.category}</span>
                  <h4 className="text-4xl font-black uppercase tracking-tighter leading-none">{selectedExercise.exercise.title}</h4>
               </div>
               <div className="aspect-video bg-gray-100 rounded-[3rem] overflow-hidden border-8 border-gray-50 shadow-inner">
                  {selectedExercise.exercise.videoUrl ? (
                    <iframe width="100%" height="100%" src={selectedExercise.exercise.videoUrl.replace('watch?v=', 'embed/')} frameBorder="0" allowFullScreen></iframe>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-300 font-black uppercase tracking-widest italic">Video no disponible</div>
                  )}
               </div>
               <div className="space-y-4">
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-guauYellow">Instrucciones Personalizadas</h5>
                 <p className="text-gray-500 font-medium leading-relaxed">{selectedExercise.exercise.description}</p>
               </div>
               <div className="bg-gray-50 p-10 rounded-[4rem] border border-gray-100 space-y-6">
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Dudas y Feedback</h5>
                    <textarea 
                      className="w-full p-6 border-2 rounded-[2rem] bg-white text-sm outline-none h-32 focus:border-guauYellow transition-all"
                      placeholder="Escribe aquí tus dudas para el entrenador..."
                      defaultValue={selectedExercise.exercise.feedback || ''}
                      onBlur={(e) => onUpdateFeedback(selectedExercise.dayIdx, selectedExercise.exercise.id, e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => { onToggleComplete(selectedExercise.dayIdx, selectedExercise.exercise.id); setSelectedExercise(null); }}
                    className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase shadow-2xl transition-all ${selectedExercise.exercise.completed ? 'bg-gray-100 text-gray-400' : 'bg-guauDark text-white hover:bg-black hover:scale-[1.02]'}`}
                  >
                    {selectedExercise.exercise.completed ? 'Marcar como pendiente' : '¡Ejercicio Realizado! ✅'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
