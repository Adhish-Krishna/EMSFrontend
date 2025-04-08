import { useState, useEffect } from 'react';
import Logo from '../../assets/Logo.png';
// import axios from 'axios';

const Login = () => {

    const API_URL = import.meta.env.VITE_BASE_API_URL;

    const [rollNo, setRollNo] = useState('');
    const [clubName, setClubName] = useState('');
    const [password, setPassword] = useState('');
    const [clubs, setClubs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        // Fetch clubs from API
        const fetchClubs = async () => {
            try {
                setLoading(true);
                // Replace with actual API endpoint
                const response = await fetch(`${API_URL}/clubs`);
                const data = await response.json();
                setClubs(data);
            } catch (error) {
                console.error('Error fetching clubs:', error);
                // Fallback data in case API fails
                setClubs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        console.log('Login with:', { rollNo, clubName, password });

        // Simulate API call with timeout
        try {
            // Add actual login logic here
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call delay
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="bg-secondary border-2 border-border rounded-3xl shadow-xl p-8 flex max-w-4xl w-full">
                {/* Left side with logo */}
                <div className="w-1/2 flex items-center justify-center p-4">
                    <img src={Logo} alt="EMS Logo" className="max-w-full max-h-64" />
                </div>

                {/* Right side with login form */}
                <div className="w-1/2 p-4">
                    <h1 className="text-3xl font-bold mb-6 text-center text-primary">Admin Login</h1>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={rollNo}
                                onChange={(e) => setRollNo(e.target.value)}
                                className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                                placeholder="Roll Number"
                                required
                                disabled={isLoggingIn}
                            />
                        </div>

                        <div>
                            <select
                                value={clubName}
                                onChange={(e) => setClubName(e.target.value)}
                                className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                                required
                                disabled={isLoggingIn}
                            >
                                <option value="">Select a club</option>
                                {loading ? (
                                    <option disabled>Loading clubs...</option>
                                ) : (
                                    clubs.map((club, index) => (
                                        <option key={index} value={club}>
                                            {club}
                                        </option>
                                    ))
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
                                disabled={isLoggingIn}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 mt-4 rounded-[10px] hover:bg-[#027a00] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? (
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
    );
};

export default Login;