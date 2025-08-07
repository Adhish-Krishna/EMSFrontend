import ClubHero from "../../components/ClubComponents/ClubHero";
// import {useEffect} from 'react';
import SubHero from "../../components/ClubSubHero";
import EventSection from "../../components/ClubComponents/EventsSection";
import { Calendar, Users, Activity } from "lucide-react";

const ClubDashBoard = ()=>{

    return(
        <div className="flex flex-col min-h-screen w-full bg-slate-50 text-black">
            <div style={{ marginTop: '100px' }} className="content-container w-screen p-5 flex flex-col justify-start items-center gap-[20px] responsive-p-sm">
                <div className="w-full max-w-4xl flex flex-col gap-[20px]">
                    <div className="bg-white rounded-[10px] shadow border border-gray-200 p-6">
                        <ClubHero/>
                    </div>
                    <div className="bg-white rounded-[10px] shadow border border-gray-200 p-6 flex flex-row justify-center items-center h-[170px] gap-[10%] responsive-container responsive-flex-col responsive-h-auto responsive-gap-sm responsive-mb-sm">
                        <SubHero title="Create Event" link="/club/event/create" icon={<Calendar className="w-5 h-5 text-blue-600" />}/>
                        <SubHero title="Add Club Member" link="/club/member/add" icon={<Users className="w-5 h-5 text-blue-600" />}/>
                    </div>
                    <div className="bg-white rounded-[10px] shadow border border-gray-200 p-6">
                        <EventSection
                            sectionType="ongoing"
                            sectionTitle="On going Events"
                            icon={<Activity className="text-blue-600 w-5 h-5" />}
                        />
                    </div>
                    <div className="bg-white rounded-[10px] shadow border border-gray-200 p-6">
                        <EventSection
                            sectionType="upcoming"
                            sectionTitle="Upcoming Events"
                            icon={<Calendar className="text-blue-600 w-5 h-5" />}
                        />
                    </div>
                    <div className="bg-white rounded-[10px] shadow border border-gray-200 p-6">
                        <EventSection
                            sectionType="past"
                            sectionTitle="Past Events"
                            icon={<Calendar className="text-blue-600 w-5 h-5 opacity-70" />}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClubDashBoard;