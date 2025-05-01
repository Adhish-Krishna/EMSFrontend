import { Outlet } from 'react-router-dom'
import AuthProvider from '../contexts/AuthProvider'

export default function MainLayout() {
  return (
    <AuthProvider>
        <Outlet/>
    </AuthProvider>
  )
}
