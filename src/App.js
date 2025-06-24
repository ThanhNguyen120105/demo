import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/common/ScrollToTop';

// Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Services from './components/Services/Services';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import AppointmentPage from './components/Appointment/AppointmentPage';
import PatientDashboard from './components/patient/PatientDashboard'; // Moved from pages to patient folder
import AppointmentHistory from './components/patient/AppointmentHistory'; // Added for appointment history

import TestResultsLookup from './components/Appointment/TestResultsLookup';
import NavigationDemo from './components/common/NavigationDemo';
import Doctors from './components/Doctors/Doctors';
import Login from './components/Auth/Login';
import DoctorLogin from './components/Auth/DoctorLogin'; // From HEAD
import Signup from './components/Auth/Signup';
import QnA from './components/QA/QnA';

// Doctor Components
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import DoctorAppointments from './components/Doctor/DoctorAppointments';
import ARVSelectionTool from './components/Doctor/ARVSelectionTool';
import UnansweredQuestions from './components/Doctor/UnansweredQuestions';
import DoctorMedicalRecords from './components/Doctor/DoctorMedicalRecords'; // Added from 6adb463
import ApiTestDemo from './components/Demo/ApiTestDemo';
import StaffTestLogin from './components/Demo/StaffTestLogin'; // From HEAD

// Staff Components
import StaffDashboard from './components/Staff/StaffDashboard'; // From HEAD
import AppointmentApproval from './components/Staff/AppointmentApproval'; // Added for appointment approval

// Route Guards
import DoctorRoute from './components/common/DoctorRoute'; // From HEAD
import StaffRoute from './components/common/StaffRoute'; // From HEAD
import ProtectedRoute from './components/common/ProtectedRoute'; // Added for protected routes

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Header />
            <Routes>              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/appointment" element={<AppointmentPage />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} /> {/* Added from 6adb463 */}
              
              {/* Route cho lịch sử khám bệnh - chỉ dành cho CUSTOMER */}
              <Route 
                path="/lich-su-kham-benh" 
                element={
                  <ProtectedRoute requiredRole="CUSTOMER">
                    <AppointmentHistory />
                  </ProtectedRoute>
                } 
              />
            
              <Route path="/test-results" element={<TestResultsLookup />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/qna" element={<QnA />} />
              <Route path="/login" element={<Login />} />
              <Route path="/doctor/login" element={<DoctorLogin />} /> {/* From HEAD */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/navigation" element={<NavigationDemo />} />
              <Route path="/api-test" element={<ApiTestDemo />} />
              <Route path="/staff-test-login" element={<StaffTestLogin />} /> {/* From HEAD */}              {/* Staff Routes - Using StaffRoute from HEAD */}
              <Route path="/staff" element={<StaffRoute><StaffDashboard /></StaffRoute>} />
              <Route path="/staff/dashboard" element={<StaffRoute><StaffDashboard /></StaffRoute>} />
              <Route path="/staff/appointment-approval" element={<StaffRoute><AppointmentApproval /></StaffRoute>} />
            
              {/* Doctor Routes - Using DoctorRoute from HEAD */}
              <Route path="/doctor" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
              <Route path="/doctor/dashboard" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
              <Route path="/doctor/appointments" element={<DoctorRoute><DoctorAppointments /></DoctorRoute>} />
              <Route path="/doctor/medical-records" element={<DoctorRoute><DoctorMedicalRecords /></DoctorRoute>} /> {/* Added from 6adb463, wrapped with DoctorRoute */}
              <Route path="/doctor/arv-tool" element={<DoctorRoute><ARVSelectionTool /></DoctorRoute>} />
              <Route path="/doctor/unanswered-questions" element={<DoctorRoute><UnansweredQuestions /></DoctorRoute>} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
