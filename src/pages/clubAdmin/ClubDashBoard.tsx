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
        <>
            <Header name={name} rollno={rollno} clubname={clubname}/>
            <div className="content-container w-screen p-[20px] flex flex-col justify-start items-center gap-[20px] pt-[100px]">
                <ClubHero clubName={clubname}/>
                <div className="w-7/10 flex flex-row justify-center items-center h-[170px] gap-[10%]
                ">
                    <SubHero title="Create Event" link="/createevent" icon={<Calendar className="w-5 h-5" />}/>
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
        </>
    )
}

export default DashBoard;