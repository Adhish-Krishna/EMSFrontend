import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthProvider';
import ClubAdminLogin from '../clubAdmin/Login';
import GlobalAdminLogin from '../globalAdmin/Login';
import { useState } from 'react';


const Home = () => {
    const [selectedSection, setSelectedSection] = useState<'global' | 'club'>('club');

    const {role} = useAuthContext()
    const navigate = useNavigate();

    if(role  === 'club' ) navigate('/club/dashboard')
    if(role === 'global') navigate('/global/dashboard')
    

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
            
            {/* Section Selector */}
            <div className="w-full max-w-md mt-16 mb-12 flex justify-center relative z-10">
                <div className="glass-morphism rounded-2xl p-2 flex w-full max-w-xs animate-slide-up">
                    <button
                        className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                            selectedSection === 'global'
                                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedSection('global')}
                    >
                        Global Admin
                    </button>
                    <button
                        className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                            selectedSection === 'club'
                                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
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