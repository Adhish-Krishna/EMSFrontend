import Header from "../../components/Header";
import ClubHero from "../../components/ClubHero";
import {useEffect, useState} from 'react';
import SubHero from "../../components/ClubSubHero";
import EventSection from "../../components/EventsSection";
import { Calendar, Users, Activity } from "lucide-react";

const DashBoard = ()=>{
    const [name, setName] = useState('Adhish'); //setting default values for testing the components
    const [rollno, setRollNo] = useState('23N206');
    const [clubname, setClubName] = useState('Computer Science and Engineering Association');

    useEffect(()=>{
        //write api call here to fetch the name, rollno and club name of the admin
    }, []);

    return(
        <div className="flex flex-col min-h-screen w-full">
            <Header name={name} rollno={rollno} clubname={clubname}/>
            <div style={{ marginTop: '100px' }} className="content-container w-screen p-[20px] flex flex-col justify-start items-center gap-[20px] responsive-p-sm">
                <ClubHero clubName={clubname}/>
                <div className="w-7/10 flex flex-row justify-center items-center h-[170px] gap-[10%] responsive-container responsive-flex-col responsive-h-auto responsive-gap-sm responsive-mb-sm">
                    <SubHero title="Create Event" link="/event/create" icon={<Calendar className="w-5 h-5" />}/>
                    <SubHero title="Add Club Member" link="/addmember" icon={<Users className="w-5 h-5" />}/>
                </div>
                <EventSection
                    sectionType="ongoing"
                    sectionTitle="On going Events"
                    eventTitle="Codopoly"
                    date="09-03-2025"
                    venue="E-Block Third Floor"
                    type="Coding"
                    description="Codopoly is an exciting coding event ..."
                    icon={<Activity className="text-primary w-5 h-5" />}
                />
                <EventSection
                    sectionType="upcoming"
                    sectionTitle="Upcoming Events"
                    eventTitle="Codopoly"
                    date="09-03-2025"
                    venue="E-Block Third Floor"
                    type="Coding"
                    description="Codopoly is an exciting coding event ..."
                    icon={<Calendar className="text-primary w-5 h-5" />}
                />
                <EventSection
                    sectionType="past"
                    sectionTitle="Past Events"
                    eventTitle="Code Wars"
                    date="15-04-2025"
                    venue="CS Seminar Hall"
                    type="Competition"
                    description="Code Wars is a competitive programming challenge..."
                    icon={<Calendar className="text-primary w-5 h-5 opacity-70" />}
                />
            </div>
        </div>
    )
}

export default DashBoard;