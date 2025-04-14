import Avatar from '../assets/Generic avatar.png';
import ProfileOverlay from './ProfileOverlay';
import {useState, useEffect} from 'react';
import { ChevronDown} from 'lucide-react';

const Header = ()=>{
    const [ispressed, setIsPressed] = useState(false);

    const handleProfileClick = ()=>{
        if(ispressed){
            setIsPressed(false);
        }else{
            setIsPressed(true);
        }
    }

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--header-height', '70px');
    }, []);

    return(
        <>
            <div className="w-screen h-[70px] bg-[#000] flex justify-between p-[20px] border-b-1 border-border items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300 hover:border-b-primary responsive-p-sm">
                <div className="flex items-center gap-3">
                    <h1 className='text-[1.5rem] text-primary font-medium responsive-text-md'>EMS - Admin Portal</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:bg-tertiary p-2 rounded-full"
                        onClick={handleProfileClick}
                    >
                        <img src={Avatar} alt="Profile" className="h-[30px] rounded-full border-2 border-transparent hover:border-primary transition-all duration-300" />
                        <ChevronDown className={`text-white w-4 h-4 transition-transform duration-300 ${ispressed ? 'rotate-180' : ''} responsive-hidden-xs`} />
                    </button>
                </div>
            </div>
            {ispressed && (
                <div className='fixed top-[70px] right-4 z-[1000]'>
                    <ProfileOverlay/>
                </div>
            )}
        </>
    )
}

export default Header;