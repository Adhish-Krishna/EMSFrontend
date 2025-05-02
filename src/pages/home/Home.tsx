import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthProvider';
import ClubAdminLogin from '../clubAdmin/Login';
import GlobalAdminLogin from '../globalAdmin/Login';
import { useState} from 'react';


const Home = () => {
    const [selectedSection, setSelectedSection] = useState<'global' | 'club'>('global');

    const {role} = useAuthContext()
    const navigate = useNavigate();

    if(role  === 'club' ) navigate('/club/dashboard')
    if(role === 'global') navigate('/global/dashboard')
    
    if(role === undefined){
        return (
        <div className="flex justify-center items-center h-screen w-screen bg-black">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        )
    }

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