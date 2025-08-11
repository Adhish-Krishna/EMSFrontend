import Avatar from '../assets/Generic avatar.png';
import CSEALogo from '../assets/csea.png';
import PSGLogo from '../assets/psg.png';
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
            <div className="w-screen h-[70px] glass-morphism flex justify-between px-6 py-4 border-b border-border/30 items-center fixed top-0 left-0 right-0 z-50 transition-all duration-300 hover:border-b-primary/50 responsive-p-sm">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <img src={PSGLogo} alt="PSG Logo" className="h-10 w-10 object-contain" />
                        <img src={CSEALogo} alt="CSEA Logo" className="h-12 w-12 object-cover rounded-full border border-gray-200" />
                    </div>
                    <h1 className='text-2xl font-bold text-gradient responsive-text-md'>Event Management System</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:bg-white/10 p-3 rounded-xl glass-morphism-light"
                        onClick={handleProfileClick}
                    >
                        <img src={Avatar} alt="Profile" className="h-8 w-8 rounded-full border-2 border-transparent hover:border-primary transition-all duration-300" />
                        <ChevronDown className={`text-white w-4 h-4 transition-transform duration-300 ${ispressed ? 'rotate-180' : ''} responsive-hidden-xs`} />
                    </button>
                </div>
            </div>
            {ispressed && (
                <div className='fixed top-[70px] right-4 z-[1000] animate-slide-up'>
                    <ProfileOverlay/>
                </div>
            )}
        </>
    )
}

export default Header;