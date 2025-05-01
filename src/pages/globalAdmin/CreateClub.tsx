import {useState} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateClub = ()=>{

    const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;

    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try{
            setLoading(true);
            const response = await axios.post(`${API_URL}/global/createclub`,
                {
                    name,
                    about
                },
                {
                    withCredentials: true
                }
            );
            if(response.status === 201){
                toast.success("Club Created Successfully", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setName('');
                setAbout('');
            }
        }catch(err: any){
            if(err.response?.status === 409){
                toast.error("Club with the same name already exists!", {
                    position: "bottom-right",
                    autoClose: 5000,
                });
            } else {
                toast.error("Something went wrong. Please try again later.", {
                    position: "bottom-right",
                    autoClose: 5000,
                });
            }
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return(
        <>
            <div className='w-screen flex pt-[80px] pb-[30px] justify-center items-center'>
                <form onSubmit={handleSubmit} className="w-7/10 flex flex-col bg-secondary border-1 border-border rounded-[20px] justify-center items-center p-[40px] gap-[20px]">
                    <p className="text-white font-medium text-[22px]">Create a Club</p>
                    <input
                        type="text"
                        placeholder='Club Name'
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        className="w-7/10 p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                        required
                    />
                    <textarea
                        placeholder='About the club'
                        value={about}
                        onChange={(e)=>setAbout(e.target.value)}
                        className="w-7/10 p-2 rounded-[10px] bg-tertiary text-white border-1 border-border min-h-[100px] resize-y"
                        required
                    />
                    <button
                        type="submit"
                        className="w-[200px] bg-primary text-white py-2 rounded-[10px] hover:bg-[#027a00] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            ) : (
                                'Create'
                            )}
                    </button>
                </form>
            </div>
            <ToastContainer theme="dark" />
        </>
    )
}

export default CreateClub;
