import ClubHero from "../../components/ClubComponents/ClubHero";
// import {useEffect} from 'react';
import SubHero from "../../components/ClubSubHero";
import EventSection from "../../components/ClubComponents/EventsSection";
import { Calendar, Users, Activity } from "lucide-react";

const ClubDashBoard = ()=>{

    return(
        <div className="flex flex-col min-h-screen w-full">
            <div style={{ marginTop: '100px' }} className="content-container w-screen p-5 flex flex-col justify-start items-center gap-[20px] responsive-p-sm">
                <ClubHero/>
                <div className="w-7/10 flex flex-row justify-center items-center h-[170px] gap-[10%] responsive-container responsive-flex-col responsive-h-auto responsive-gap-sm responsive-mb-sm">
                    <SubHero title="Create Event" link="/club/event/create" icon={<Calendar className="w-5 h-5" />}/>
                    <SubHero title="Add Club Member" link="/club/member/add" icon={<Users className="w-5 h-5" />}/>
                </div>
                <EventSection
                    sectionType="ongoing"
                    sectionTitle="On going Events"
                    icon={<Activity className="text-blue-600 w-5 h-5" />}
                />
                <EventSection
                    sectionType="upcoming"
                    sectionTitle="Upcoming Events"
                    icon={<Calendar className="text-blue-600 w-5 h-5" />}
                />
                <EventSection
                    sectionType="past"
                    sectionTitle="Past Events"
                    icon={<Calendar className="text-blue-600 w-5 h-5 opacity-70" />}
                />
            </div>
        </div>
    )
}

export default ClubDashBoard;