
import { Event } from '../pages/clubAdmin/EventsPage'
import { useQuery } from '@tanstack/react-query';
import { getDatawithRefreshToken } from '../utils/customFetch';

interface eventResponse {
    message:string;
    data:Event[]
}

interface SingleEventResponse {
    message:string;
    data:Event;
}

const fetchEventsWithType = (type:string) => {
    return async () : Promise<Event[]> => {
        const getData = await getDatawithRefreshToken<eventResponse>("admin")
        const data = await getData(`admin/events?type=${type}`)
        console.log(data.data)
        return data.data;
    }
}

const fetchSingleEvent = (event_id:string) => {
    return async () : Promise<Event> => {
        const getData = await getDatawithRefreshToken<SingleEventResponse>("admin")
        const data = await getData(`event/eventdetails?id=${event_id}`)
        return data.data
    }
}


export default function useEvents({type}:{type:string}) {
    return useQuery<Event[],Error>({
        queryKey:[`${type}events`],
        queryFn:fetchEventsWithType(type),
    })
}

export function useSingleEvent ({event_id}:{event_id?:string}){
    return useQuery<Event,Error>({
        queryKey:['getEvent',event_id],
        queryFn:fetchSingleEvent(event_id!),
        enabled:!!event_id
    })
}
