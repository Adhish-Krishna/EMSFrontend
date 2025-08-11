import Logo from '../../assets/Logo.png';
import CSEALogo from '../../assets/csea.png';
import PSGLogo from '../../assets/psg.png';
import {useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '../../contexts/AuthProvider';
import { ToastContainer } from 'react-toastify';

const Login = ()=>{
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading,setLoading] = useState<boolean>(false)

    const {globalAdminLogin:login} = useAuthContext()


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true)
        login({username,password})
        setLoading(false)
    }

    return(
        <>
        <div className="flex items-center justify-center min-h-screen w-full p-6">
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
                        <p className="text-gray-400 mt-2">Global Administration Portal</p>
                    </div>
                </div>

                {/* Right side with login form */}
                <div className="md:w-1/2 w-full p-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Welcome Back</h1>
                        <p className="text-gray-400">Sign in to your global admin account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                            <input
                                type="text"
                                placeholder='Username'
                                value={username}
                                onChange={(e)=>setUserName(e.target.value)}
                                className="input-field w-full text-white"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                placeholder='Password'
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                className="input-field w-full text-white"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full text-white py-4 mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center font-semibold"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin -ml-1 mr-3 h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer theme='dark'/>
        </div>
        </>
    )
}

export default Login;