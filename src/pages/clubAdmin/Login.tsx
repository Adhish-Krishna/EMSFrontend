import { useState, useEffect } from 'react';
import Logo from '../../assets/Logo.png';
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
        <div className="flex items-center justify-center h-screen w-full p-4">
            <div className="bg-secondary border-2 border-border rounded-3xl shadow-xl p-8 flex max-w-4xl w-full flex-col md:flex-row">
                {/* Left side with logo */}
                <div className="md:w-1/2 w-full flex items-center justify-center p-4 mb-6 md:mb-0">
                    <img src={Logo} alt="EMS Logo" className="max-w-full max-h-48 md:max-h-64" />
                </div>

                {/* Right side with login form */}
                <div className="md:w-1/2 w-full p-4">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-primary">Admin Login</h1>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={rollno}
                                onChange={(e) => setRollNo(e.target.value)}
                                className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                                placeholder="Roll Number"
                                required
                                disabled={isAuthPending}
                            />
                        </div>

                        <div>
                            <select
                                value={club_id}
                                className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
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
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                                placeholder="Password"
                                required
                                disabled={isAuthPending}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 mt-4 rounded-[10px] hover:bg-[#027a00] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                            disabled={isAuthPending}
                        >
                            {isAuthPending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </>
                            ) : (
                                'Login'
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