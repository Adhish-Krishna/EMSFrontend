import { useState, useEffect } from 'react';
import Logo from '../../assets/Logo.png';
import CSEALogo from '../../assets/csea.png';
import PSGLogo from '../../assets/psg.png';
import { ClubData } from '../globalAdmin/AddClubAdmin';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useClubs } from '../../hooks/useClub.js';
import { useAuthContext } from '../../contexts/AuthProvider';

const Login = () => {
    const [clubData, setClubData] = useState<ClubData[]>([]);

    const {isAuthPending,clubAdminLogin} = useAuthContext() 

    const [rollno, setRollNo] = useState('');
    const [club_id, setClubId] = useState(0);
    const [password, setPassword] = useState('');
    const {data,isLoading} = useClubs()

    useEffect(() => {
        if (data !== undefined) {
          setClubData(data);
        }
      }, [data]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        clubAdminLogin({rollno,club_id,password})
    };

    return (
        <>
        <div className="flex items-center justify-center max-h-screen w-full p-6">
            <div className="card max-w-4xl w-full flex flex-col md:flex-row overflow-hidden animate-scale-in">
                {/* Left side with logo */}
                <div className="md:w-1/2 w-full flex items-center justify-center p-8 mb-6 md:mb-0 bg-gradient-to-br from-primary/10 to-accent/5">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <img src={PSGLogo} alt="PSG Logo" className="h-16 w-16 object-contain" />
                            <img src={Logo} alt="EMS Logo" className="max-h-32 object-contain" />
                            <img src={CSEALogo} alt="CSEA Logo" className="h-18 w-18 object-cover rounded-full border-2 border-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gradient">Event Management System</h2>
                        <p className="text-gray-400 mt-2">Club Administration Portal</p>
                    </div>
                </div>

                {/* Right side with login form */}
                <div className="md:w-1/2 w-full p-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Welcome Back</h1>
                        <p className="text-gray-400">Sign in to your club admin account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Roll Number</label>
                            <input
                                type="text"
                                value={rollno}
                                onChange={(e) => setRollNo(e.target.value)}
                                className="input-field w-full text-white"
                                placeholder="Roll Number"
                                required
                                disabled={isAuthPending}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Select Club</label>
                            <select
                                value={club_id}
                                className="input-field w-full text-white"
                                required
                                disabled = {isAuthPending}
                                onChange={(e)=>setClubId(parseInt(e.target.value))}
                            >
                                <option value=''>Select a club</option>
                                {isLoading?(
                                    <option disabled = {isAuthPending} >Loading Clubs</option>
                                ):(
                                    clubData.map((data, index)=>{
                                        return(
                                            <option value={data.id} key={index}>{data.name}</option>
                                        )
                                    })
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field w-full text-white"
                                placeholder="Password"
                                required
                                disabled={isAuthPending}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full text-white py-4 mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center font-semibold"
                            disabled={isAuthPending}
                        >
                            {isAuthPending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <ToastContainer theme='dark'/>
        </>
    );
};

export default Login;