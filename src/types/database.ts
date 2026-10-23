export type FormType =
  | 'contact'
  | 'audit_booking'
  | 'service_quote'
  | 'training_registration'
  | 'sme_advisory'
  | 'newsletter';

export type SubmissionStatus =
  | 'new'
  | 'in_review'
  | 'contacted'
  | 'scheduled'
  | 'completed'
  | 'archived';

export type SubmissionPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface FormSubmission {
  id: number;
  ref_code: string;
  form_type: FormType;
  full_name: string;
  email: string;
  phone?: string;
  organization?: string;
  location?: string;
  subject?: string;
  service_category?: string;
  message?: string;
  status: SubmissionStatus;
  priority: SubmissionPriority;
  payload: Record<string, any>;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export type SubmissionInput = Omit<
  FormSubmission,
  'id' | 'ref_code' | 'created_at' | 'updated_at' | 'status' | 'priority' | 'internal_notes'
> & {
  status?: SubmissionStatus;
  priority?: SubmissionPriority;
  internal_notes?: string;
};

export interface DatabaseStats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  recent: FormSubmission[];
}
