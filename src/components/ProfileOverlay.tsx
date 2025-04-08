import { LogOut, User, BookUser, Building } from "lucide-react";

type ProfileOverlayProps = {
    name: string;
    rollno: string;
    clubname: string;
}

const ProfileOverlay = ({name, rollno, clubname}: ProfileOverlayProps)=>{

    const handleLogout = ()=>{
        //handle the logout logic here (remove cookies 🍪)
    }

    return(
        <>
            <div className="w-[280px] bg-secondary border-1 border-border p-[20px] flex flex-col justify-center items-center gap-[15px] rounded-[10px] z-[1000] shadow-lg animate-fadeIn overflow-hidden responsive-p-sm">
                <div className="w-[60px] h-[60px] rounded-full bg-tertiary flex items-center justify-center border-2 border-primary mb-2">
                    <User size={30} className="text-primary" />
                </div>
                {name &&
                    <div className="flex items-center gap-2 w-full transition-all duration-300 hover:bg-tertiary p-2 rounded-md">
                        <User size={16} className="text-primary" />
                        <p className='text-[15px] text-white responsive-text-sm'>{name}</p>
                    </div>
                }
                {rollno &&
                    <div className="flex items-center gap-2 w-full transition-all duration-300 hover:bg-tertiary p-2 rounded-md">
                        <BookUser size={16} className="text-primary" />
                        <p className='text-[15px] text-white responsive-text-sm'>{rollno}</p>
                    </div>
                }
                {clubname &&
                    <div className="flex items-center gap-2 w-full transition-all duration-300 hover:bg-tertiary p-2 rounded-md">
                        <Building size={16} className="text-primary" />
                        <p className='text-[15px] text-white truncate responsive-text-sm'>{clubname}</p>
                    </div>
                }
                <button
                    className="bg-primary w-full h-[36px] rounded-[10px] text-white text-[14px] cursor-pointer hover:bg-[#02b700] transition-all duration-300 flex items-center justify-center gap-2 mt-2 hover:shadow-[0_0_10px_rgba(3,154,0,0.5)]"
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </>
    )
}

export default ProfileOverlay;