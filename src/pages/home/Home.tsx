import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthProvider';
import ClubAdminLogin from '../clubAdmin/Login';
import GlobalAdminLogin from '../globalAdmin/Login';
import { useState, useEffect } from 'react';


const Home = () => {
    const [selectedSection, setSelectedSection] = useState<'global' | 'club'>('club');

    const {role} = useAuthContext()
    const navigate = useNavigate();

    useEffect(() => {
        // Navigate based on role - the AuthProvider already handles authentication state
        if (role === 'club') {
            navigate('/club/dashboard');
        } else if (role === 'global') {
            navigate('/global/dashboard');
        }
    }, [role, navigate]);

    return (
        <div className="max-h-screen w-full bg-slate-50 flex flex-col items-center relative overflow-hidden">
            {/* Background decoration */}
            {/* Decorative backgrounds removed for consistency */}
            
            {/* Section Selector */}
            <div className="w-full max-w-md mt-8 flex justify-center relative z-10">
                <div className="glass-morphism rounded-2xl p-2 flex w-full max-w-xs animate-slide-up">
                    <button
                        className={`flex-1 py-3 px-6 rounded-[10px] font-semibold text-sm transition-all duration-300 ${
                            selectedSection === 'global'
                                ? 'bg-blue-600 text-white' 
                                : 'text-black hover:text-slate-800 hover:bg-white/50'
                        }`}
                        onClick={() => setSelectedSection('global')}
                    >
                        Global Admin
                    </button>
                    <button
                        className={`flex-1 py-3 px-6 rounded-[10px] font-semibold text-sm transition-all duration-300 ${
                            selectedSection === 'club'
                                ? 'bg-blue-600 text-white' 
                                : 'text-black hover:text-slate-800 hover:bg-white/50'
                        }`}
                        onClick={() => setSelectedSection('club')}
                    >
                        Club Admin
                    </button>
                </div>
            </div>

            {/* Login Component */}
            <div className="w-full relative z-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {selectedSection === 'global' ? (
                    <GlobalAdminLogin />
                ) : (
                    <ClubAdminLogin />
                )}
            </div>
        </div>
    );
};

export default Home;