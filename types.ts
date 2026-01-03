
export type DesignationType = 
  | 'Assistant Professor' 
  | 'Associate Professor' 
  | 'HOD' 
  | 'Vice Principal' 
  | 'Professor (S.G)' 
  | 'Professor' 
  | 'Others';

export interface Author {
  name: string;
  regNo: string;
  contactNo: string;
  email: string;
  dept: string;
  degree: string;
  specialization: string;
  year: string;
  college: string;
}

export interface Guide {
  name: string;
  designation: string;
  designationType: DesignationType;
  dept: string;
  contactNo: string;
  email: string;
  guidedAuthor: string; // "1", "2", "3" or "none"
}

export interface RegistrationData {
  author1: Author;
  author2?: Author & { isSameAsAuthor1: boolean };
  guide?: Guide;
  mainEmail: string;
  mainContact: string;
  correspondingAuthor: string;
  title: string;
  domain: string;
  abstractFile?: string; // base64
  acceptedTerms: boolean;
}

export enum ApplicationStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  ABSTRACT_ACCEPTED = 'ABSTRACT_ACCEPTED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_VERIFYING = 'PAYMENT_VERIFYING',
  PAYMENT_APPROVED = 'PAYMENT_APPROVED',
  PAPER_SUBMITTED = 'PAPER_SUBMITTED',
  PPT_SUBMITTED = 'PPT_SUBMITTED',
  ID_GENERATED = 'ID_GENERATED',
  SCHEDULED = 'SCHEDULED'
}

export interface AppState {
  registration: RegistrationData | null;
  status: ApplicationStatus;
  paymentProof?: string;
  fullPaperFile?: string;
  pptFile?: string;
  generatedId?: string;
  trackDetails?: string;
}

// Helper to store multiple user states in local storage
export interface Database {
  [email: string]: AppState;
}
