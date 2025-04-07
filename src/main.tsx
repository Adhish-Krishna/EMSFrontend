import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/clubAdmin/Login';
import DashBoard from './pages/clubAdmin/ClubDashBoard';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/club/login' element = {<Login/>} />
        <Route path='/club/dashboard' element = {<DashBoard/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
