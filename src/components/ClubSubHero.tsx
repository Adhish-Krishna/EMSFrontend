import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

type SubHeroProps = {
    title: string;
    link: string;
}


const SubHero = ({title, link}: SubHeroProps)=>{

    const navigate = useNavigate();

    const handleClick = ()=>{
        navigate(`${link}`);
    }

    return(
        <>
            <div className="w-45/100 h-[150px] border-1 border-[#4E4E4E] rounded-[20px] bg-[radial-gradient(circle_at_left_bottom,_#002F2B_10%,_#000000_40%,_#000000_70%)] flex flex-col justify-center items-center gap-[20px]
        ">
            <p className="text-white text-[25px] font-medium">{title}</p>
            <button className="bg-[#039A00] rounded-[10px] h-[45px] p-[10px] text-center text-white cursor-pointer flex flex-row gap-[2px]" onClick={handleClick}>
                <Plus/>
                {title}
            </button>
            </div>
        </>
    )
}

export default SubHero;