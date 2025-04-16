import {useState} from 'react';
import RequiredEventDetails from '../../components/RequiredEventDetails';
import Header from '../../components/Header';
import OptionalEventDetails from '../../components/OptionalEventDetails';
import Convenors from '../../components/Convenors';
import EventPoster from '../../components/EventPoster';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type EventDetails = {
    name: string;
    about: string;
    date: string;
    event_type: string;
    venue: string;
    event_category: string;
    min_no_member?: number;
    max_no_member?: number;
    chief_guest?: string;
    poster: string | ArrayBuffer | null;
    exp_expense?: number;
    tot_amt_allot_su?: number;
    tot_amt_spt_dor?: number;
    exp_no_aud?: number;
    faculty_obs_desig?: string;
    faculty_obs_dept?: string;
    eventConvenors: string[];
}

export type EventConvenors = {
    rollno: string;
}

const CreateEvent = ()=>{
    const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;
    const event_details : EventDetails = {
        name: "",
        about: "",
        date: "",
        event_type: "",
        venue: "",
        event_category: "",
        min_no_member: undefined,
        max_no_member: undefined,
        chief_guest: "",
        poster: null,
        exp_expense: undefined,
        tot_amt_allot_su: undefined,
        tot_amt_spt_dor: undefined,
        exp_no_aud: undefined,
        faculty_obs_desig: undefined,
        faculty_obs_dept: undefined,
        eventConvenors: [],
    }
    const [eventDetails, setEventDetails] = useState(event_details);
    const [loading, setLoading] = useState(false);
    const handlePublish = async ()=>{
        try{
            setLoading(true);
            const response = await axios.post(`${API_URL}/admin/create-event`,
                eventDetails,
                {
                    withCredentials: true

                }
            );
            if(response.status === 201){
                toast.success(
                    "Event published successfully",
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
                    "Missing fields. Please fill out required fields",
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
            else if(err.response?.status === 409){
                toast.error(
                    "Event already exists",
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
                    "Issue in publishing the event",
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
            <Header/>
            <div className="w-screen pt-[100px] flex flex-col justify-center gap-[20px] items-center bg-black overflow-y-scroll mb-[20px]">
                <RequiredEventDetails
                    eventDetails={eventDetails}
                    setEventDetails={setEventDetails}
                    title='Create Event'
                />
                <OptionalEventDetails
                    eventDetails={eventDetails}
                    setEventDetails={setEventDetails}
                    title='Optional Details'
                />
                <EventPoster
                    eventDetails={eventDetails}
                    setEventDetails={setEventDetails}
                />
                <Convenors
                    eventDetails={eventDetails}
                    setEventDetails={setEventDetails}
                />
                <button className="bg-primary text-white px-4 py-2 rounded-[10px] hover:bg-opacity-80 cursor-pointer" onClick={handlePublish}>
                    {
                        loading?(
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </>

                        ):(
                            'Publish'
                        )
                    }
                </button>
            </div>
            <ToastContainer theme='dark'/>
        </>
    )
}

export default CreateEvent;