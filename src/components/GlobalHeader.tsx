import { LogOut } from "lucide-react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from "../contexts/AuthProvider";

const GlobalHeader = ()=>{
    const {logoutGlobalUser} = useAuthContext()

    const handleLogout = async ()=>{
        logoutGlobalUser()
    }

    return(
        <>
            <div className="w-screen px-6 py-4 h-[70px] glass-morphism flex flex-row justify-between items-center border-b border-slate-200">
                <h1 className="text-2xl font-bold text-gradient">Global Admin Portal</h1>
                <button onClick={handleLogout} className="btn-primary text-white flex justify-center items-center gap-2">
                    <LogOut/>
                    Logout
                </button>
            </div>
            <ToastContainer theme="dark"/>
        </>
    )
}

export default GlobalHeader;