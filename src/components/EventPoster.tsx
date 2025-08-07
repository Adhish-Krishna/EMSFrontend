import { EventDetails } from "../pages/clubAdmin/CreateEvent";
import { Dispatch, SetStateAction } from "react";

interface EventPosterProps{
    eventDetails: EventDetails;
    setEventDetails: Dispatch<SetStateAction<EventDetails>>;
    isLoading?: boolean; // Add optional loading prop
}

const EventPoster = ({eventDetails, setEventDetails, isLoading = false}: EventPosterProps)=>{

    const handleImageUpload = (files: FileList | null)=>{
        if(files){
            const file = files[0];
            setEventDetails({...eventDetails, poster: file});
        }
    }

    return(
        <>
            <div className="w-7/10 bg-white border-1 border-slate-200 rounded-[20px] flex justify-center items-center p-[20px] flex-col gap-[20px]">
                <p className="text-slate-800 font-medium text-[22px]">Add Event Poster</p>
                <label className="relative w-full max-w-md overflow-hidden cursor-pointer flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed border-slate-300 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-slate-50/60 hover:bg-slate-50/80">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-slate-400 group-hover:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-slate-500">PNG, JPG or JPEG (Max 2MB)</p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e)=>handleImageUpload(e.target.files)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </label>

                {isLoading ? (
                    <div className="mt-4 p-2 border border-slate-300 rounded-lg h-64 w-full max-w-md flex items-center justify-center">
                        <div className="text-slate-800">Loading poster...</div>
                    </div>
                ) : eventDetails.poster ? (
                    <div className="mt-4 p-2 border border-slate-300 rounded-lg">
                        <img src={
                        eventDetails.poster instanceof File || eventDetails.poster instanceof Blob
                        ? URL.createObjectURL(eventDetails.poster)
                        : (typeof eventDetails.poster === "string" ? eventDetails.poster : "")
                        } alt="Event poster preview" className="max-h-64 object-contain rounded" />
                    </div>
                ) : null}

                {
                    eventDetails.poster && !isLoading && <button className="p-10px bg-red-600 rounded-[10px] text-white text-[16px] h-[40px] w-[150px] cursor-pointer" onClick={()=>setEventDetails({...eventDetails, poster: null})}>
                    Remove poster
                    </button>
                }
            </div>
        </>
    )
}

export default EventPoster;