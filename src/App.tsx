import {createBrowserRouter,createRoutesFromElements,Route,RouterProvider} from 'react-router-dom'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
// import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

import MainLayout from './layout/MainLayout'
import Home from './pages/home/Home'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import DashBoard from './pages/globalAdmin/DashBoard'
import ProtectedRoute from './layout/ProtectedRoute'
import GlobalLayout from './layout/GlobalLayout'
import ClubAdminLayout from './layout/ClubAdminLayout'
import CreateClub from './pages/globalAdmin/CreateClub'
import AddClubAdmin from './pages/globalAdmin/AddClubAdmin'
import ClubDashBoard from './pages/clubAdmin/ClubDashBoard'
import CreateEvent from './pages/clubAdmin/CreateEvent'
import EditEvent from './pages/clubAdmin/EditEvent'
import EventsPage from './pages/clubAdmin/EventsPage'
import EventDetail from './pages/clubAdmin/EventDetail'
import AddClubMembers from './components/ClubComponents/AddClubMember'
import ClubAdminProfile from './pages/clubAdmin/ClubAdminProfile'
import ClubMembers from './pages/clubAdmin/ClubMembers';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
        <Route index element={<Home/>}/>
        <Route path='global' element={<ProtectedRoute allowedRoles={["global"]}><GlobalLayout/></ProtectedRoute>}>
            <Route path='dashboard' element={<DashBoard/>}/>
            <Route path='club/create' element={<CreateClub/>}/>
            <Route path='club/admin/add' element={<AddClubAdmin/>}/>
        </Route>
        <Route path='club' element={<ProtectedRoute allowedRoles={["club"]}><ClubAdminLayout/></ProtectedRoute>}>
            <Route path='dashboard' element={<ClubDashBoard/>}></Route>
            <Route path='event/create' element={<CreateEvent/>}/>
            <Route path='event/edit' element={<EditEvent/>}/>
            <Route path='member/add' element={<AddClubMembers/>}/>
            <Route path='events' element={<EventsPage/>}/>
            <Route path='events/:eventId' element={<EventDetail/>}/>
            <Route path='members' element={<ClubMembers/>}/>
            <Route path='profile' element = {<ClubAdminProfile/>}/>
        </Route>
    </Route>
))

const queryClient = new QueryClient()


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
        <ToastContainer theme='dark' position='top-right' autoClose={3000}
        pauseOnHover draggable closeOnClick={true} hideProgressBar={false}/>
        {/* <ReactQueryDevtools initialIsOpen={false}/> */}
        
    </QueryClientProvider>
    
  )
}
