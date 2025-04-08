import Edit from '../assets/edit.png';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, Info } from 'lucide-react';

type EventCardProps = {
    sectionType: string;
    eventTitle: string;
    date: string;
    type: string;
    venue: string;
    description: string;
}

const EventCard = ({sectionType, eventTitle, date, type, venue, description}:EventCardProps)=>{

    const navigate  = useNavigate();

    const handleClick = ()=>{
        navigate(`/edit/?type=${sectionType}`);
    }

    return(
        <>
            <div className="bg-tertiary border-1 border-border rounded-[20px] p-[20px] flex flex-col justify-start gap-[10px] w-[250px] transition-all duration-300 hover:border-primary hover:shadow-[0_0_15px_rgba(3,154,0,0.2)] transform hover:-translate-y-1 mb-[10px] mt-[10px] responsive-p-sm responsive-card-width">
                <div className="flex w-full flex-row justify-between">
                    <p className="text-white text-[20px] font-medium responsive-text-md">{eventTitle}</p>
                    <button
                        onClick={handleClick}
                        className="transition-transform duration-300 hover:rotate-12 hover:scale-110"
                    >
                        <img src={Edit} alt="Edit" className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-primary text-[16px] flex items-center gap-2 responsive-text-sm">
                    <Tag size={16} className="text-primary" />
                    <span>{type}</span>
                </p>
                <p className="text-primary text-[16px] flex items-center gap-2 responsive-text-sm">
                    <Calendar size={16} className="text-primary" />
                    <span>{date}</span>
                </p>
                <p className="text-primary text-[16px] flex items-center gap-2 responsive-text-sm">
                    <MapPin size={16} className="text-primary" />
                    <span>{venue}</span>
                </p>
                <p className="text-white text-[16px] flex items-start gap-2 responsive-text-sm">
                    <Info size={16} className="text-white mt-1" />
                    <span>{description}</span>
                </p>
            </div>
        </>
    )
}
export default EventCard;