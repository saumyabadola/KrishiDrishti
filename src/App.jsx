import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import MapDashboard from './pages/MapDashboard';
import FeedbackPage from './pages/FeedbackPage';
import MethodologyPage from './pages/MethodologyPage';
import AdminDashboard from './pages/AdminDashboard';
import ChatbotWidget from './components/ChatbotWidget';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<MapDashboard />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
