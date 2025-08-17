{/*This the Events Section for the events in the dashboard*/ }

import EventCard from "../EventsCard";
import { useEffect, useState, ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

type EventsProps = {
    sectionType: string;
    sectionTitle: string;
    icon?: ReactNode;
}

interface EventCardDetails{
    id: number;
    name: string;
    about: string;
    date: string;
    venue: string;
    event_type: string;
    event_category: string;
}

const EventSection = ({sectionType, sectionTitle, icon}:EventsProps)=>{
    const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
    const [showRightArrow, setShowRightArrow] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [eventCardDetails, setEventCardDetails] = useState<EventCardDetails[]>([]);
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    useEffect(()=>{
        const fetchEventDetails = async ()=>{
            try{
                setLoading(true)
                const response = await axios.get(`${API_URL}/admin/events?type=${sectionType}`, {
                    withCredentials: true
                });
                if(response.status === 200){
                    setIsError(false);
                    if(response.data.data.length > 0){
                        setIsAvailable(true);
                        setEventCardDetails(response.data.data);
                    }
                    else{
                        setIsAvailable(false);
                    }
                }
            }catch(err: any){
                setIsError(true);
                if(err.response?.status === 400){
                    setError("Invalid event type. Type must be one of: ongoing, past, upcoming, present");
                }
                else if(err.response?.status === 500){
                    setError("Error fetching event Details");
                }
            }finally{
                setLoading(false);
            }

        }
        fetchEventDetails();
    },[API_URL,sectionType])

    return(
        <>
        
            <div className="w-7/10 rounded-[20px] border-1 border-border bg-secondary flex flex-col gap-[20px] p-[20px] transition-all duration-300 hover:border-primary relative responsive-container responsive-p-sm">
                <h1 className="text-white text-[22px] flex items-center gap-2 mb-[10px] responsive-text-md">{icon} {sectionTitle}</h1>
                <div className="flex flex-row w-full relative">
        
                    {showLeftArrow && (
                        <button
                            onClick={scrollLeft}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-tertiary hover:bg-primary transition-all duration-300 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="text-white" />
                        </button>
                    )}

                    <div
                        ref={scrollContainerRef}
                        className="flex flex-row w-full gap-[20px] overflow-x-scroll scroll-smooth no-scrollbar px-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >

                        {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </>
                            ) : isError? (
                                <div className="w-full flex justify-center items-center">
                                    <p className="text-red-400 font-normal text-[20px]">Error{error}</p>
                                </div>
                            ): isAvailable?
                            (
                                <div className="flex flex-row flex-nowrap gap-[20px] min-w-max pl-2 pr-2 responsive-gap-sm">
                                    {
                                        eventCardDetails.map((event)=>{
                                            return(
                                                <EventCard key={event.id} sectionType={sectionType} eventTitle={event.name} description={event.about} type={event.event_type} category={event.event_category} date={event.date.slice(0,10)} venue={event.venue} id={event.id}/>
                                            )
                                        })
                                    }
                                </div>

                        ):
                        (
                            <div className="w-full flex justify-center items-center">
                                <p className="text-red-400 font-normal text-[20px]">No {sectionTitle}</p>
                            </div>
                        )
                    }
                    </div>

                    {showRightArrow && (
                        <button
                            onClick={scrollRight}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-tertiary hover:bg-primary transition-all duration-300 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="text-white" />
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}

export default EventSection;