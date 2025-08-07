import { LogOut, User, BookUser, Building } from "lucide-react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useClubContext } from "../layout/ClubAdminLayout";
import { useAuthContext } from "../contexts/AuthProvider";

const ProfileOverlay = () => {
    const club = useClubContext();
    const clubprofile = club?.clubprofile || null;
    const { logoutClubUser } = useAuthContext();

    const handleLogout = async () => {
        logoutClubUser();
    };


    return (
        <>
            <div className="w-[300px] glass-morphism p-6 flex flex-col justify-center items-center gap-4 rounded-2xl z-[1000] shadow-2xl animate-scale-in overflow-hidden responsive-p-sm">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/50 mb-2">
                    <User size={30} className="text-primary" />
                </div>

                {clubprofile && clubprofile.name?.length > 0 && (
                    <div className="flex items-center gap-3 w-full transition-all duration-300 hover:bg-white/10 p-3 rounded-xl">
                        <User size={16} className="text-blue-600" />
                        <p className='text-sm font-medium text-slate-800 responsive-text-sm'>{clubprofile.name}</p>
                    </div>
                )}

                {clubprofile && clubprofile.rollno?.length > 0 && (
                    <div className="flex items-center gap-3 w-full transition-all duration-300 hover:bg-white/10 p-3 rounded-xl">
                        <BookUser size={16} className="text-blue-600" />
                        <p className='text-sm font-medium text-slate-800 responsive-text-sm'>{clubprofile.rollno}</p>
                    </div>
                )}
                
                {clubprofile && clubprofile.club?.length > 0 && (
                    <div className="flex items-center gap-3 w-full transition-all duration-300 hover:bg-white/10 p-3 rounded-xl">
                        <Building size={16} className="text-blue-600" />
                        <p className='text-sm font-medium text-slate-800 truncate responsive-text-sm'>{clubprofile.club}</p>
                    </div>
                )}
                
                <button
                    className="btn-primary w-full text-white text-sm cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
            <ToastContainer theme="dark"/>
        </>
    );
};

export default ProfileOverlay;