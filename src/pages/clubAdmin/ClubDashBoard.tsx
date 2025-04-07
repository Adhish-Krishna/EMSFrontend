import Header from "../../components/Header";
import ClubHero from "../../components/ClubHero";
import {useEffect, useState} from 'react';
import SubHero from "../../components/ClubSubHero";

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
            <div className="w-screen fixed top-[80px] p-[20px] h-screen flex flex-col justify-center items-center gap-[20px]">
                <ClubHero clubName={clubname}/>
                <div className="w-7/10 flex flex-row justify-center items-center h-[170px] gap-[10%]
                ">
                    <SubHero title="Create Event" link="/createevent"/>
                    <SubHero title="Add Club Member" link="/addmember"/>

                </div>
            </div>
        </>
    )
}

export default DashBoard;