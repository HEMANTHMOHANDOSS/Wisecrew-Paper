
import React, { useState, useEffect } from 'react';
import { AppState, ApplicationStatus } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  Upload, 
  ShieldCheck, 
  Download, 
  Calendar, 
  ArrowRight, 
  ExternalLink, 
  User, 
  Layout, 
  ChevronRight, 
  Mail, 
  Phone, 
  Sparkles, 
  Globe 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  state: AppState;
  onUpdate: (updates: Partial<AppState>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, onUpdate }) => {
  const [fileLoading, setFileLoading] = useState(false);

  const handleFileUpload = (type: 'payment' | 'paper' | 'ppt') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (type === 'payment') {
        onUpdate({ paymentProof: base64, status: ApplicationStatus.PAYMENT_VERIFYING });
      } else if (type === 'paper') {
        onUpdate({ fullPaperFile: base64, status: ApplicationStatus.PAPER_SUBMITTED });
      } else if (type === 'ppt') {
        onUpdate({ pptFile: base64, status: ApplicationStatus.PPT_SUBMITTED });
      }
      setFileLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const currentStepIndex = Object.values(ApplicationStatus).indexOf(state.status);

  useEffect(() => {
    if (state.status === ApplicationStatus.PAYMENT_VERIFYING) {
      const timer = setTimeout(() => {
        onUpdate({ status: ApplicationStatus.PAYMENT_APPROVED });
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (state.status === ApplicationStatus.PPT_SUBMITTED) {
        const timer = setTimeout(() => {
          onUpdate({ 
            status: ApplicationStatus.ID_GENERATED, 
            generatedId: `WS-NCGAI-${Math.floor(Math.random() * 9000) + 1000}` 
          });
        }, 3000);
        return () => clearTimeout(timer);
    }
    if (state.status === ApplicationStatus.ID_GENERATED) {
        const timer = setTimeout(() => {
          onUpdate({ 
            status: ApplicationStatus.SCHEDULED, 
            trackDetails: "Track 01: Generative AI & Computing - Hall Alpha - Online" 
          });
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [state.status]);

  const StatusCard = ({ label, active, completed }: any) => (
    <div className={`flex items-center space-x-4 p-4 rounded-2xl transition-all ${
      active ? 'bg-purple-50 dark:bg-purple-900/10 border-2 border-purple-200 dark:border-purple-800/50 ring-4 ring-purple-500/5' : 
      completed ? 'bg-emerald-50/50 dark:bg-emerald-900/5 border border-emerald-100 dark:border-emerald-800/30' : 'bg-slate-50 dark:bg-slate-800/30 opacity-40'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        active ? 'bg-purple-600 text-white animate-pulse shadow-lg shadow-purple-200 dark:shadow-none' : 
        completed ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
      }`}>
        {completed ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-5 h-5" />}
      </div>
      <div className="min-w-0">
        <h4 className={`font-semibold text-sm truncate ${active ? 'text-purple-900 dark:text-purple-300' : completed ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
          {label}
        </h4>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {active ? 'Current Phase' : completed ? 'Completed' : 'Upcoming'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">WS-NCGAI 2026 Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 italic text-sm md:text-base truncate max-w-xl">Submission: "{state.registration?.title}"</p>
        </div>
        <div className="flex items-center space-x-4 shrink-0">
           <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Support Access</span>
              <a href="mailto:ws-icgai2026@wisecrew.in" className="text-xs md:text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1">
                <Mail className="w-3 h-3 shrink-0" /> <span className="truncate max-w-[150px] md:max-w-none">ws-icgai2026@wisecrew.in</span>
              </a>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Sidebar */}
        <div className="space-y-4">
          <StatusCard label="Abstract Review" completed={currentStepIndex >= 1} active={state.status === ApplicationStatus.PENDING_REVIEW} />
          <StatusCard label="Registration Fee" completed={currentStepIndex >= 4} active={state.status === ApplicationStatus.ABSTRACT_ACCEPTED || state.status === ApplicationStatus.PAYMENT_VERIFYING} />
          <StatusCard label="Full Paper & PPT" completed={currentStepIndex >= 6} active={state.status === ApplicationStatus.PAYMENT_APPROVED || state.status === ApplicationStatus.PAPER_SUBMITTED} />
          <StatusCard label="Participation Badge" completed={currentStepIndex >= 7} active={state.status === ApplicationStatus.PPT_SUBMITTED || state.status === ApplicationStatus.ID_GENERATED} />
          <StatusCard label="Online Event Track" completed={currentStepIndex >= 8} active={state.status === ApplicationStatus.SCHEDULED} />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div 
              key={state.status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-none p-6 md:p-8 border border-slate-100 dark:border-slate-800 min-h-[450px] flex flex-col transition-colors duration-300"
            >
              {state.status === ApplicationStatus.PENDING_REVIEW && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/10 rounded-full flex items-center justify-center shadow-inner">
                    <Clock className="w-10 h-10 text-amber-500 dark:text-amber-400 animate-spin-slow" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Reviewing Your Abstract</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                      Our technical committee is evaluating your abstract for plagiarism (limit &lt; 10%) and technical merit.
                    </p>
                    <div className="mt-4 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl inline-block text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest">
                      DECISION DATE: 20 JANUARY 2026
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 w-full">
                    <button 
                      onClick={() => onUpdate({ status: ApplicationStatus.ABSTRACT_ACCEPTED })}
                      className="text-[10px] text-slate-300 dark:text-slate-700 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center space-x-1 mx-auto font-bold uppercase tracking-widest"
                    >
                      <span>(Admin Simulation: Approve Abstract)</span>
                      <ChevronRight className="w-2 h-2" />
                    </button>
                  </div>
                </div>
              )}

              {state.status === ApplicationStatus.ABSTRACT_ACCEPTED && (
                <div className="flex-1 flex flex-col space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 pr-4">
                      <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Abstract Accepted!</h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Congratulations! Please proceed with the registration fee to confirm participation.</p>
                    </div>
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-purple-600 dark:bg-purple-700 rounded-3xl text-white shadow-lg shadow-purple-200 dark:shadow-none">
                      <p className="text-purple-100 text-xs mb-1 uppercase font-black tracking-widest opacity-80">Registration Fee</p>
                      <h3 className="text-4xl md:text-5xl font-black">Rs. 150</h3>
                      <div className="mt-8 flex items-center justify-between">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-purple-200">Deadline: 20 Jan</p>
                        <ShieldCheck className="w-6 h-6 text-purple-300 dark:text-purple-400" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center space-y-4 p-4 md:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <div className="text-center">
                          <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 mb-1 tracking-widest">Payment UPI ID</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono select-all">wisecrew.symposium@upi</p>
                        </div>
                        <button className="flex items-center justify-center space-x-2 w-full py-4 bg-slate-900 dark:bg-purple-600 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-sm">
                            <ExternalLink className="w-4 h-4 shrink-0" />
                            <span>Open Payment Portal</span>
                        </button>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-6">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-widest">Upload Payment Proof</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload('payment')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      <div className="py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center group-hover:border-purple-400 dark:group-hover:border-purple-500 group-hover:bg-purple-50/30 dark:group-hover:bg-purple-900/10 transition-all">
                        <Upload className="w-8 h-8 text-slate-400 dark:text-slate-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 mb-2 transition-colors" />
                        <span className="text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 font-bold text-sm transition-colors">{fileLoading ? 'Uploading Proof...' : 'Drop Screenshot Here'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {state.status === ApplicationStatus.PAYMENT_VERIFYING && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center text-blue-500 shadow-inner">
                    <ShieldCheck className="w-8 h-8 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Validating Transaction</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed">Wisecrew Finance team is verifying your Rs. 150 payment. This usually takes 12-24 hours.</p>
                </div>
              )}

              {state.status === ApplicationStatus.PAYMENT_APPROVED && (
                <div className="flex-1 flex flex-col space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Upload Final Paper & PPT</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Payment verified! Please upload your full research manuscript and presentation slides.</p>
                    <div className="mt-2 text-[10px] font-black bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-3 py-1 rounded inline-block uppercase tracking-widest">Deadline: 25 January 2026</div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-8 border-2 border-dashed border-purple-200 dark:border-slate-700 rounded-3xl bg-purple-50/20 dark:bg-slate-800/20 flex flex-col items-center justify-center relative group hover:bg-purple-50 dark:hover:bg-slate-800 transition-all">
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload('paper')} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <Upload className="w-8 h-8 text-purple-400 dark:text-purple-500 mb-2" />
                      <p className="text-purple-900 dark:text-purple-300 font-bold">Upload Paper</p>
                      <p className="text-purple-400 dark:text-purple-600 text-[10px] font-bold uppercase tracking-tight">PDF / DOCX</p>
                    </div>
                    <div className="p-8 border-2 border-dashed border-indigo-200 dark:border-slate-700 rounded-3xl bg-indigo-50/20 dark:bg-slate-800/20 flex flex-col items-center justify-center relative group hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all">
                      <input type="file" accept=".ppt,.pptx" onChange={handleFileUpload('ppt')} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <Layout className="w-8 h-8 text-indigo-400 dark:text-indigo-500 mb-2" />
                      <p className="text-indigo-900 dark:text-indigo-300 font-bold">Upload PPT</p>
                      <p className="text-indigo-400 dark:text-indigo-600 text-[10px] font-bold uppercase tracking-tight">PPT / PPTX</p>
                    </div>
                  </div>
                </div>
              )}

              {state.status === ApplicationStatus.PAPER_SUBMITTED && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/10 rounded-full flex items-center justify-center text-amber-500 shadow-inner">
                    <Clock className="w-8 h-8 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Manuscript Locked</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm">We've received your paper. Please upload your final presentation (PPT) to complete the submission.</p>
                </div>
              )}

              {state.status === ApplicationStatus.PPT_SUBMITTED && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/10 rounded-full flex items-center justify-center text-indigo-500 shadow-inner">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Submission Complete!</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm">All files are secured for the WS-NCGAI 2026 competition. Your presenter badge is being generated...</p>
                </div>
              )}

              {state.status === ApplicationStatus.ID_GENERATED && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                    <div className="bg-gradient-to-br from-purple-900 to-indigo-950 p-1 w-full max-w-sm rounded-[2.5rem] shadow-2xl dark:shadow-purple-900/20">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.4rem] overflow-hidden">
                            <div className="h-24 bg-purple-600 dark:bg-purple-800 flex flex-col items-center justify-center text-white p-4">
                                <h3 className="font-black tracking-tight text-xl leading-none">WS-NCGAI 2026</h3>
                                <p className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-widest">Official Presenter Badge</p>
                            </div>
                            <div className="p-8 text-center">
                                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-4 border-4 border-white dark:border-slate-700 shadow-sm flex items-center justify-center transition-colors">
                                    <User className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white">{state.registration?.author1.name}</h4>
                                <p className="text-purple-600 dark:text-purple-400 font-bold text-sm mt-1 uppercase tracking-widest">{state.generatedId}</p>
                                <div className="mt-6 flex flex-wrap justify-center gap-2">
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Presenter</span>
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-wider truncate max-w-[120px]">{state.registration?.domain}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="flex items-center space-x-2 px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-200 dark:shadow-none text-sm">
                        <Download className="w-5 h-5 shrink-0" />
                        <span>Download Digital Badge</span>
                    </button>
                </div>
              )}

              {state.status === ApplicationStatus.SCHEDULED && (
                <div className="flex-1 flex flex-col space-y-8">
                    <div className="text-center">
                        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>Contest Scheduled</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Online Presentation Slot</h2>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-start space-x-6">
                            <div className="w-14 h-14 bg-purple-600 dark:bg-purple-800 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-200 dark:shadow-none">
                                <Globe className="w-8 h-8 shrink-0" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Your Time Slot</h4>
                                <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">{state.trackDetails}</p>
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Date</p>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">31 Jan 2026</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Hall</p>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Online Alpha</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                        <button className="w-full md:flex-1 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-purple-200 dark:shadow-none text-sm">
                            <span>Join Online Hall</span>
                            <ArrowRight className="w-4 h-4 shrink-0" />
                        </button>
                        <button className="w-full md:flex-1 py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm">
                            Add to iCal
                        </button>
                    </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
