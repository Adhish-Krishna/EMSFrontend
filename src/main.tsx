import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/clubAdmin/Login';
import DashBoard from './pages/clubAdmin/ClubDashBoard';
import CreateEvent from './pages/clubAdmin/CreateEvent';
import GlobalLogin from './pages/globalAdmin/Login';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/global/login" element={<GlobalLogin/>}/>
        <Route path='/club/login' element = {<Login/>} />
        <Route path='/club/dashboard' element = {<DashBoard/>}/>
        <Route path='/club/event/create' element={<CreateEvent/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
