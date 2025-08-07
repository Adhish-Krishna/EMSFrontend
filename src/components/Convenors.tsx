import {useState} from 'react';
import { EventDetails } from '../pages/clubAdmin/CreateEvent';
import { Dispatch, SetStateAction } from 'react';

interface EventConvenorProps{
    eventDetails: EventDetails;
    setEventDetails: Dispatch<SetStateAction<EventDetails>>;
}

const Convenors = ({eventDetails, setEventDetails}:EventConvenorProps)=>{

    const [rollNo, setRollNo] = useState('');

    const handleAddConvenor = () => {
        if (rollNo) {
            setEventDetails({...eventDetails, eventConvenors: [...eventDetails.eventConvenors, rollNo.toLowerCase()]})
            // Reset form fields after adding
            setRollNo('');
        }
    };

    return(
        <>
            <div className="w-7/10 border-slate-200 border-1 bg-white p-[20px] flex flex-col justify-center items-center gap-[10px] rounded-[20px]">
                <p className="text-slate-800 text-[22px] mb-[10px] font-medium">Add Event Convenors</p>
                <div className="w-8/10 flex flex-col justify-center items-center">
                    <input
                        type="text"
                        placeholder = 'Roll No'
                        value={rollNo}
                        onChange={(e)=> setRollNo(e.target.value)}
                        className="w-45/100 p-2 rounded-[10px] bg-slate-50 text-slate-800 border-1 border-slate-200"
                        required
                    />
                    <button
                        onClick={handleAddConvenor}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-[10px] hover:bg-opacity-80 cursor-pointer"
                    >
                        Add Convenor
                    </button>
                </div>

                {eventDetails.eventConvenors.length > 0 && (
                    <div className="w-7/10 mt-4 flex flex-col">
                        <h3 className="text-slate-800 text-[18px]">Added Convenors:</h3>
                        <div className="mt-2">
                            {eventDetails.eventConvenors.map((rollno, index) => (
                                <div key={index} className="flex justify-between items-center p-[10px] border-1 border-slate-200 bg-slate-50 rounded-[10px] mb-[10px]">
                                    <div>
                                        <span className="text-slate-800">Roll No: {rollno}</span>
                                    </div>
                                    <button
                                        className="text-red-500 hover:text-red-300 cursor-pointer"
                                        onClick={()=>setEventDetails({...eventDetails, eventConvenors: eventDetails.eventConvenors.filter((_, i) => i !== index)})}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Convenors;