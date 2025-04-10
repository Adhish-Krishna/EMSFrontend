import Logo from '../../assets/Logo.png';
import {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Login = ()=>{

    const navigate  = useNavigate();

    const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]= useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
            setLoading(true);
            const response = await axios.post(`${API_URL}/auth/global/login`,
                {
                    username: username,
                    password: password,
                },
                {
                    withCredentials: true
                }
            );
            console.log(response.status);
            if(response.status === 200){
                setLoading(false);
                // navigate('/club/dashboard');
                console.log("Login successful");
            }

        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        } finally {
            setLoading(false);
        }
    }

    return(
        <>
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-5/10 bg-secondary border-1 border-border p-[20px] rounded-[20px] flex justify-between items-center">
                <img src={Logo} className='ml-[40px]' alt="Logo" />
                <form onSubmit={handleLogin} className="w-6/10 flex flex-col p-[10px] justify-center items-center gap-[20px]">
                    <p className='text-primary text-[22px] font-medium'>Global Admin Login</p>
                    <input
                        type="text"
                        placeholder='Username'
                        value={username}
                        onChange={(e)=>setUserName(e.target.value)}
                        className="w-6/10 p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        className="w-6/10 p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                        required
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="w-6/10 bg-primary text-white h-[40px] rounded-[10px] cursor-pointer flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <p>Login</p>
                        )}
                    </button>
                </form>
            </div>
        </div>
        </>
    )
}

export default Login;