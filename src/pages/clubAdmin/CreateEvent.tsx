

import {useState} from 'react';
import RequiredEventDetails from '../../components/RequiredEventDetails';
import Header from '../../components/ClubHeader';
import OptionalEventDetails from '../../components/OptionalEventDetails';
import Convenors from '../../components/Convenors';
import EventPoster from '../../components/EventPoster';
import PreviewEvent from '../../components/PreviewEvent'; // Import PreviewEvent
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '../../components/ClubComponents/loading.tsx';

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
    poster: File | null | Blob | string;
    exp_expense?: number;
    tot_amt_allot_su?: number;
    tot_amt_spt_dor?: number;
    exp_no_aud?: number;
    faculty_obs_desig?: string;
    faculty_obs_dept?: string;
    eventConvenors: string[];
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
    const [isPreviewOpen, setIsPreviewOpen] = useState(false); // State for modal visibility

    const handlePublish = async ()=>{
        try{
            setLoading(true);
            const formData = new FormData();
            Object.entries(eventDetails).forEach(([key, value]) => {
                if (key === 'poster' || key === 'eventConvenors') return;
                if (value !== undefined && value !== null) {
                    formData.append(key, value as any);
                }
            });
            formData.append('eventConvenors', JSON.stringify(eventDetails.eventConvenors));
            if (eventDetails.poster) {
                formData.append('poster', eventDetails.poster);
            }

            if(loading)
            {
                return <LoadingScreen/>
            }
            const response = await axios.post(`${API_URL}/admin/create-event`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
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
            else if(response.status === 207){
                toast.success(
                    "Event published successfully but some convenors are not club members",
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
            else if(err.response?.status === 422){
                toast.error(
                    "Users dont exist in the database",
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
            setIsPreviewOpen(false); // Close modal on success/failure
        }
    }

    const handlePreview = () => {
        // Basic validation could be added here if needed before showing preview
        setIsPreviewOpen(true);
    }

    return(

        <>
            <Header/>
            <div className="w-auto pt-[100px] flex flex-col justify-center gap-[20px] items-center overflow-y-scroll mb-[20px]">
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
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-[10px] hover:bg-opacity-80 cursor-pointer flex justify-center items-center" onClick={handlePreview}>
                    Preview {/* Changed text from Publish to Preview */}
                </button>
            </div>
            {isPreviewOpen && (
                <PreviewEvent
                    eventDetails={eventDetails}
                    onPublish={handlePublish}
                    onClose={() => setIsPreviewOpen(false)}
                    loading={loading}
                />
            )}
            <ToastContainer theme='dark'/>
        </>
    )
}

export default CreateEvent;