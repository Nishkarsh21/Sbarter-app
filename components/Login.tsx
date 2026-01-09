
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { INITIAL_USER } from '../constants';
import { 
  Chrome, ShieldCheck, UserPlus, LogIn, X, Scale, 
  FileText, ShieldAlert, Eye, Mail, Lock, ArrowLeft, 
  Sun, Moon, ExternalLink, Minus, Square, AlertCircle,
  KeyRound, CheckCircle2
} from 'lucide-react';

interface LoginProps {
  onLogin: (user: User, isNewUser: boolean) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, darkMode, onToggleTheme }) => {
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleMock, setShowGoogleMock] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showManualSignup, setShowManualSignup] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Manual form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Strict Email Validation Logic - Requires @ and a valid domain suffix
  const isEmailValid = useMemo(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }, [email]);

  const handleGoogleAuth = () => {
    if (!agreed) return;
    setShowGoogleMock(true);
  };

  const confirmGoogleAuth = () => {
    setIsLoading(true);
    setShowGoogleMock(false);
    setTimeout(() => {
      // Mocked Google User
      onLogin({ ...INITIAL_USER, name: '' }, true);
      setIsLoading(false);
    }, 1200);
  };

  const startVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !isEmailValid || !password) return;
    
    setIsLoading(true);
    setAuthError(null);
    
    // Simulate checking if email exists/sending code
    setTimeout(() => {
      setVerificationStep(true);
      setIsLoading(false);
    }, 1200);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode !== '1234') {
      setAuthError("Incorrect code. Please use 1234 for this demo.");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const newUser: User = {
        ...INITIAL_USER,
        email: email,
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name: '', // Will be updated in registration step
        credits: 5,
        rating: 5.0
      };
      onLogin(newUser, true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4 lg:p-10 font-sans transition-colors duration-300">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[2rem] lg:rounded-[3.5rem] shadow-[0_20px_70px_-15px_rgba(0,0,0,0.1)] dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row relative">
        
        <button 
          onClick={onToggleTheme}
          className="absolute top-6 right-6 z-20 p-3 bg-slate-50 dark:bg-slate-800 backdrop-blur-md rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-md"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="bg-indigo-600 p-8 lg:p-16 text-white hidden md:flex flex-col justify-between relative overflow-hidden flex-1">
          <div className="absolute top-0 right-0 p-20 opacity-10">
             <div className="w-64 h-64 border-[32px] border-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-black mb-8 tracking-tighter">SkillBarter</h1>
            <p className="text-indigo-100 text-lg lg:text-xl leading-relaxed font-medium">
              Knowledge is our currency. Connect with verified experts worldwide.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <ShieldCheck className="text-indigo-300 shrink-0" size={24} />
                <span className="text-sm font-bold">Identity Verified Networking</span>
             </div>
             <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
                <span className="text-sm font-bold">Secure OTP-based Enrollment</span>
             </div>
          </div>
        </div>

        <div className="p-8 lg:p-16 flex flex-col justify-center flex-1 min-h-[500px]">
          {showManualSignup ? (
            <div className="animate-slideIn">
              <button 
                onClick={() => { setShowManualSignup(false); setVerificationStep(false); setAuthError(null); }}
                className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors"
              >
                <ArrowLeft size={16} /> Back to login options
              </button>

              <div className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                  {verificationStep ? 'Email Verification' : 'Create Account'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                  {verificationStep ? `We've sent a 4-digit code to ${email}` : 'Please provide your real educational email.'}
                </p>
              </div>

              {!verificationStep ? (
                <form onSubmit={startVerification} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Official Email</label>
                    <div className="relative">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${email && !isEmailValid ? 'text-rose-500' : 'text-slate-400'}`} size={18} />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className={`w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl outline-none transition-all font-bold text-slate-800 dark:text-white ${email && !isEmailValid ? 'border-rose-100 dark:border-rose-900/30 focus:border-rose-500' : 'border-slate-100 dark:border-slate-700 focus:border-indigo-600'}`}
                      />
                    </div>
                    {email && !isEmailValid && (
                      <p className="text-[10px] text-rose-500 font-bold mt-1 flex items-center gap-1 ml-1">
                        <AlertCircle size={10} /> Enter a valid email format (example@mail.com)
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading || !isEmailValid || !password || !agreed}
                    className="w-full py-4 lg:py-5 bg-indigo-600 text-white font-black rounded-2xl lg:rounded-[2rem] shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
                    <span>Verify Email Identity</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">One-Time Password (OTP)</label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        required
                        maxLength={4}
                        value={verificationCode}
                        onChange={(e) => {
                          setVerificationCode(e.target.value.replace(/\D/g, ''));
                          setAuthError(null);
                        }}
                        placeholder="0 0 0 0"
                        className={`w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl outline-none transition-all font-bold text-center text-2xl tracking-[0.5em] text-slate-800 dark:text-white ${authError ? 'border-rose-500' : 'border-slate-100 dark:border-slate-700 focus:border-indigo-600'}`}
                      />
                    </div>
                    {authError && (
                      <p className="text-[10px] text-rose-500 font-bold mt-2 text-center flex items-center justify-center gap-1">
                        <AlertCircle size={10} /> {authError}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 font-bold mt-4 text-center">
                      Testing environment: Code is <span className="text-indigo-600">1234</span>
                    </p>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading || verificationCode.length < 4}
                    className="w-full py-4 lg:py-5 bg-emerald-600 text-white font-black rounded-2xl lg:rounded-[2rem] shadow-xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                    <span>Authenticate Account</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setVerificationStep(false)}
                    className="w-full text-center text-xs font-bold text-slate-400 hover:text-indigo-600 py-2 transition-colors"
                  >
                    Resend Code or Edit Email
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="animate-fadeIn">
              <div className="mb-8">
                <h2 className="text-2xl lg:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight tracking-tighter">SkillBarter</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-base">Login to access your skill exchanges.</p>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <div className="p-4 lg:p-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl lg:rounded-[2rem] hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={agreed} 
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-5 h-5 lg:w-6 lg:h-6 rounded-lg text-indigo-600 focus:ring-indigo-500 shrink-0 border-2 border-slate-300" 
                    />
                    <span className="text-[11px] lg:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      I agree to the <button onClick={() => setShowTerms(true)} className="font-bold text-indigo-600 underline hover:text-indigo-800 transition-colors">Terms & Privacy Policy</button>. I verify that my skill entries are accurate.
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={handleGoogleAuth}
                    disabled={!agreed || isLoading}
                    className={`w-full flex items-center justify-center gap-3 lg:gap-4 py-4 lg:py-5 rounded-2xl lg:rounded-[2rem] font-black transition-all shadow-xl text-base lg:text-lg ${agreed ? 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 grayscale cursor-not-allowed'}`}
                  >
                    <Chrome size={20} className="text-rose-500" />
                    <span>Continue with Google</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowManualSignup(true)}
                    disabled={!agreed || isLoading}
                    className="w-full flex items-center justify-center gap-3 lg:gap-4 py-4 lg:py-5 rounded-2xl lg:rounded-[2rem] font-black bg-slate-900 dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-700 transition-all active:scale-95 shadow-xl disabled:opacity-50 disabled:grayscale"
                  >
                    <UserPlus size={20} />
                    <span>Create Manual Account</span>
                  </button>
                </div>

                <div className="relative py-2 lg:py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-slate-100 dark:border-slate-800"></div></div>
                  <div className="relative flex justify-center text-[9px] lg:text-[10px] uppercase text-slate-400 font-black bg-white dark:bg-slate-900 px-4 tracking-[0.2em]">Security Protocol</div>
                </div>

                <p className="text-center text-[10px] lg:text-xs text-slate-400 font-medium px-4 leading-relaxed">
                  To ensure quality, all users must use a real email address and pass authentication.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terms of Use Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] lg:rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-scaleIn border border-white/20">
            <div className="p-6 lg:p-8 border-b dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-800/50">
              <h4 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Terms of Use</h4>
              <button onClick={() => setShowTerms(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6">
              <div className="space-y-2">
                <h5 className="font-black text-slate-800 dark:text-slate-200">1. Verification</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Users are required to provide a functional, real email address for account creation. Failure to verify email leads to restricted access.
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-black text-slate-800 dark:text-slate-200">2. Skill Honesty</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  You certify that you possess the skills you offer to teach. Misrepresentation results in credit forfeiture.
                </p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex justify-end shrink-0">
              <button onClick={() => setShowTerms(false)} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl active:scale-95 shadow-lg">I Agree</button>
            </div>
          </div>
        </div>
      )}

      {/* Improved Google Mock Popup Simulation */}
      {showGoogleMock && (
        <div className="fixed inset-0 z-[300] bg-slate-950/40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden animate-scaleIn border border-white/20 mx-auto">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 flex items-center justify-between border-b dark:border-slate-700">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                 <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                 <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
               </div>
               <div className="flex items-center gap-2 text-slate-400">
                  <X size={14} className="cursor-pointer hover:text-rose-500" onClick={() => setShowGoogleMock(false)} />
               </div>
            </div>
            <div className="p-8 text-center">
              <Chrome size={32} className="text-rose-500 mx-auto mb-4" />
              <h4 className="text-xl font-black text-slate-900 dark:text-white">Sign in with Google</h4>
              <p className="text-xs text-slate-400 mt-1">to continue to SkillBarter</p>
            </div>
            <div className="px-8 pb-10">
              <button onClick={confirmGoogleAuth} className="w-full flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-600 transition-all text-left group">
                <img src={INITIAL_USER.avatar} className="w-10 h-10 rounded-2xl mr-4" />
                <div className="flex-1">
                  <p className="font-black text-sm text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{INITIAL_USER.name}</p>
                  <p className="text-[10px] text-slate-500">{INITIAL_USER.email}</p>
                </div>
                <LogIn className="text-slate-300" size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Loader2 = ({ className }: { className: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

export default Login;
