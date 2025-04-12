import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashBoard from './pages/clubAdmin/ClubDashBoard';
import CreateEvent from './pages/clubAdmin/CreateEvent';
import GlobalDashBoard from './pages/globalAdmin/DashBoard';
import Home from './pages/home/Home';
import CreateClub from './pages/globalAdmin/CreateClub';
import AddClubAdmin from './pages/globalAdmin/AddClubAdmin';
import { GlobalAuthProvider } from './contexts/GlobalAuthContext';
import ProtectedRoute from './components/ProtectedRoute';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalAuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/club/dashboard' element={<DashBoard />} />
          <Route path='/club/event/create' element={<CreateEvent />} />
          <Route path="/global/dashboard" element={
            <ProtectedRoute>
              <GlobalDashBoard />
            </ProtectedRoute>
          } />
          <Route path='/global/club/create' element={
            <ProtectedRoute>
              <CreateClub />
            </ProtectedRoute>
          } />
          <Route path='/global/club/admin/add' element={
            <ProtectedRoute>
              <AddClubAdmin />
            </ProtectedRoute>
          } />
        </Routes>
      </GlobalAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
