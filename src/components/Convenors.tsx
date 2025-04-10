import { EventConvenors } from "../pages/clubAdmin/CreateEvent";
import { Dispatch, SetStateAction } from 'react';
import {useState, useEffect} from 'react';

interface ConvenorProps{
    convenorDetails: EventConvenors[];
    setConvenorDetails: Dispatch<SetStateAction<EventConvenors[]>>;
}

const Convenors = ({convenorDetails, setConvenorDetails}:ConvenorProps)=>{

    const API_URL = import.meta.env.VITE_BASE_API_URL;

    const [clubs, setClubs] = useState<string[]>([
        "CSEA",
        "GHCC",
        "The Eye",
    ]);
    const [loading, setLoading] = useState(false);
    const [clubName, setClubName] = useState('');
    const [rollNo, setRollNo] = useState('');

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
                //setClubs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    const handleAddConvenor = () => {
        if (rollNo && clubName) {
            const newConvenor: EventConvenors = {
                rollno: rollNo,
                clubName: clubName
            };

            setConvenorDetails([...convenorDetails, newConvenor]);

            // Reset form fields after adding
            setRollNo('');
            setClubName('');
        }
    };

    return(
        <>
            <div className="w-7/10 border-border border-1 bg-secondary p-[20px] flex flex-col justify-center items-center gap-[10px] rounded-[20px]">
                <p className="text-white text-[22px] mb-[10px]">Add Event Convenors</p>
                <div className="w-8/10 flex flex-col justify-center items-center">
                    <div className="w-8/10 flex flex-row justify-between items-center">
                        <input
                            type="text"
                            placeholder = 'Roll No'
                            value={rollNo}
                            onChange={(e)=> setRollNo(e.target.value)}
                            className="w-45/100 p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                            required
                        />
                        <select
                                value={clubName}
                                onChange={(e) => setClubName(e.target.value)}
                                className="w-45/100 p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
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
                    <button
                        onClick={handleAddConvenor}
                        className="mt-4 bg-primary text-white px-4 py-2 rounded-[10px] hover:bg-opacity-80"
                    >
                        Add Convenor
                    </button>
                </div>

                {convenorDetails.length > 0 && (
                    <div className="w-7/10 mt-4 flex flex-col">
                        <h3 className="text-white text-[18px]">Added Convenors:</h3>
                        <div className="mt-2">
                            {convenorDetails.map((convenor, index) => (
                                <div key={index} className="flex justify-between items-center p-[10px] border-1 border-border bg-tertiary rounded-[10px] mb-[10px]">
                                    <div>
                                        <span className="text-white">Roll No: {convenor.rollno}</span>
                                        <span className="text-white ml-4">Club: {convenor.clubName}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setConvenorDetails(convenorDetails.filter((_, i) => i !== index));
                                        }}
                                        className="text-red-500 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Convenors;