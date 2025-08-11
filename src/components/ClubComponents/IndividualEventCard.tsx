import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;

export interface Event {
    id: number;
    name: string;
    about: string;
    date: string;
    event_type: string;
    venue: string;
    event_category: string;
    min_no_member: number;
    max_no_member: number;
    chief_guest?: string;
    exp_expense?: number;
    tot_amt_allot_su?: number;
    tot_amt_spt_dor?: number;
    exp_no_aud?: number;
    faculty_obs_desig?: string;
    faculty_obs_dept?: string;
    poster?: string;
}

interface EventCardProps {
    event: Event;
    event_type: 'past' | 'upcoming' | 'ongoing'
}

const EventCard: React.FC<EventCardProps> = ({ event, event_type }) => {
    const navigate = useNavigate();
    const [posterUrl, setPosterUrl] = useState<string | null>(null);
    const [isLoadingPoster, setIsLoadingPoster] = useState<boolean>(false);
    const [posterError, setPosterError] = useState<boolean>(false);

    useEffect(() => {
        const fetchPoster = async () => {
            if (event.poster) {
                setPosterUrl(event.poster);
                return;
            }
            setIsLoadingPoster(true);
            setPosterError(false);
            try {
                const posterResponse = await axios.get(`${API_URL}/event/eventposter?id=${event.id}`, {
                    withCredentials: true,
                    responseType: "blob"
                });
                if (posterResponse.status === 200) {
                    const blob = posterResponse.data;
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        const base64String = reader.result as string;
                        setPosterUrl(base64String);
                        setIsLoadingPoster(false);
                    };
                    reader.onerror = () => {
                        setPosterError(true);
                        setIsLoadingPoster(false);
                    };
                } else {
                    setPosterError(true);
                    setIsLoadingPoster(false);
                }
            } catch (error) {
                setPosterError(true);
                setIsLoadingPoster(false);
            }
        };
        fetchPoster();
    }, [event.id, event.poster]);

    // Fallback image if poster is not available
    const backgroundImage = posterUrl && !posterError
        ? posterUrl
        : "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/92352269270549.5bbd212db17df.gif";

    return (
        <div className="w-full max-w-sm mx-auto rounded-2xl shadow-xl bg-white border border-blue-100 hover:shadow-2xl transition-shadow duration-300 group flex flex-col overflow-hidden">
            {/* Poster */}
            <div className="relative h-48 w-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <img
                    src={backgroundImage}
                    alt={event.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow
                    ${event_type === 'ongoing' ? 'bg-blue-600 text-white' : event_type === 'upcoming' ? 'bg-blue-400 text-white' : 'bg-blue-200 text-blue-900'}`}>
                    {event.event_type.toUpperCase()}
                </span>
            </div>
            {/* Content */}
            <div className="flex flex-col gap-2 p-5 flex-1">
                <h2 className="font-bold text-xl text-blue-900 truncate">{event.name}</h2>
                <p className="text-blue-700 text-sm line-clamp-2">{event.about}</p>
                <div className="flex flex-wrap gap-3 mt-2">
                    <div className="flex items-center gap-1 text-blue-500 text-xs bg-blue-50 px-2 py-1 rounded">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1 text-blue-500 text-xs bg-blue-50 px-2 py-1 rounded">
                        <MapPin className="w-4 h-4" />
                        {event.venue}
                    </div>
                    <div className="flex items-center gap-1 text-blue-500 text-xs bg-blue-50 px-2 py-1 rounded">
                        <Users className="w-4 h-4" />
                        {event.min_no_member} - {event.max_no_member} members
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-blue-400 bg-blue-50 px-2 py-1 rounded">{event.event_category}</span>
                    {event.chief_guest && (
                        <span className="text-xs text-blue-400 bg-blue-50 px-2 py-1 rounded">Chief Guest: {event.chief_guest}</span>
                    )}
                </div>
                {/* Optional: More details */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {event.exp_expense !== undefined && (
                        <span className="text-xs text-blue-400 bg-blue-50 px-2 py-1 rounded">Expected Expense: ₹{event.exp_expense}</span>
                    )}
                    {event.exp_no_aud !== undefined && (
                        <span className="text-xs text-blue-400 bg-blue-50 px-2 py-1 rounded">Audience: {event.exp_no_aud}</span>
                    )}
                </div>
                {/* Button */}
                <button
                    className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                    onClick={() => navigate(`/club/events/${event.id}?type=${event_type}`)}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default EventCard;