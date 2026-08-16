import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Role, Patient, Doctor } from './types';

export type Screen =
  | 'landing'
  | 'patient-login'
  | 'patient-register'
  | 'doctor-login'
  | 'doctor-register'
  | 'admin-login'
  | 'patient-dashboard'
  | 'find-doctor'
  | 'doctor-profile'
  | 'book-appointment'
  | 'appointment-confirmation'
  | 'video-consultation'
  | 'consultation-summary'
  | 'patient-feedback'
  | 'medical-records'
  | 'prescriptions'
  | 'payments'
  | 'patient-profile'
  | 'help-support'
  | 'trust-safety'
  | 'doctor-dashboard'
  | 'doctor-verification-status'
  | 'doctor-appointments'
  | 'doctor-consultation'
  | 'doctor-prescription'
  | 'doctor-profile-settings'
  | 'admin-dashboard'
  | 'admin-verify-doctors'
  | 'admin-patients'
  | 'admin-doctors'
  | 'admin-reports'
  | 'admin-analytics';

type NavState = {
  screen: Screen;
  role: Role | null;
  patient: Patient | null;
  doctor: Doctor | null;
  selectedDoctorId: string | null;
  selectedAppointmentId: string | null;
  toast: string | null;
  navigate: (screen: Screen) => void;
  goBack: () => void;
  setRole: (role: Role | null) => void;
  setPatient: (p: Patient | null) => void;
  setDoctor: (d: Doctor | null) => void;
  selectDoctor: (id: string) => void;
  selectAppointment: (id: string) => void;
  showToast: (msg: string) => void;
};

const NavContext = createContext<NavState | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('landing');
  const [history, setHistory] = useState<Screen[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const navigate = useCallback((s: Screen) => {
    setHistory((h) => [...h, screen]);
    setScreen(s);
    window.scrollTo(0, 0);
  }, [screen]);

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setScreen(prev);
      return h.slice(0, -1);
    });
    window.scrollTo(0, 0);
  }, []);

  const selectDoctor = useCallback((id: string) => setSelectedDoctorId(id), []);
  const selectAppointment = useCallback((id: string) => setSelectedAppointmentId(id), []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <NavContext.Provider
      value={{
        screen,
        role,
        patient,
        doctor,
        selectedDoctorId,
        selectedAppointmentId,
        toast,
        navigate,
        goBack,
        setRole,
        setPatient,
        setDoctor,
        selectDoctor,
        selectAppointment,
        showToast,
      }}
    >
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
