
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Author, 
  Guide, 
  RegistrationData, 
  AppState, 
  ApplicationStatus,
  DesignationType,
  Database
} from './types';
import { AuthorForm } from './components/AuthorForm';
import { PremiumInput } from './components/PremiumInput';
import { Dashboard } from './components/Dashboard';
import { STEPS } from './constants';
import { 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  Sparkles, 
  AlertCircle, 
  Users, 
  LogIn, 
  UserPlus, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Phone,
  Sun,
  Moon
} from 'lucide-react';
import { analyzeSubmission } from './services/geminiService';

const INITIAL_AUTHOR: Author = {
  name: '', regNo: '', contactNo: '', email: '', dept: '', degree: '', specialization: '', year: '', college: ''
};

const INITIAL_GUIDE: Guide = {
  name: '', designation: '', designationType: 'Assistant Professor', dept: '', contactNo: '', email: '', guidedAuthor: '1'
};

const DB_KEY = 'academia_sync_db';

const ThemeToggle = ({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) => (
  <button 
    onClick={onToggle}
    className="fixed top-4 left-4 z-50 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl hover:scale-110 active:scale-95 transition-all text-purple-600 dark:text-purple-400"
    aria-label="Toggle Theme"
  >
    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
);

const App: React.FC = () => {
  const [view, setView] = useState<'REGISTER' | 'LOGIN' | 'DASHBOARD' | 'SUCCESS'>('LOGIN');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  // Form State
  const [formData, setFormData] = useState<Partial<RegistrationData>>({
    author1: { ...INITIAL_AUTHOR },
    author2: { ...INITIAL_AUTHOR, isSameAsAuthor1: false },
    guide: { ...INITIAL_GUIDE },
    acceptedTerms: false
  });

  const [hasAuthor2, setHasAuthor2] = useState(false);
  const [isGuideEnabled, setIsGuideEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Theme effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Sync active registration state to "Database"
  useEffect(() => {
    if (appState?.registration?.mainEmail) {
      const db: Database = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
      db[appState.registration.mainEmail.toLowerCase()] = appState;
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    }
  }, [appState]);

  const handleLogin = () => {
    const db: Database = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    const userState = db[loginEmail.toLowerCase()];
    if (userState) {
      setAppState(userState);
      setView('DASHBOARD');
      setLoginError('');
    } else {
      setLoginError('No registration found with this email. Please register first.');
    }
  };

  const updateAuthor1 = (update: Partial<Author>) => {
    setFormData(prev => ({ ...prev, author1: { ...prev.author1!, ...update } }));
  };

  const updateAuthor2 = (update: Partial<Author & { isSameAsAuthor1: boolean }>) => {
    setFormData(prev => ({ ...prev, author2: { ...prev.author2!, ...update } }));
  };

  const updateGuide = (update: Partial<Guide>) => {
    setFormData(prev => ({ ...prev, guide: { ...prev.guide!, ...update } }));
  };

  const handleNext = () => {
    if (currentStep === 3) {
      handleSubmit();
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const mainEmail = (formData.mainEmail || formData.author1?.email || '').toLowerCase();
    
    const newState: AppState = {
      registration: { ...formData, mainEmail } as RegistrationData,
      status: ApplicationStatus.PENDING_REVIEW
    };

    const db: Database = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    db[mainEmail] = newState;
    localStorage.setItem(DB_KEY, JSON.stringify(db));

    await analyzeSubmission(formData.title || "", formData.domain || "");
    
    setTimeout(() => {
      setAppState(newState);
      setView('SUCCESS'); 
      setIsSubmitting(false);
    }, 1500);
  };

  const logout = () => {
    setAppState(null);
    setView('LOGIN');
    setLoginEmail('');
  };

  const toggleTheme = () => setIsDark(!isDark);

  if (view === 'DASHBOARD' && appState) {
    return (
      <div className="relative">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        <button 
          onClick={logout}
          className="absolute top-4 right-4 z-50 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center space-x-2 shadow-sm"
        >
          <LogIn className="w-3 h-3 rotate-180" />
          <span>Logout</span>
        </button>
        <Dashboard state={appState} onUpdate={(u) => setAppState(prev => prev ? ({ ...prev, ...u }) : null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col items-center py-12 px-4 selection:bg-purple-100 selection:text-purple-900 dark:selection:bg-purple-900 dark:selection:text-purple-100">
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      
      <div className="w-full max-w-4xl space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-4 mb-2">
            <img src="https://www.wisecrew.in/assets/img/logo.png" alt="Wisecrew Solutions" className="h-10 opacity-80 dark:invert dark:opacity-90" onError={(e) => e.currentTarget.style.display = 'none'} />
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
            <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight text-xs md:text-sm">IN ASSOCIATION WITH MSME</span>
          </div>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-tight shadow-xl shadow-purple-200 dark:shadow-purple-900/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>WS-NCGAI 2026 | National Level Paper Presentation</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Wisecrew Solutions <br/>
            <span className="text-purple-600 dark:text-purple-400">Paper Presentation Contest</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto text-sm md:text-base">
            {view === 'LOGIN' ? 'Access your abstract review and submission dashboard for the National Conference on Generative AI & Computer Science.' : 
             view === 'SUCCESS' ? 'Registration successfully submitted for WS-NCGAI 2026.' :
             "Don't just write your thoughts — present them to the world! Online Event: Jan 31 & Feb 01, 2026."}
          </p>
        </div>

        {view === 'SUCCESS' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto w-full glass rounded-[2.5rem] p-10 text-center shadow-2xl border border-white/50 dark:border-slate-700/50"
          >
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Registration Received!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-sm">
              Your abstract for <strong>"{appState?.registration?.title}"</strong> has been successfully submitted. 
              Review results will be released by <strong>20th January 2026</strong>. <br/><br/>
              Log in with <strong>{appState?.registration?.mainEmail}</strong> to track your progress.
            </p>
            <button 
              onClick={() => { setLoginEmail(appState?.registration?.mainEmail || ''); setView('LOGIN'); }}
              className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 dark:shadow-purple-900/20"
            >
              <span>Go to Login Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : view === 'LOGIN' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto w-full glass rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/50 dark:border-slate-700/50"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400">
                <LogIn className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome Back</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Access your WS-NCGAI 2026 registration</p>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                <input 
                  type="email"
                  placeholder="name@university.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-medium text-slate-700 dark:text-slate-100"
                />
              </div>

              {loginError && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-rose-500 text-xs font-bold text-center flex items-center justify-center space-x-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{loginError}</span>
                </motion.p>
              )}

              <button 
                onClick={handleLogin}
                className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-purple-700 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-200 dark:shadow-purple-900/20"
              >
                <span>Access Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-700"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400 dark:text-slate-500 font-bold tracking-widest">or</span></div>
              </div>

              <button 
                onClick={() => { setFormData({ author1: { ...INITIAL_AUTHOR }, author2: { ...INITIAL_AUTHOR, isSameAsAuthor1: false }, guide: { ...INITIAL_GUIDE }, acceptedTerms: false }); setCurrentStep(0); setView('REGISTER'); }}
                className="w-full py-4 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register for WS-NCGAI 2026</span>
              </button>

              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col items-center space-y-2 text-xs text-slate-400">
                <div className="flex items-center space-x-4">
                  <a href="https://www.wisecrew.in" target="_blank" className="hover:text-purple-600 dark:hover:text-purple-400 flex items-center space-x-1 transition-colors"><Globe className="w-3 h-3"/><span>wisecrew.in</span></a>
                  <a href="tel:7845342880" className="hover:text-purple-600 dark:hover:text-purple-400 flex items-center space-x-1 transition-colors"><Phone className="w-3 h-3"/><span>7845342880</span></a>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Stepper */}
            <div className="flex items-center justify-between px-2 max-w-2xl mx-auto w-full relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 -z-10" />
              {STEPS.map((step, idx) => (
                <div key={step.id} className="flex flex-col items-center space-y-2">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                    idx <= currentStep ? 'bg-purple-600 text-white shadow-purple-200 dark:shadow-purple-900/20' : 'bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-slate-700'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${idx <= currentStep ? 'text-purple-600 dark:text-purple-400' : 'text-slate-300 dark:text-slate-600'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Form Container */}
            <motion.div 
              layout
              className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none"
            >
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div 
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <AuthorForm 
                      title="Student Author 1" 
                      description="Primary contact for the paper presentation."
                      data={formData.author1!} 
                      onChange={updateAuthor1} 
                    />
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700">
                      <div className="pr-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Add Student Author 2? (Optional)</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">Team size is limited to 1 or 2 students.</p>
                      </div>
                      <button 
                        onClick={() => setHasAuthor2(!hasAuthor2)}
                        className={`px-4 md:px-6 py-2.5 rounded-2xl font-bold transition-all shrink-0 text-sm md:text-base ${
                          hasAuthor2 ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm'
                        }`}
                      >
                        {hasAuthor2 ? 'Author Added' : 'Add Co-Author'}
                      </button>
                    </div>

                    {hasAuthor2 && (
                      <div className="space-y-6 pt-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">All details same as Author 1?</label>
                          <select 
                            value={formData.author2?.isSameAsAuthor1 ? 'yes' : 'no'}
                            onChange={(e) => {
                              const isSame = e.target.value === 'yes';
                              if (isSame) {
                                setFormData(prev => ({
                                  ...prev,
                                  author2: { ...prev.author1!, isSameAsAuthor1: true }
                                }));
                              } else {
                                updateAuthor2({ isSameAsAuthor1: false });
                              }
                            }}
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-100 text-sm"
                          >
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </select>
                        </div>
                        {!formData.author2?.isSameAsAuthor1 && (
                           <AuthorForm 
                            title="Student Author 2" 
                            data={formData.author2!} 
                            onChange={updateAuthor2} 
                          />
                        )}
                      </div>
                    )}
                    {!hasAuthor2 && (
                      <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600 space-y-4">
                        <Users className="w-16 h-16 opacity-20" />
                        <p className="font-medium italic text-sm">Single student entry. Proceed to Faculty Guide.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700">
                      <div className="pr-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Faculty Guide (Optional)</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">Mention your department staff member if applicable.</p>
                      </div>
                      <button 
                        onClick={() => setIsGuideEnabled(!isGuideEnabled)}
                        className={`px-4 md:px-6 py-2.5 rounded-2xl font-bold transition-all shrink-0 text-sm md:text-base ${
                          isGuideEnabled ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm'
                        }`}
                      >
                        {isGuideEnabled ? 'Guide Added' : 'Add Guide'}
                      </button>
                    </div>

                    {isGuideEnabled && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <PremiumInput label="Guide Name" value={formData.guide!.name} onChange={v => updateGuide({name: v})} required />
                          <PremiumInput label="Designation" value={formData.guide!.designation} onChange={v => updateGuide({designation: v})} required />
                          <PremiumInput 
                            label="Designation Type" 
                            options={['Assistant Professor', 'Associate Professor', 'HOD', 'Vice Principal', 'Professor (S.G)', 'Professor', 'Others']} 
                            value={formData.guide!.designationType} 
                            onChange={v => updateGuide({designationType: v as DesignationType})} 
                            required 
                          />
                          <PremiumInput label="Department" value={formData.guide!.dept} onChange={v => updateGuide({dept: v})} required />
                          <PremiumInput label="Contact Number" value={formData.guide!.contactNo} onChange={v => updateGuide({contactNo: v})} required />
                          <PremiumInput label="Email" type="email" value={formData.guide!.email} onChange={v => updateGuide({email: v})} required />
                          <div className="md:col-span-2">
                            <PremiumInput 
                              label="Which Author is your Guide for?" 
                              options={['1', '2', '3']} 
                              value={formData.guide!.guidedAuthor} 
                              onChange={v => updateGuide({guidedAuthor: v})} 
                              required 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PremiumInput label="Communication E-mail" value={formData.mainEmail || ''} onChange={v => setFormData(p => ({...p, mainEmail: v}))} required />
                        <PremiumInput label="Communication Contact" value={formData.mainContact || ''} onChange={v => setFormData(p => ({...p, mainContact: v}))} required />
                        <PremiumInput 
                          label="Corresponding Author" 
                          options={['Author 1', hasAuthor2 ? 'Author 2' : '', isGuideEnabled ? 'Guide' : ''].filter(Boolean)} 
                          value={formData.correspondingAuthor || ''} 
                          onChange={v => setFormData(p => ({...p, correspondingAuthor: v}))} 
                          required 
                        />
                        <PremiumInput 
                          label="Research Domain" 
                          options={['Generative AI', 'AI/ML', 'Cyber Security', 'Quantum Computing', 'Virtual Reality / AR', 'Any Other Topics']}
                          value={formData.domain || ''} 
                          onChange={v => setFormData(p => ({...p, domain: v}))} 
                          required 
                        />
                        <div className="md:col-span-2">
                           <PremiumInput label="Paper Title" value={formData.title || ''} onChange={v => setFormData(p => ({...p, title: v}))} required placeholder="Full title of your research paper" />
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Abstract Upload</label>
                          <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-tight">Max 250 Words</span>
                        </div>
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 dark:file:bg-purple-900/20 file:text-purple-700 dark:file:text-purple-400 hover:file:bg-purple-100 dark:hover:file:bg-purple-900/30 transition-all cursor-pointer"
                        />
                      </div>

                      <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30 flex items-start space-x-4">
                        <AlertCircle className="w-6 h-6 text-amber-500 dark:text-amber-400 shrink-0 mt-1" />
                        <div className="space-y-4">
                          <p className="text-sm text-amber-900 dark:text-amber-100/80 leading-relaxed font-medium">
                            I hereby declare that once my abstract is accepted, I will pay the <b>Registration Fee of Rs. 150/-</b> before 20th Jan. 
                            I will submit the full paper and presentation before 25th Jan and attend the Online Event on 31 Jan and 01 Feb 2026.
                          </p>
                          <label className="flex items-center space-x-3 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 rounded-lg border-amber-300 dark:border-amber-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                              checked={formData.acceptedTerms}
                              onChange={(e) => setFormData(p => ({...p, acceptedTerms: e.target.checked}))}
                            />
                            <span className="text-sm font-bold text-amber-950 dark:text-amber-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">I Accept the Guidelines</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100 dark:border-slate-700">
                <button 
                  onClick={() => currentStep === 0 ? setView('LOGIN') : setCurrentStep(s => Math.max(0, s - 1))}
                  className="flex items-center space-x-2 px-4 md:px-6 py-3 rounded-2xl font-bold transition-all text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm md:text-base"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>{currentStep === 0 ? 'Back to Login' : 'Back'}</span>
                </button>

                <button 
                  onClick={handleNext}
                  disabled={isSubmitting || (currentStep === 3 && !formData.acceptedTerms)}
                  className="flex items-center space-x-2 px-6 md:px-10 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-xl shadow-purple-200 dark:shadow-none text-sm md:text-base"
                >
                  {isSubmitting ? (
                     <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Submitting...</span>
                     </div>
                  ) : (
                    <>
                      <span>{currentStep === 3 ? 'Confirm Registration' : 'Next Step'}</span>
                      {currentStep === 3 ? <Send className="w-4 h-4" /> : <ChevronRight className="w-5 h-5" />}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* Footer */}
        <div className="text-center pb-12">
          <p className="text-slate-400 dark:text-slate-600 text-xs md:text-sm font-medium">Organized by Wisecrew Solutions in association with Ministry of MSME, Govt. of India.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
