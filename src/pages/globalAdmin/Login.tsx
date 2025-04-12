import Logo from '../../assets/Logo.png';
import {useState} from 'react';
import { useGlobalAuth } from '../../contexts/GlobalAuthContext';
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ()=>{

    const navigate = useNavigate();

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const {login, loading} = useGlobalAuth();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
            const statusCode = await login(username, password);
            if(statusCode === 200){
                navigate('/global/dashboard');
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
    }

    return(
        <>
        <div className="flex items-center justify-center h-screen w-full p-4">
            <div className="bg-secondary border-2 border-border rounded-3xl shadow-xl p-8 flex max-w-4xl w-full flex-col md:flex-row">
                {/* Left side with logo */}
                <div className="md:w-1/2 w-full flex items-center justify-center p-4 mb-6 md:mb-0">
                    <img src={Logo} alt="EMS Logo" className="max-w-full max-h-48 md:max-h-64" />
                </div>

                {/* Right side with login form */}
                <div className="md:w-1/2 w-full p-4">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-primary">Global Admin Login</h1>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder='Username'
                                value={username}
                                onChange={(e)=>setUserName(e.target.value)}
                                className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder='Password'
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
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
                                <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
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
    )
}

export default Login;