import Avatar from '../assets/Generic avatar.png';
import ProfileOverlay from './ProfileOverlay';
import {useState} from 'react';

type HeaderProps = {
    name: string;
    rollno: string;
    clubname: string;
}


const Header = ({name, rollno, clubname}: HeaderProps)=>{
    const [ispressed, setIsPressed] = useState(false);

    const handleProfileClick = ()=>{
        if(ispressed){
            setIsPressed(false);
        }else{
            setIsPressed(true);
        }
    }
    return(
        <>
            <div className="w-screen h-[70px] bg-[#000] flex justify-between p-[20px] border-b-1 border-[#4E4E4E] items-center fixed">
                <h1 className='text-[1.5rem] text-[#039A00] font-medium'>EMS - Admin Portal</h1>
                <button className="cursor-pointer" onClick={handleProfileClick}>
                    <img src={Avatar} alt="" className="h-[30px]" />
                </button>
            </div>
            {ispressed && (
                <div className='fixed top-[75px] right-4 z-[1000]'>
                    <ProfileOverlay name = {name} rollno={rollno} clubname={clubname}/>
                </div>
            )}
        </>
    )
}

export default Header;