import { NavProvider, useNav } from '@/lib/nav';
import { Toast } from '@/components/Toast';

import { Landing } from '@/screens/Landing';
import { PatientLogin, DoctorLogin, AdminLogin, PatientRegister } from '@/screens/Login';
import { DoctorRegister } from '@/screens/DoctorRegister';
import { TrustSafety } from '@/screens/TrustSafety';

import { PatientDashboard } from '@/screens/patient/PatientDashboard';
import { FindDoctor } from '@/screens/patient/FindDoctor';
import { DoctorProfile } from '@/screens/patient/DoctorProfile';
import { BookAppointment } from '@/screens/patient/BookAppointment';
import { AppointmentConfirmation } from '@/screens/patient/AppointmentConfirmation';
import { VideoConsultation } from '@/screens/patient/VideoConsultation';
import { ConsultationSummary } from '@/screens/patient/ConsultationSummary';
import { PatientFeedback } from '@/screens/patient/PatientFeedback';
import { MedicalRecords, Prescriptions, Payments, PatientProfile, HelpSupport } from '@/screens/patient/PatientSupportScreens';

import { DoctorDashboard } from '@/screens/doctor/DoctorDashboard';
import { DoctorVerificationStatus } from '@/screens/doctor/DoctorVerificationStatus';
import { DoctorAppointments } from '@/screens/doctor/DoctorAppointments';
import { DoctorConsultation } from '@/screens/doctor/DoctorConsultation';
import { DoctorPrescription } from '@/screens/doctor/DoctorPrescription';
import { DoctorProfileSettings } from '@/screens/doctor/DoctorProfileSettings';

import { AdminDashboard } from '@/screens/admin/AdminDashboard';
import { AdminVerifyDoctors } from '@/screens/admin/AdminVerifyDoctors';
import { AdminPatients, AdminDoctors } from '@/screens/admin/AdminManagement';
import { AdminReports } from '@/screens/admin/AdminReports';
import { AdminAnalytics } from '@/screens/admin/AdminAnalytics';

function Router() {
  const { screen } = useNav();

  switch (screen) {
    case 'landing': return <Landing />;
    case 'patient-login': return <PatientLogin />;
    case 'patient-register': return <PatientRegister />;
    case 'doctor-login': return <DoctorLogin />;
    case 'doctor-register': return <DoctorRegister />;
    case 'admin-login': return <AdminLogin />;
    case 'trust-safety': return <TrustSafety />;

    // Patient
    case 'patient-dashboard': return <PatientDashboard />;
    case 'find-doctor': return <FindDoctor />;
    case 'doctor-profile': return <DoctorProfile />;
    case 'book-appointment': return <BookAppointment />;
    case 'appointment-confirmation': return <AppointmentConfirmation />;
    case 'video-consultation': return <VideoConsultation />;
    case 'consultation-summary': return <ConsultationSummary />;
    case 'patient-feedback': return <PatientFeedback />;
    case 'medical-records': return <MedicalRecords />;
    case 'prescriptions': return <Prescriptions />;
    case 'payments': return <Payments />;
    case 'patient-profile': return <PatientProfile />;
    case 'help-support': return <HelpSupport />;

    // Doctor
    case 'doctor-dashboard': return <DoctorDashboard />;
    case 'doctor-verification-status': return <DoctorVerificationStatus />;
    case 'doctor-appointments': return <DoctorAppointments />;
    case 'doctor-consultation': return <DoctorConsultation />;
    case 'doctor-prescription': return <DoctorPrescription />;
    case 'doctor-profile-settings': return <DoctorProfileSettings />;

    // Admin
    case 'admin-dashboard': return <AdminDashboard />;
    case 'admin-verify-doctors': return <AdminVerifyDoctors />;
    case 'admin-patients': return <AdminPatients />;
    case 'admin-doctors': return <AdminDoctors />;
    case 'admin-reports': return <AdminReports />;
    case 'admin-analytics': return <AdminAnalytics />;

    default: return <Landing />;
  }
}

function App() {
  return (
    <NavProvider>
      <Router />
      <Toast />
    </NavProvider>
  );
}

export default App;
