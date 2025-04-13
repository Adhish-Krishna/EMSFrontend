import { useGlobalAuth } from "../contexts/GlobalAuthContext";
import {ReactNode } from "react";
import {useNavigate} from 'react-router-dom';

interface ProtectedRouteProps{
    children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps)=>{
    const navigate = useNavigate();
    const {isAuthenticated, loading} = useGlobalAuth();

    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen w-screen bg-black">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        );
    }

    if(!isAuthenticated){
        navigate('/');
    }
    return(
        <>
            {children}
        </>
    )
}

export default ProtectedRoute;