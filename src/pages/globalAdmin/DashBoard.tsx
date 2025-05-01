import ClubSubHero from '../../components/ClubSubHero';

const DashBoard = ()=>{

    return(
        <>
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