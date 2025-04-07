import { useState, useEffect } from 'react';
import Logo from '../../assets/Logo.png';
// import axios from 'axios';

const Login = () => {
    const [rollNo, setRollNo] = useState('');
    const [clubName, setClubName] = useState('');
    const [password, setPassword] = useState('');
    const [clubs, setClubs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch clubs from API
        const fetchClubs = async () => {
            try {
                setLoading(true);
                // Replace with actual API endpoint
                const response = await fetch('https://api.example.com/clubs');
                const data = await response.json();
                setClubs(data);
            } catch (error) {
                console.error('Error fetching clubs:', error);
                // Fallback data in case API fails
                setClubs(['CSEA', 'IEEE', 'ACM', 'Codechef', 'GDC']);
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login with:', { rollNo, clubName, password });
        // Add actual login logic here
    };

    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="bg-[#212121] border-2 border-[#4E4E4E] rounded-3xl shadow-xl p-8 flex max-w-4xl w-full">
                {/* Left side with logo */}
                <div className="w-1/2 flex items-center justify-center p-4">
                    <img src={Logo} alt="EMS Logo" className="max-w-full max-h-64" />
                </div>

                {/* Right side with login form */}
                <div className="w-1/2 p-4">
                    <h1 className="text-3xl font-bold mb-6 text-center text-[#039A00]">Admin Login</h1>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={rollNo}
                                onChange={(e) => setRollNo(e.target.value)}
                                className="w-full p-2 rounded-[10px] bg-[#282828] text-white"
                                placeholder="Roll Number"
                                required
                            />
                        </div>

                        <div>
                            <select
                                value={clubName}
                                onChange={(e) => setClubName(e.target.value)}
                                className="w-full p-2 rounded-[10px] bg-[#282828] text-white"
                                required
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
                                className="w-full p-2 rounded-[10px] bg-[#282828] text-white"
                                placeholder="Password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#039A00] text-white py-2 mt-4 rounded-[10px] hover:bg-[#027a00] transition-colors"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;