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

// Doctor Components
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import DoctorAppointments from './components/Doctor/DoctorAppointments';
import ARVSelectionTool from './components/Doctor/ARVSelectionTool';
import UnansweredQuestions from './components/Doctor/UnansweredQuestions';

import ApiTestDemo from './components/Demo/ApiTestDemo';
import StaffTestLogin from './components/Demo/StaffTestLogin'; // From HEAD

// Staff Components
import StaffDashboard from './components/Staff/StaffDashboard'; // From HEAD
import AppointmentApproval from './components/Staff/AppointmentApproval';

// Manager Components
import ManagerDashboard from './components/Manager/ManagerDashboard';

// Auth Components
import ProtectedRoute from './components/common/ProtectedRoute';
import DoctorRoute from './components/common/DoctorRoute';
import StaffRoute from './components/common/StaffRoute';
import ManagerRoute from './components/common/ManagerRoute';

// Video Call
import VideoCallPage from './components/VideoCall/VideoCallPage';

// Blog Components
import { HIVPreventionBlog } from './components/Blog';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <ScrollToTop />
            <Routes>
              {/* Video Call Route - No header/footer */}
              <Route path="/video-call/:appointmentId/:userRole" element={<VideoCallPage />} />
              
              {/* Normal routes with header/footer */}
              <Route path="/*" element={
                <>
            <Header />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />                    <Route path="/contact" element={<Contact />} />
                    <Route path="/doctors" element={<Doctors />} />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/doctor-login" element={<DoctorLogin />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    {/* Patient Routes - Using ProtectedRoute */}
                    <Route path="/appointment" element={<ProtectedRoute><AppointmentPage /></ProtectedRoute>} />
                    <Route path="/patient" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
                    <Route path="/patient/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
                    <Route path="/patient/appointment-history" element={<ProtectedRoute><AppointmentHistory /></ProtectedRoute>} />
                    <Route path="/lich-su-kham-benh" element={<ProtectedRoute><AppointmentHistory /></ProtectedRoute>} />
            
                    {/* Test Routes */}
              <Route path="/test-results" element={<TestResultsLookup />} />
                    <Route path="/navigation-demo" element={<NavigationDemo />} />
              <Route path="/api-test" element={<ApiTestDemo />} />
                    <Route path="/staff-test-login" element={<StaffTestLogin />} />

                    {/* Staff Routes - Using StaffRoute from HEAD */}
              <Route path="/staff" element={<StaffRoute><StaffDashboard /></StaffRoute>} />
              <Route path="/staff/dashboard" element={<StaffRoute><StaffDashboard /></StaffRoute>} />
              <Route path="/staff/appointment-approval" element={<StaffRoute><AppointmentApproval /></StaffRoute>} />
            
              {/* Manager Routes - Using ManagerRoute */}
              <Route path="/manager" element={<ManagerRoute><ManagerDashboard /></ManagerRoute>} />
              <Route path="/manager/dashboard" element={<ManagerRoute><ManagerDashboard /></ManagerRoute>} />
            
              {/* Doctor Routes - Using DoctorRoute from HEAD */}
              <Route path="/doctor" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
              <Route path="/doctor/dashboard" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
              <Route path="/doctor/appointments" element={<DoctorRoute><DoctorAppointments /></DoctorRoute>} />

              <Route path="/doctor/arv-tool" element={<DoctorRoute><ARVSelectionTool /></DoctorRoute>} />
              <Route path="/doctor/unanswered-questions" element={<DoctorRoute><UnansweredQuestions /></DoctorRoute>} />

              {/* Blog Routes */}
              <Route path="/blog" element={<HIVPreventionBlog />} />
              <Route path="/hiv-prevention-blog" element={<HIVPreventionBlog />} />
            </Routes>
            <Footer />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
