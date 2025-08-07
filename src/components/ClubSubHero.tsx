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
            <div className="w-45/100 h-[160px] card bg-gradient-to-br from-blue-50 via-white to-blue-25 flex flex-col justify-center items-center gap-6 group cursor-pointer responsive-w-full responsive-h-auto responsive-p-sm">
                <p className="text-slate-800 text-2xl font-bold flex items-center gap-3 text-center responsive-text-md group-hover:text-gradient transition-all duration-300">
                    {icon}
                    {title}
                </p>
                <button
                    className="btn-primary text-white cursor-pointer flex flex-row items-center gap-2 font-semibold"
                    onClick={handleClick}
                >
                    <Plus size={20} />
                    {title}
                </button>
            </div>
        </>
    )
}

export default SubHero;