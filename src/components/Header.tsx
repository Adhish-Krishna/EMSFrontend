import Avatar from '../assets/Generic avatar.png';
import ProfileOverlay from './ProfileOverlay';
import {useState} from 'react';
import { ChevronDown } from 'lucide-react';

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
            <div className="w-screen h-[70px] bg-[#000] flex justify-between p-[20px] border-b-1 border-border items-center fixed z-50 transition-all duration-300 hover:border-b-primary">
                <div className="flex items-center gap-3">
                    <h1 className='text-[1.5rem] text-primary font-medium'>EMS - Admin Portal</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:bg-tertiary p-2 rounded-full"
                        onClick={handleProfileClick}
                    >
                        <img src={Avatar} alt="Profile" className="h-[30px] rounded-full border-2 border-transparent hover:border-primary transition-all duration-300" />
                        <ChevronDown className={`text-white w-4 h-4 transition-transform duration-300 ${ispressed ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
            {ispressed && (
                <div className='fixed top-[70px] right-4 z-[1000]'>
                    <ProfileOverlay name={name} rollno={rollno} clubname={clubname}/>
                </div>
            )}
        </>
    )
}

export default Header;