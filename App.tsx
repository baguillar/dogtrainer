
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ExerciseCalendar } from './components/ExerciseCalendar';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfile } from './components/UserProfile';
import { LiveSessions } from './components/LiveSessions';
import { Onboarding } from './components/Onboarding';
import { PaymentFlow } from './components/PaymentFlow';
import { UserData, UserState, DogProfile, Frequency } from './types';

// En hosting, la API suele estar en la misma carpeta o subcarpeta
const API_URL = '/api';

const App: React.FC = () => {
  const [state, setState] = useState<UserState>({
    currentUser: null,
    onboardingStep: 'login',
    activeView: 'dashboard'
  });

  const [authForm, setAuthForm] = useState({ email: '', pass: '', isSignUp: false, showForgot: false });

  const persistUser = async (userData: UserData) => {
    try {
      const response = await fetch(`${API_URL}/users.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', user: userData })
      });
      if (!response.ok) throw new Error("Error en servidor");
      setState(prev => ({ ...prev, currentUser: userData }));
    } catch (error) {
      console.error("Persistencia fallida:", error);
      localStorage.setItem('guau_user_fallback', JSON.stringify(userData));
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/users.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: authForm.email, pass: authForm.pass })
      });
      
      if (!response.ok) throw new Error("Acceso denegado");
      const user: UserData = await response.json();

      if (authForm.isSignUp) {
        // Lógica simplificada de registro para el ejemplo
        const newUser: UserData = { 
          email: authForm.email, role: 'user', subscription: 'none', status: 'pending_payment' 
        };
        await persistUser(newUser);
        setState({ ...state, currentUser: newUser, onboardingStep: 'payment' });
      } else {
        setState({ 
          ...state, currentUser: user, 
          onboardingStep: user.status === 'pending_payment' ? 'payment' : user.status === 'pending_form' ? 'form' : 'active',
          activeView: user.role === 'admin' ? 'admin' : 'dashboard'
        });
      }
    } catch (error) {
      alert("Error: Revisa tus credenciales o la conexión a la base de datos.");
    }
  };

  const handleOnboardingComplete = async (profile: DogProfile, frequency: Frequency) => {
    if (!state.currentUser) return;
    const updated: UserData = { 
      ...state.currentUser, profile, frequency, dogName: profile.dogName, status: 'active',
      plan: state.currentUser.plan || Array.from({length: 28}, (_, i) => ({ 
        date: new Date(Date.now() - (14 * 86400000) + i * 86400000).toISOString().split('T')[0], 
        exercises: [], isRestDay: true 
      }))
    };
    await persistUser(updated);
    setState({ ...state, currentUser: updated, onboardingStep: 'active', activeView: 'dashboard' });
  };

  if (!state.currentUser || state.onboardingStep === 'payment' || state.onboardingStep === 'form') {
    if (state.onboardingStep === 'payment') return <PaymentFlow onSuccess={async (l) => {
      const updated = {...state.currentUser!, subscription: l, status: 'pending_form' as const};
      await persistUser(updated);
      setState({...state, currentUser: updated, onboardingStep: 'form'});
    }} onCancel={() => setState({...state, currentUser: null})} />;
    
    if (state.onboardingStep === 'form') return <Onboarding onComplete={handleOnboardingComplete} />;
    
    return (
      <div className="fixed inset-0 bg-guauDark flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[4rem] shadow-2xl w-full max-w-md space-y-8 animate-in zoom-in duration-300">
          <div className="text-center">
            <img src="https://eventosguau.es/wp-content/uploads/2024/08/Eventos-Guau-CON-BORDE-pequeno.png" className="w-24 mx-auto mb-6" alt="Logo" />
            <h2 className="text-2xl font-black uppercase tracking-tighter">Acceso Clientes</h2>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input type="email" required placeholder="Email" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
            <input type="password" required placeholder="Contraseña" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" value={authForm.pass} onChange={e => setAuthForm({...authForm, pass: e.target.value})} />
            <button type="submit" className="w-full bg-guauYellow text-guauDark py-4 rounded-2xl font-black uppercase shadow-lg">Entrar / Registrarse</button>
            <div className="text-center text-[9px] font-black uppercase text-gray-300">Usa admin@eventosguau.es / admin123 para el panel</div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      isPremium={state.currentUser.subscription === 'premium'} 
      activeView={state.currentUser.role === 'admin' ? 'Panel Maestro' : state.activeView}
      onViewChange={(v) => setState({...state, activeView: v as any})}
      onLogout={() => setState({...state, currentUser: null, onboardingStep: 'login'})}
    >
      {state.currentUser.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <div className="space-y-12 pb-20">
          {state.activeView === 'dashboard' && (
            <ExerciseCalendar 
              user={state.currentUser}
              plan={state.currentUser.plan || []} 
              onToggleComplete={async (d, e) => {
                const newPlan = [...state.currentUser!.plan!];
                const ex = newPlan[d].exercises.find(ex => ex.id === e);
                if (ex) ex.completed = !ex.completed;
                await persistUser({...state.currentUser!, plan: newPlan});
              }} 
              onUpdateFeedback={async (d, e, f) => {
                const newPlan = [...state.currentUser!.plan!];
                const ex = newPlan[d].exercises.find(ex => ex.id === e);
                if (ex) ex.feedback = f;
                await persistUser({...state.currentUser!, plan: newPlan});
              }}
              onUpdateFrequency={async (f) => await persistUser({...state.currentUser!, frequency: f})}
              onUpdateProfile={async (p) => await persistUser({...state.currentUser!, profile: p})}
            />
          )}
          {state.activeView === 'profile' && <UserProfile user={state.currentUser} onUpdate={handleOnboardingComplete} onSubscriptionChange={async (l) => await persistUser({...state.currentUser!, subscription: l})} />}
        </div>
      )}
    </Layout>
  );
};

export default App;