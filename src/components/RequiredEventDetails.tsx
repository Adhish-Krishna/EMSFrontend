import { EventDetails } from "../pages/clubAdmin/CreateEvent";
import { Dispatch, SetStateAction } from 'react';

export interface EventDetailsProps {
  eventDetails: EventDetails;
  setEventDetails: Dispatch<SetStateAction<EventDetails>>;
  title: string;
}

const RequiredEventDetails = ({eventDetails, setEventDetails, title}: EventDetailsProps)=>{
    return(
        <>
            <div className="w-7/10  border-border border-1 bg-secondary p-[20px] flex flex-col justify-center items-center gap-[10px] rounded-[20px]">
                <p className="text-white text-[22px] mb-[10px] font-medium">{title}</p>
                <div className='w-8/10 flex flex-row justify-between items-center'>
                    <div className="w-45/100 flex flex-col gap-[20px]">
                        <input
                            type="text"
                            placeholder='Event Name'
                            value={eventDetails.name}
                            onChange={(e)=>{setEventDetails({...eventDetails, name: e.target.value})}}
                            className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                            required
                        />
                        <input
                            type="text"
                            placeholder='Event Type'
                            value={eventDetails.event_type}
                            onChange={(e)=>{setEventDetails({...eventDetails, event_type: e.target.value})}}
                            className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                            required
                        />
                        <input
                            type="text"
                            placeholder='Event Category'
                            value={eventDetails.event_category}
                            onChange={(e)=>{setEventDetails({...eventDetails, event_category: e.target.value})}}
                            className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                            required
                        />
                    </div>
                    <div className="w-45/100 flex flex-col gap-[20px]">
                        <input
                            type="text"
                            placeholder='Venue'
                            value={eventDetails.venue}
                            onChange={(e)=>{setEventDetails({...eventDetails, venue: e.target.value})}}
                            className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                            required
                        />
                        <input
                            type="date"
                            value={eventDetails.date}
                            onChange={(e) => {
                                setEventDetails({
                                    ...eventDetails, 
                                    date: e.target.value // This automatically gives you YYYY-MM-DD format as string
                                })
                            }}
                            className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                            required
                        />
                        <div className="w-full flex flex-row justify-between items-center gap-[20px]">
                            <input
                                type="number"
                                placeholder='Min Member'
                                value={eventDetails.min_no_member}
                                onChange={(e)=>{setEventDetails({...eventDetails, min_no_member: parseInt(e.target.value)})}}
                                className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                                required
                            />
                            <input
                                type="number"
                                placeholder='Max Member'
                                value={eventDetails.max_no_member}
                                onChange={(e)=>{setEventDetails({...eventDetails, max_no_member: parseInt(e.target.value)})}}
                                className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="w-8/10 flex flex-row justify-center items-center mt-[20px]">
                    <textarea
                        placeholder='About the Event'
                        value={eventDetails.about}
                        onChange={(e)=>{setEventDetails({...eventDetails, about: e.target.value})}}
                        className="w-full p-3 rounded-[10px] bg-tertiary text-white border-1 border-border min-h-[100px] resize-y"
                        required
                    />
                </div>
            </div>
        </>
    )
}

export default RequiredEventDetails;