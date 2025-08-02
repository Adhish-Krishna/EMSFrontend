import { useClubContext } from "../../layout/ClubAdminLayout";
const ClubHero = ()=>{
    const club = useClubContext()
    const clubprofile = club?.clubprofile
    return(
        <>
        <div className="w-7/10 flex justify-center items-center card bg-gradient-to-br from-primary/15 via-black/60 to-accent/10 h-[160px] p-8 group responsive-container">
                <div className="flex items-center gap-3">
                    <p className="text-white text-4xl text-center font-bold text-gradient group-hover:text-glow transition-all duration-300 responsive-text-lg">
                        {`${clubprofile?.club || 'club name'}`}
                    </p>
                </div>
            </div>
        </>
    )
}

export default ClubHero;