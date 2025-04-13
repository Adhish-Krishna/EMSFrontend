import ClubAdminLogin from '../clubAdmin/Login';
import GlobalAdminLogin from '../globalAdmin/Login';
import { useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { useGlobalAuth } from '../../contexts/GlobalAuthContext';
import { useClubAuth } from '../../contexts/ClubAuthContext';

const Home = () => {
    const [selectedSection, setSelectedSection] = useState<'global' | 'club'>('global');

    const navigate = useNavigate();

    const {isAuthenticated} = useGlobalAuth();

    const {isCAuthenticated} = useClubAuth();

    useEffect(()=>{
        if(isAuthenticated && isCAuthenticated){
            navigate('/global/dashboard');
        }
        else if(isAuthenticated){
            navigate('/global/dashboard');
        }
        else if(isCAuthenticated){
            navigate('/club/dashboard');
        }
    },[isAuthenticated, isCAuthenticated ,navigate]);

    return (
        <div className="w-screen h-screen flex flex-col items-center bg-black">
            {/* Section Selector */}
            <div className="w-full max-w-md mt-12 mb-8 flex justify-center fixed">
                <div className="bg-tertiary border-1 border-border rounded-xl p-2 flex w-full max-w-xs">
                    <button
                        className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 ${
                            selectedSection === 'global'
                                ? 'bg-primary text-white'
                                : 'text-white hover:bg-secondary'
                        }`}
                        onClick={() => setSelectedSection('global')}
                    >
                        Global Admin
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-lg transition-all duration-300 ${
                            selectedSection === 'club'
                                ? 'bg-primary text-white'
                                : 'text-white hover:bg-secondary'
                        }`}
                        onClick={() => setSelectedSection('club')}
                    >
                        Club Admin
                    </button>
                </div>
            </div>

            {/* Login Component */}
            <div className="w-full">
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