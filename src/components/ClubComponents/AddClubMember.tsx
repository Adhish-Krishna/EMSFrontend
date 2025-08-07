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
        <>
            <div className="w-screen pt-[100px] pb-[20px] flex justify-center items-center flex-col gap-[20px] bg-slate-50">
                <div className="w-7/10 border-1 border-slate-200 rounded-[20px] p-[20px] flex flex-col justify-center items-center gap-[20px] bg-white">
                    <p className="text-slate-800 font-medium text-[22px]">
                        Add Club Members
                    </p>
                    <div className="w-7/10 flex flex-row justify-between items-center">
                        <input
                            type="text"
                            placeholder='Roll No'
                            value={rollno}
                            onChange={(e)=>setRollNo(e.target.value)}
                            className="w-4/10 p-2 rounded-[10px] bg-slate-50 text-slate-800 border-1 border-slate-200"
                            required
                        />
                        <input
                            type="text"
                            placeholder='Role (optional)'
                            value={role || ''}
                            onChange={(e)=>setRole(e.target.value)}
                            className="w-4/10 p-2 rounded-[10px] bg-slate-50 text-slate-800 border-1 border-slate-200"
                        />
                    </div>
                    <button className="bg-blue-600 h-[40px] rounded-[10px] text-white cursor-pointer pl-[20px] pr-[20px]" onClick={handleAddMember}>
                        Add Member
                    </button>
                    {
                        clubMembers.length>0 && (
                            <>
                                <p className="text-slate-800 font-medium text-[22px]">Added Club Members</p>
                                {
                                    clubMembers.map((member, index)=>{
                                        return (
                                            <div key={index} className='bg-slate-50 border-1 w-7/10 p-[20px] flex flex-row justify-between items-center rounded-[20px] border-slate-200'>
                                                <div className="p-[10px] flex flex-col gap-[5px] text-slate-800">
                                                    <p>Roll No: {member.rollno}</p>
                                                    {member.role && (
                                                        <p>Role: {member.role}</p>
                                                    )}
                                                </div>
                                                <button className="text-red-500 hover:text-red-300 cursor-pointer"
                                                onClick={()=>setClubMembers(clubMembers.filter((_, i)=> i !== index))}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )
                                    })
                                }

                            </>
                        )
                    }

                </div>
                <button className="bg-blue-600 w-[100px] h-[40px] rounded-[10px] text-white cursor-pointer" onClick={handleSave}>
                    {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Save'
                            )}
                </button>
            </div>
            <ToastContainer theme='dark'/>
        </>
    )
}

export default AddClubMembers;