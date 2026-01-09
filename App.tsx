
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, UserCircle, Coins, Bell, Search, LogOut, X, MessageCircle, Menu, CalendarClock, Sun, Moon, ExternalLink
} from 'lucide-react';
import { AppScreen, User, BarterMatch, TerminationType } from './types';
import { INITIAL_USER, MOCK_USERS } from './constants';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import CreditsPanel from './components/CreditsPanel';
import LiveSession from './components/LiveSession';
import Login from './components/Login';
import Registration from './components/Registration';
import ModeSelection from './components/ModeSelection';
import SkillSelection from './components/SkillSelection';
import PartnerSelection from './components/PartnerSelection';
import Scheduling from './components/Scheduling';
import SupportAssistant from './components/SupportAssistant';
import RatingScreen from './components/RatingScreen';
import MySessions from './components/MySessions';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<BarterMatch | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  
  // Persistence for Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('skillbarter-theme');
    return saved ? saved === 'dark' : true;
  });

  // Sync theme with HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('skillbarter-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('skillbarter-theme', 'light');
    }
  }, [darkMode]);

  const handleLogin = (userData: User, isNewUser: boolean) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (isNewUser) {
      setCurrentScreen(AppScreen.REGISTRATION);
    } else {
      setCurrentScreen(AppScreen.MODE_SELECT);
    }
  };

  const handleRegistrationComplete = (updatedUser: User) => {
    setUser(updatedUser);
    setCurrentScreen(AppScreen.MODE_SELECT);
  };

  const navigate = (screen: AppScreen) => {
    setCurrentScreen(screen);
    setIsSidebarOpen(false);
  };

  const handleModeSelect = (mode: 'learn' | 'teach') => {
    setExchangeMode(mode);
    setCurrentScreen(AppScreen.SKILL_SELECT);
  };

  const handleSkillSelect = (skill: string) => {
    setSelectedSkill(skill);
    setCurrentScreen(AppScreen.PARTNER_SELECT);
  };

  const handlePartnerSelect = (partner: User) => {
    setSelectedPartner(partner);
    setCurrentScreen(AppScreen.SCHEDULING);
  };

  const handleBlockUser = (targetUserId: string, reason: string) => {
    setUser(prev => ({
      ...prev,
      blockedUserIds: [...prev.blockedUserIds, targetUserId]
    }));
    // Note: In a real app, this would trigger an API call to reduce the other user's rating.
    alert(`User has been reported and blocked. 
Reason provided: ${reason}
The user's recommendation score will be decreased and they are now removed from your feed.`);
  };

  const finalizeRequest = (time: string) => {
    // Generate a random Google Meet Link for the session
    const meetId = Math.random().toString(36).substring(2, 5) + "-" + 
                  Math.random().toString(36).substring(2, 6) + "-" + 
                  Math.random().toString(36).substring(2, 5);
    const meetLink = `https://meet.google.com/${meetId}`;
    
    alert(`Your request has been sent to ${selectedPartner?.name}. 
Once they accept, your Google Meet link is ready: ${meetLink}`);
    
    // In a real flow, we'd store this in a database
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const handleRatingFinish = (rating: number, feedback: string) => {
    // Increment completed sessions on rating finish
    setUser(prev => ({
      ...prev,
      sessionsCompleted: prev.sessionsCompleted + 1
    }));
    setCurrentScreen(AppScreen.DASHBOARD);
    setActiveSession(null);
  };

  const handleSessionEnd = (terminationType: TerminationType) => {
    let creditDelta = 0;
    const userIsLearner = exchangeMode === 'learn';

    if (terminationType === 'normal') {
      creditDelta = userIsLearner ? -1 : 1;
      setCurrentScreen(AppScreen.RATING);
    } else if (terminationType === 'teacher_fault') {
      creditDelta = userIsLearner ? 3 : -3;
      alert(userIsLearner ? "The teacher has left the session. 3 credits have been added to your account as compensation." : "The session was terminated due to your inactivity. 3 credits have been deducted.");
      setCurrentScreen(AppScreen.DASHBOARD);
      setActiveSession(null);
    } else if (terminationType === 'learner_fault') {
      creditDelta = userIsLearner ? -3 : 3;
      alert(userIsLearner ? "The session was terminated due to your lack of focus. 3 credits have been deducted." : "The learner was inactive. 3 credits have been added to your account for your time.");
      setCurrentScreen(AppScreen.DASHBOARD);
      setActiveSession(null);
    }

    setUser(prev => ({
      ...prev,
      credits: Math.max(0, prev.credits + creditDelta)
    }));
  };

  // Matching Flow State
  const [exchangeMode, setExchangeMode] = useState<'learn' | 'teach' | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<User | null>(null);

  if (!isAuthenticated) return (
    <Login 
      onLogin={handleLogin} 
      darkMode={darkMode} 
      onToggleTheme={() => setDarkMode(!darkMode)} 
    />
  );

  if (currentScreen === AppScreen.REGISTRATION) return (
    <Registration user={user} onComplete={handleRegistrationComplete} />
  );

  return (
    <div className="h-screen font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex h-full overflow-hidden">
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
         flex flex-col shadow-2xl lg:shadow-none`}>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">SB</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">SkillBarter</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            <button onClick={() => navigate(AppScreen.MODE_SELECT)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${currentScreen === AppScreen.MODE_SELECT || currentScreen === AppScreen.SKILL_SELECT || currentScreen === AppScreen.PARTNER_SELECT || currentScreen === AppScreen.SCHEDULING ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              <Search size={20} />
              <span className="font-semibold">Find Exchange</span>
            </button>
            <button onClick={() => navigate(AppScreen.DASHBOARD)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${currentScreen === AppScreen.DASHBOARD ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              <LayoutDashboard size={20} />
              <span className="font-semibold">Dashboard</span>
            </button>
            <button onClick={() => navigate(AppScreen.MY_SESSIONS)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${currentScreen === AppScreen.MY_SESSIONS ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              <CalendarClock size={20} />
              <span className="font-semibold">My Sessions</span>
            </button>
            <button onClick={() => navigate(AppScreen.CREDITS)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${currentScreen === AppScreen.CREDITS ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              <Coins size={20} />
              <span className="font-semibold">Wallet</span>
            </button>
            <button onClick={() => navigate(AppScreen.PROFILE)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${currentScreen === AppScreen.PROFILE ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              <UserCircle size={20} />
              <span className="font-semibold">My Profile</span>
            </button>
          </nav>

          <div className="p-4 mt-auto border-t dark:border-slate-800">
            <button onClick={() => { setIsAuthenticated(false); setCurrentScreen(AppScreen.LOGIN); }} className="w-full flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-rose-500 transition-colors">
              <LogOut size={18} />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 overflow-hidden">
          <header className="z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 px-4 lg:px-8 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-base lg:text-xl font-bold text-slate-800 dark:text-slate-100 truncate tracking-tight">
                {currentScreen === AppScreen.MODE_SELECT || currentScreen === AppScreen.DASHBOARD ? (
                  <>Welcome, <span className="text-indigo-600 dark:text-indigo-400">{user.name || 'Friend'}</span>!</>
                ) : 
                 currentScreen === AppScreen.MY_SESSIONS ? 'My Sessions' :
                 currentScreen === AppScreen.PROFILE ? 'Profile' :
                 currentScreen === AppScreen.CREDITS ? 'Wallet' : 
                 currentScreen === AppScreen.RATING ? 'Session Review' : 'SkillBarter'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
               <button 
                 onClick={() => setDarkMode(!darkMode)}
                 className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
               >
                 {darkMode ? <Sun size={20} /> : <Moon size={20} />}
               </button>
               <div className="flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                  <Coins size={14} className="text-amber-500" />
                  <span className="text-xs lg:text-sm font-bold text-indigo-700 dark:text-indigo-300 whitespace-nowrap">{user.credits} Credits</span>
               </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto h-full">
              {currentScreen === AppScreen.MODE_SELECT && <ModeSelection onSelect={handleModeSelect} />}
              {currentScreen === AppScreen.SKILL_SELECT && (
                <SkillSelection 
                  mode={exchangeMode!} 
                  skills={exchangeMode === 'learn' ? user.skillsToLearn : user.skillsToTeach} 
                  onSelect={handleSkillSelect} 
                  onBack={() => setCurrentScreen(AppScreen.MODE_SELECT)}
                />
              )}
              {currentScreen === AppScreen.PARTNER_SELECT && (
                <PartnerSelection 
                  user={user} 
                  mode={exchangeMode!} 
                  skill={selectedSkill!} 
                  onSelect={handlePartnerSelect} 
                  onBack={() => setCurrentScreen(AppScreen.SKILL_SELECT)}
                  onBlock={handleBlockUser}
                />
              )}
              {currentScreen === AppScreen.SCHEDULING && (
                <Scheduling 
                  partner={selectedPartner!} 
                  onFinalize={finalizeRequest} 
                  onBack={() => setCurrentScreen(AppScreen.PARTNER_SELECT)} 
                />
              )}
              {currentScreen === AppScreen.DASHBOARD && <Dashboard user={user} onStartSession={(m) => {setActiveSession(m); setCurrentScreen(AppScreen.SESSION);}} />}
              {currentScreen === AppScreen.MY_SESSIONS && <MySessions user={user} onStartSession={(m) => {setActiveSession(m); setCurrentScreen(AppScreen.SESSION);}} />}
              {currentScreen === AppScreen.CREDITS && <CreditsPanel user={user} />}
              {currentScreen === AppScreen.PROFILE && <Profile user={user} onUpdateUser={setUser} />}
              {currentScreen === AppScreen.SESSION && activeSession && (
                <LiveSession 
                  match={activeSession} 
                  onEnd={handleSessionEnd} 
                />
              )}
              {currentScreen === AppScreen.RATING && activeSession && (
                <RatingScreen 
                  match={activeSession} 
                  onFinish={handleRatingFinish} 
                />
              )}
            </div>
          </div>
        </main>

        <div className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-50">
          {isSupportOpen ? (
            <SupportAssistant userContext={user} onClose={() => setIsSupportOpen(false)} />
          ) : (
            <button 
              onClick={() => setIsSupportOpen(true)}
              className="w-12 h-12 lg:w-14 lg:h-14 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95 ring-4 ring-indigo-600/20"
            >
              <MessageCircle size={24} className="lg:size-[28px]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
