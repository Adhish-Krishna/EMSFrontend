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
import GlobalProtectedRoute from './components/GlobalProtectedRoute';
import { ClubAuthProvider } from './contexts/ClubAuthContext';
import ClubProtectedRoute from './components/ClubProtectRoute';
import { AdminContextProvider } from './contexts/AdminContext';
import AddClubMembers from './components/ClubComponents/AddClubMember';
import EditEvent from './pages/clubAdmin/EditEvent';
import App from './App';
import AuthProvider from './contexts/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const Router = () => {
  return (
    <BrowserRouter>
    <GlobalAuthProvider>
    <AuthProvider>
        <ClubAuthProvider>
          <AdminContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/club/dashboard' element={
              <ClubProtectedRoute>
                <DashBoard />
              </ClubProtectedRoute>
            } />
            <Route path='/club/event/create' element={
              <ClubProtectedRoute>
                <CreateEvent />
              </ClubProtectedRoute>
            } />
            <Route  path = "/club/event/edit" element={
              <ClubProtectedRoute>
                <EditEvent/>
              </ClubProtectedRoute>
            }/>
            <Route path='/club/member/add' element={
              <ClubProtectedRoute>
                <AddClubMembers/>
              </ClubProtectedRoute>
            }/>
            <Route path="/global/dashboard" element={
              <GlobalProtectedRoute>
                <GlobalDashBoard />
              </GlobalProtectedRoute>
            } />
            <Route path='/global/club/create' element={
              <GlobalProtectedRoute>
                <CreateClub />
              </GlobalProtectedRoute>
            } />
            <Route path='/global/club/admin/add' element={
              <GlobalProtectedRoute>
                <AddClubAdmin />
              </GlobalProtectedRoute>
            } />
          </Routes>
          </AdminContextProvider>
        </ClubAuthProvider>
      </AuthProvider>
      </GlobalAuthProvider>
      </BrowserRouter>
  )
}


const queryclient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>  
  </StrictMode>,
)
