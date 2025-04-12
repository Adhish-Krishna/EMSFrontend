import GlobalHeader from "../../components/GlobalHeader";
import ClubSubHero from '../../components/ClubSubHero';

const DashBoard = ()=>{

    // const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;

    return(
        <>
            <GlobalHeader/>
            <div className="w-screen pt-[80px] bg-black flex flex-col pb-[30px] justify-center items-center gap-[20px]">
                <ClubSubHero
                    title="Create Clubs"
                    link="/global/club/create"
                />
                <ClubSubHero
                    title="Add Club Admin"
                    link="/global/club/admin/add"
                />
            </div>
        </>
    )
}

export default DashBoard;