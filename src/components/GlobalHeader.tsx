import { LogOut } from "lucide-react";
import {useNavigate} from 'react-router-dom';
import { useGlobalAuth } from "../contexts/GlobalAuthContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const GlobalHeader = ()=>{

    const navigate  = useNavigate();

    const {logout}  = useGlobalAuth();

    const handleLogout = async ()=>{
        try{
            const statusCode = await logout();
            if(statusCode === 200){
                navigate('/');
            }
            else{
                toast.error("Issue in logout",
                    {
                        position: "bottom-right",
                        autoClose: 3000,
                        pauseOnHover: true,
                        draggable: true,
                        closeOnClick: true,
                        hideProgressBar: false,
                    }
                );
            }

        }catch(err){
            toast.error("Issue in logout",
                {
                    position: "bottom-right",
                    autoClose: 3000,
                    pauseOnHover: true,
                    draggable: true,
                    closeOnClick: true,
                    hideProgressBar: false,
                }
            );
        }
    }

    return(
        <>
            <div className="w-screen p-[20px] h-70px flex flex-row justify-between items-center border-b-1 border-border">
                <p className="text-primary font-medium text-[22px]">Global Admin Portal</p>
                <button  onClick={handleLogout} className="bg-primary text-white w-[120px] h-[40px] rounded-[10px] flex justify-center items-center gap-[10px]">
                    <LogOut/>
                    Logout
                </button>
            </div>
            <ToastContainer theme="dark"/>
        </>
    )
}

export default GlobalHeader;