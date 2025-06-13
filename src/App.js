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
import PatientDashboard from './pages/PatientDashboard';

import StaffDoctorManagement from './components/Appointment/StaffDoctorManagement';
import TestResultsLookup from './components/Appointment/TestResultsLookup';
import NavigationDemo from './components/common/NavigationDemo';
import Doctors from './components/Doctors/Doctors';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import QnA from './components/QA/QnA';

// Doctor Components
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import DoctorAppointments from './components/Doctor/DoctorAppointments';
import ARVSelectionTool from './components/Doctor/ARVSelectionTool';
import UnansweredQuestions from './components/Doctor/UnansweredQuestions';
import ApiTestDemo from './components/Demo/ApiTestDemo';
import DoctorMedicalRecords from './components/Doctor/DoctorMedicalRecords';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/appointment" element={<AppointmentPage />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              
              <Route path="/test-results" element={<TestResultsLookup />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/qna" element={<QnA />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/navigation" element={<NavigationDemo />} />
              <Route path="/api-test" element={<ApiTestDemo />} />
              
              {/* Staff Routes */}
              <Route path="/staff/doctor-management" element={<StaffDoctorManagement />} />
              
              {/* Doctor Routes */}
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/medical-records" element={<DoctorMedicalRecords />} />
              <Route path="/doctor/arv-tool" element={<ARVSelectionTool />} />
              <Route path="/doctor/unanswered-questions" element={<UnansweredQuestions />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
