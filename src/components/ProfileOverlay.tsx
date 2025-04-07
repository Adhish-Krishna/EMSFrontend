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
            <div className="w-[150px] bg-[#141414] border-1 border-[#4E4E4E] p-[20px] flex flex-col justify-center items-center gap-[15px] rounded-[10px] z-[1000]">
                {name && <p className='text-[12px] text-white text-center'>{name}</p>}
                {rollno && <p className='text-[12px] text-white text-center'>{rollno}</p>}
                {clubname && <p className='text-[12px] text-white text-center'>{clubname}</p>}
                <button className="bg-[#039A00] w-[70px] h-[30px] rounded-[10px] text-white text-[12px] cursor-pointer hover:w-[72px] hover:h-[32px]" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </>
    )
}

export default ProfileOverlay;