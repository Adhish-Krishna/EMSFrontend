import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { ReactNode } from "react";

type SubHeroProps = {
    title: string;
    link: string;
    icon?: ReactNode;
}


const SubHero = ({title, link, icon}: SubHeroProps)=>{

    const navigate = useNavigate();

    const handleClick = ()=>{
        navigate(`${link}`);
    }

    return(
        <>
            <div className="w-45/100 h-[150px] border-1 border-border rounded-[20px] bg-[radial-gradient(circle_at_left_bottom,_#002F2B_10%,_#000000_40%,_#000000_70%)] flex flex-col justify-center items-center gap-[20px] transition-all duration-300 hover:border-primary hover:shadow-[0_0_15px_rgba(3,154,0,0.3)]
        ">
            <p className="text-white text-[25px] font-medium flex items-center gap-2">
                {icon}
                {title}
            </p>
            <button
                className="bg-primary rounded-[10px] h-[45px] p-[10px] text-center text-white cursor-pointer flex flex-row items-center gap-[5px] transition-all duration-300 hover:bg-[#02b700] hover:shadow-[0_0_10px_rgba(3,154,0,0.5)] transform hover:translate-y-[-2px]"
                onClick={handleClick}
            >
                <Plus size={18} />
                {title}
            </button>
            </div>
        </>
    )
}

export default SubHero;