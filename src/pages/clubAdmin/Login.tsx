import { useState, useEffect } from 'react';
import Logo from '../../assets/Logo.png';
import { ClubData, ClubResponse } from '../globalAdmin/AddClubAdmin';
import { AxiosResponse } from 'axios';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useClubAuth } from '../../contexts/ClubAuthContext';
import {useNavigate} from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;
    const club_data: ClubData[] = [];
    const [clubData, setClubData] = useState(club_data);
    const [rollno, setRollNo] = useState('');
    const [clubid, setClubId] = useState(0);
    const [password, setPassword] = useState('');
    const [loadclub, setLoadClub] = useState(false);
    const {loading, login}  = useClubAuth();

    useEffect(() => {
        async function getClubDetails(){
            try{
                setLoadClub(true);
                const response: AxiosResponse<ClubResponse> = await axios.get(`${API_URL}/club/getclubs`,{withCredentials:true});
                const club_details: ClubData[] = response.data.data;
                if(response.status === 200){
                    setClubData(club_details);
                }
            } catch(err: any) {
                if(err.response?.status === 301){
                    toast.error(
                        "No club found!",
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
                else if(err.response?.status === 500){
                    toast.error(
                        "Issue in fetchng the clubs",
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
            finally{
                setLoadClub(false);
            }
        }

        getClubDetails();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const statusCode = await login(rollno, clubid, password);
            if(statusCode === 200){
                navigate('/club/dashboard');
            }
            else{
                toast.error('Invalid credentials. Please try again.', {
                    position: "bottom-right",
                    autoClose: 3000
                });
            }
        }catch(err){
            toast.error('An error occurred during login', {
                position: "bottom-right",
                autoClose: 3000
            });
        }

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
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <select
                                value={clubid}
                                className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                                required
                                disabled = {loading}
                                onChange={(e)=>setClubId(parseInt(e.target.value))}
                            >
                                <option value=''>Select a club</option>
                                {loadclub?(
                                    <option disabled = {loading} >Loading Clubs</option>
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
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 mt-4 rounded-[10px] hover:bg-[#027a00] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
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