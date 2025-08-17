import {useState} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ClubMember{
    rollno: string;
    role?: string;
}

const AddClubMembers = ()=>{
    const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;
    const [clubMembers, setClubMembers] = useState<ClubMember[]>([]);
    const [rollno, setRollNo] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const handleAddMember = ()=>{
        const newmember = {
            rollno: rollno,
            role: role
        }
        setRollNo('');
        setRole('');
        setClubMembers([...clubMembers, newmember]);
    }
    const handleSave = async ()=>{
        try{
            setLoading(true);
            const response = await axios.post(`${API_URL}/admin/add-members`,{
                members: clubMembers
            },{
                withCredentials: true
            });
            if(response.status === 201){
                toast.success(
                    "Club Members added successfully",
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
            else if(response.status === 204){
                toast.success(
                    "No action taken",
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
            else if(response.status === 207){
                toast.success(
                    "Some members added successfully but others failed",
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
        }catch(err: any){
            if(err.response?.status === 400){
                toast.error(
                    "Invalid Input format",
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
            else if(err.response?.status === 422){
                toast.error(
                    "Valid format but members cannot be processed",
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
            else{
                toast.error(
                    "Issue in adding club members",
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
        }finally{
            setLoading(false);
        }

    }
    return(
        <div className="flex flex-col gap-4 w-full">
            {/* Input Section */}
            <div className="flex flex-col gap-3 w-full">
                <input
                    type="text"
                    placeholder='Roll No'
                    value={rollno}
                    onChange={(e)=>setRollNo(e.target.value)}
                    className="w-full p-3 rounded-lg bg-tertiary text-white border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                />
                <input
                    type="text"
                    placeholder='Role (optional)'
                    value={role || ''}
                    onChange={(e)=>setRole(e.target.value)}
                    className="w-full p-3 rounded-lg bg-tertiary text-white border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <button 
                    className="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary/90 transition-colors" 
                    onClick={handleAddMember}
                >
                    Add Member
                </button>
            </div>

            {/* Members List */}
            {clubMembers.length > 0 && (
                <div className="space-y-3">
                    <p className="text-white font-medium text-lg">
                        Added Club Members
                    </p>
                    {clubMembers.map((member, index) => (
                        <div 
                            key={index} 
                            className='bg-tertiary border border-border p-4 flex justify-between items-center rounded-lg'
                        >
                            <div className="text-white">
                                <p className="font-medium">Roll No: {member.rollno}</p>
                                {member.role && (
                                    <p className="text-sm text-gray-400">Role: {member.role}</p>
                                )}
                            </div>
                            <button 
                                className="text-red-500 hover:text-red-400 transition-colors"
                                onClick={() => setClubMembers(clubMembers.filter((_, i) => i !== index))}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Save Button */}
            {clubMembers.length > 0 && (
                <button  
                    className="w-full bg-emerald-600 p-3 rounded-lg text-white hover:bg-emerald-500 transition-colors flex justify-center items-center" 
                    onClick={handleSave}
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        'Save All Members'
                    )}
                </button>
            )}

            <ToastContainer theme='dark'/>
        </div>
    )
}

export default AddClubMembers;