import {useState} from 'react';
import RequiredEventDetails from '../../components/RequiredEventDetails';
import Header from '../../components/Header';
import OptionalEventDetails from '../../components/OptionalEventDetails';
import Convenors from '../../components/Convenors';

export type EventDetails = {
    name: string;
    about: string;
    date: string;
    event_type: string;
    venue: string;
    event_category: string;
    min_no_member: string;
    max_no_member: string;
    chief_guest?: string;
    exp_expense?: number;
    tot_amt_allot_su?: number;
    tot_amt_spt_dor?: number;
    exp_no_aud?: number;
    faculty_obs_desig?: string;
    faculty_obs_dept?: string;
}

export type EventConvenors = {
    rollno: string;
    clubName: string;
}

const CreateEvent = ()=>{

    const event_details : EventDetails = {
        name: "",
        about: "",
        date: "",
        event_type: "",
        venue: "",
        event_category: "",
        min_no_member: "",
        max_no_member: "",
        chief_guest: "",
        exp_expense: undefined,
        tot_amt_allot_su: undefined,
        tot_amt_spt_dor: undefined,
        exp_no_aud: undefined,
        faculty_obs_desig: undefined,
        faculty_obs_dept: undefined,
    }

    const event_convenor_details: EventConvenors[] = [];

    // In a real application, these would come from authentication context or API
    const userData = {
        name: "Admin User",
        rollno: "CS21BXXX",
        clubname: "Computer Science Engineering Association"
    };

    const [eventDetails, setEventDetails] = useState(event_details);
    const [convenorDetails, setConvenorDetails] = useState(event_convenor_details);

    return(

        <>
            <Header
                name={userData.name}
                rollno={userData.rollno}
                clubname={userData.clubname}
            />
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
                <Convenors
                    convenorDetails={convenorDetails}
                    setConvenorDetails={setConvenorDetails}
                />
                <button className="bg-primary text-white px-4 py-2 rounded-[10px] hover:bg-opacity-80" >
                    Publish
                </button>
            </div>
        </>
    )
}

export default CreateEvent;