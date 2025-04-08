import EventCard from "./EventsCard";
import { useEffect, useState, ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type EventsProps = {
    sectionType: string;
    sectionTitle: string;
    eventTitle: string;
    type: string;
    date: string;
    venue: string;
    description: string;
    icon?: ReactNode;
}

const EventSection = ({sectionType, sectionTitle, eventTitle, type, date, venue, description, icon}:EventsProps)=>{
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

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
        //write api calls to fetch the events based on the sectionType and club_id
    },[])

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
                        <div className="flex flex-row flex-nowrap gap-[20px] min-w-max pl-2 pr-2 responsive-gap-sm">
                            <EventCard sectionType={sectionType} eventTitle={eventTitle} type={type} date={date} venue={venue} description={description}/>
                            <EventCard sectionType={sectionType} eventTitle={eventTitle} type={type} date={date} venue={venue} description={description}/>
                            <EventCard sectionType={sectionType} eventTitle={eventTitle} type={type} date={date} venue={venue} description={description}/>
                            <EventCard sectionType={sectionType} eventTitle={eventTitle} type={type} date={date} venue={venue} description={description}/>
                            <EventCard sectionType={sectionType} eventTitle={eventTitle} type={type} date={date} venue={venue} description={description}/>
                            <EventCard sectionType={sectionType} eventTitle={eventTitle} type={type} date={date} venue={venue} description={description}/>
                        </div>
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