import {useState, useEffect} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useClubs } from "../../hooks/useClub.js";

export type ClubData = {
    id: number;
    name: string;
}

export interface ClubResponse{
    message: string;
    data: ClubData[];
}

const AddClubAdmin = ()=>{

    const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;
    const [clubData, setClubData] = useState<ClubData[]>([]);
    const [rollno, setRollNo] = useState('');
    const [clubid, setClubId] = useState(0);
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent)=>{
        e.preventDefault();
        try{
            setLoading(true);
            const response = await axios.post(`${API_URL}/global/addadmin`,
                {
                    rollno: rollno,
                    club_id: clubid,
                    role: role
                },
                {
                    withCredentials: true
                }
            );
            if(response.status === 201){
                toast.success(
                    "Club Admin created successfully",
                    {
                        position: "bottom-right",
                        autoClose: 3000,
                        pauseOnHover: true,
                        draggable: true,
                        closeOnClick: true,
                        hideProgressBar: false,
                    }
                );
                setRollNo('');
                setClubId(0);
                setRole('');
            }

        }catch(err: any){
            if(err.response?.status === 401){ //need to handle the refresh token logic
                toast.error(
                    "Unauthorized access",
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
            else if(err.response?.status === 404){
                toast.error(
                    "User or club not found",
                    {
                        position: "bottom-right",
                        autoClose: 3000,
                        pauseOnHover: true,
                        draggable: true,
                        closeOnClick: true,
                        hideProgressBar: false,
                    }
                )
            }
            else if(err.response?.status === 409){
                toast.error(
                    "User is already an admin of this club",
                    {
                        position: "bottom-right",
                        autoClose: 3000,
                        pauseOnHover: true,
                        draggable: true,
                        closeOnClick: true,
                        hideProgressBar: false,
                    }
                )
            }
            else{
                toast.error(
                    "Issue in adding the club admin",
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

    const {data,isLoading} = useClubs()
    useEffect(() => {
        if (data !== undefined) {
            setClubData(data);
        }
    }, [data]);

    return(
        <>
            <div className="w-screen pt-[80px] flex justify-center items-center bg-black">
                <form onSubmit={handleSubmit} className="w-7/10 flex flex-col bg-secondary border-1 border-border justify-center items-center pb-[20px] rounded-[20px] p-[20px] gap-[20px]">
                    <p className="text-white font-medium text-[22px]" >Add Club Admin</p>
                    <input
                        type="text"
                        placeholder="Roll No"
                        value= {rollno}
                        onChange={(e)=>setRollNo(e.target.value)}
                        required
                        className="w-4/10 p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                    />
                    <select
                        value={clubid}
                        className="w-4/10 p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                        required
                        disabled = {loading}
                        onChange={(e)=>setClubId(parseInt(e.target.value))}
                    >
                        <option value=''>Select a club</option>
                        {isLoading?(
                            <option disabled = {loading} >Loading Clubs</option>
                        ):(
                            clubData.map((data, index)=>{
                                return(
                                    <option value={data.id} key={index}>{data.name}</option>
                                )
                            })
                        )}
                    </select>
                    <input
                        type="text"
                        placeholder="Role"
                        value= {role}
                        onChange={(e)=>setRole(e.target.value)}
                        className="w-4/10 p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                    />
                    <button
                        type="submit"
                        className="w-[200px] bg-primary text-white py-2 rounded-[10px] hover:bg-[#027a00] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            ) : (
                                'Add Admin'
                            )}
                    </button>
                </form>

            </div>
            <ToastContainer theme="dark"/>
        </>
    )
}

export default AddClubAdmin;