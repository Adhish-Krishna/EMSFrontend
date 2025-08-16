{/*Removed subhero, if its ok should delete that component*/}

import ClubHero from "../../components/ClubComponents/ClubHero";
// import {useEffect} from 'react';
import SubHero from "../../components/ClubSubHero";
import EventSection from "../../components/ClubComponents/EventsSection";
import { Calendar, Users, Activity } from "lucide-react";

const ClubDashBoard = ()=>{

    return(
        <div className="flex flex-col min-h-screen w-full">
            <div style={{ marginTop: '75px' }}  className="w-full max-w-75xl mx-auto p-5 flex flex-col justify-start items-center gap-[20px] responsive-p-sm">
                <ClubHero/>
                <div className="w-7/10 flex flex-row justify-center items-center responsive-container responsive-flex-col responsive-h-auto responsive-gap-sm responsive-mb-sm">
                    
                </div>
                <EventSection
                    sectionType="ongoing"
                    sectionTitle="On going Events"
                    icon={<Activity className="text-primary w-5 h-5" />}
                />
                <EventSection
                    sectionType="upcoming"
                    sectionTitle="Upcoming Events"
                    icon={<Calendar className="text-primary w-5 h-5" />}
                />
                <EventSection
                    sectionType="past"
                    sectionTitle="Past Events"
                    icon={<Calendar className="text-primary w-5 h-5 opacity-70" />}
                />
            </div>
        </div>
    )
}

export default ClubDashBoard;