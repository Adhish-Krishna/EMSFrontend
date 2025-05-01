import RequiredEventDetails from "../../components/RequiredEventDetails";
import OptionalEventDetails from "../../components/OptionalEventDetails";
import Convenors from "../../components/Convenors";
import { EventDetails} from "./CreateEvent";
import {useState, useEffect} from 'react';
import { useSearchParams } from "react-router-dom";
import Header from "../../components/ClubHeader";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import EventPoster from "../../components/EventPoster";

const EditEvent = ()=>{
    const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;
    const [searchParams] = useSearchParams();
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
    const [eventDetails, setEventDetails] = useState<EventDetails>(event_details);
    const [isLoading, setIsLoading] = useState(true);
    const [isPosterLoading, setIsPosterLoading] = useState(true);
    // const type = searchParams.get("type");
    const id = searchParams.get("id");

    useEffect(()=>{
        const fetchEventDetails = async ()=>{
            try{
                setIsLoading(true);
                const response = await axios.get(`${API_URL}/event/eventdetails?id=${id}`,{
                    withCredentials: true
                });
                if(response.status === 200){
                    const eventData: EventDetails = response.data;
                    eventData.date = eventData.date.slice(0,10);
                    setEventDetails(eventData);
                    // Fetch poster immediately after getting event details
                    try {
                        setIsPosterLoading(true);
                        const posterResponse = await axios.get(`${API_URL}/event/eventposter?id=${id}`, {
                            withCredentials: true,
                            responseType: "blob"
                        });

                        if (posterResponse.status === 200) {
                            const blob = posterResponse.data;
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = () => {
                                const base64String = reader.result as string;
                                setEventDetails((prev) => ({
                                    ...prev,
                                    poster: base64String
                                }));
                                setIsPosterLoading(false);
                            };
                        } else {
                            setIsPosterLoading(false);
                        }
                    } catch (posterErr: any) {
                        console.error("Error fetching poster:", posterErr);
                        setIsPosterLoading(false);
                        // Don't show toast here since we already have event data
                    }

                }else if(response.status === 301){
                    toast.error(
                        "No event found",
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
                if(err.response?.status === 500){
                    toast.error(
                        "Issue in fetching event details",
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
            } finally {
                setIsLoading(false);
            }
        }
        fetchEventDetails();
    },[API_URL, id]);

    if (isLoading) {
        return (
            <>
                <Header/>
                <div className="w-screen h-screen bg-black pt-[100px] flex flex-col justify-center items-center">
                    <div className="text-white text-2xl">Loading event details...</div>
                </div>
            </>
        );
    }

    return(
        <>
            <Header/>
            <div className="w-screen bg-black pt-[100px] flex flex-col justify-center items-center p-[20px] gap-[20px]">
                <RequiredEventDetails
                    eventDetails={eventDetails}
                    setEventDetails={setEventDetails}
                    title="Edit Event"
                />
                <OptionalEventDetails
                    eventDetails={eventDetails}
                    setEventDetails={setEventDetails}
                    title="Edit Optional Details"
                />
                <EventPoster
                    eventDetails={eventDetails}
                    setEventDetails={setEventDetails}
                    isLoading={isPosterLoading}
                />
                <Convenors
                    eventDetails={eventDetails}
                    setEventDetails={setEventDetails}
                />
            </div>
            <ToastContainer theme="dark"/>
        </>
    )
}

export default EditEvent;