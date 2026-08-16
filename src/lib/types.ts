export type Role = 'patient' | 'doctor' | 'admin';

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  qualifications: string;
  registration_id: string;
  hospital: string;
  experience_years: number;
  consultation_fee: number;
  rating: number;
  total_consultations: number;
  languages: string[];
  bio: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  verification_status: 'pending' | 'under_review' | 'approved' | 'rejected';
  available_times: string[];
  created_at: string;
};

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

export type Appointment = {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_date: string;
  appointment_time: string;
  consultation_type: string;
  fee: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  summary: string | null;
  follow_up: string | null;
  created_at: string;
};

export type Medication = {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
};

export type Prescription = {
  id: string;
  appointment_id: string;
  doctor_id: string;
  patient_id: string;
  medications: Medication[];
  notes: string | null;
  created_at: string;
};

export type Feedback = {
  id: string;
  appointment_id: string;
  doctor_id: string;
  patient_id: string;
  rating: number;
  confidence_boost: boolean;
  felt_safe: boolean;
  would_return: boolean;
  text: string | null;
  created_at: string;
};

export type Report = {
  id: string;
  patient_name: string;
  doctor_name: string;
  reason: string;
  status: 'under_review' | 'resolved' | 'closed';
  created_at: string;
};

export type AppointmentWithDoctor = Appointment & {
  doctor: Doctor;
};

export type AppointmentWithPatient = Appointment & {
  patient: Patient;
};

export type PrescriptionWithDoctor = Prescription & {
  doctor: Doctor;
};
