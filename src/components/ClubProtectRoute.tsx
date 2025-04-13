import { ReactNode } from "react";
import { useClubAuth } from "../contexts/ClubAuthContext";
import {useNavigate} from 'react-router-dom';

interface ClubProtectedRouteProps{
    children: ReactNode;
}

const ClubProtectedRoute = ({children}: ClubProtectedRouteProps)=>{
    const {isCAuthenticated, loading} = useClubAuth();
    const navigate = useNavigate();
    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen w-screen bg-black">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        );
    }

    if(!isCAuthenticated){
        navigate('/');
    }
    return(
        <>
            {children}
        </>
    )
}

export default ClubProtectedRoute;