type ClubHeroProps = {
    clubName: string;
}

const ClubHero = ({clubName}: ClubHeroProps)=>{
    return(
        <>
            <div className="w-7/10 flex justify-center items-center border-1 border-[#4E4E4E] bg-[radial-gradient(circle_at_left_bottom,_#002F2B_10%,_#000000_40%,_#000000_70%)] h-[150px] p-[20px] rounded-[20px]
            ">
                <p className="text-white text-3xl text-center font-medium">{clubName}</p>
            </div>
        </>
    )
}

export default ClubHero;