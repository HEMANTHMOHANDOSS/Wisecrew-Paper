
import React from 'react';
import { 
  User, 
  Users, 
  GraduationCap, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  Upload, 
  Clock,
  Layout,
  Calendar
} from 'lucide-react';

export const STEPS = [
  { id: 'author1', label: 'Author 1', icon: <User className="w-5 h-5" /> },
  { id: 'author2', label: 'Author 2', icon: <Users className="w-5 h-5" /> },
  { id: 'guide', label: 'Guide', icon: <GraduationCap className="w-5 h-5" /> },
  { id: 'submission', label: 'Submission', icon: <FileText className="w-5 h-5" /> }
];

export const WORKFLOW_STAGES = [
  { status: 'ABSTRACT_ACCEPTED', label: 'Abstract Approved', icon: <CheckCircle2 /> },
  { status: 'PAYMENT_APPROVED', label: 'Payment Verified', icon: <CreditCard /> },
  { status: 'PAPER_SUBMITTED', label: 'Full Paper', icon: <Upload /> },
  { status: 'PPT_SUBMITTED', label: 'PPT Upload', icon: <Layout /> },
  { status: 'ID_GENERATED', label: 'ID Badge', icon: <User /> },
  { status: 'SCHEDULED', label: 'Final Track', icon: <Calendar /> }
];
