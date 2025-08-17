import { EventDetailsProps } from "./RequiredEventDetails";

const OptionalEventDetails = ({eventDetails, setEventDetails, title}: EventDetailsProps)=>{
    return(
        <>
            <div className="w-7/10 border-border border-1 bg-secondary p-[20px] flex flex-col justify-center items-center gap-[10px] rounded-[20px]">
                <p className="text-primary text-[24px] mb-[10px] font-medium">{title}</p>
                <div className='w-8/10 flex flex-row justify-between items-start'>
                    <div className="w-45/100 flex flex-col gap-[20px]">
                        <input
                            type="text"
                            placeholder='Chief Guest (with address)'
                            value={eventDetails.chief_guest}
                            onChange={(e)=>{setEventDetails({...eventDetails, chief_guest: e.target.value})}}
                            className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                        />
                        <input
                            type="number"
                            placeholder = 'Expected Expense'
                            value={eventDetails.exp_expense}
                            onChange={(e)=>{setEventDetails({...eventDetails, exp_expense: parseInt(e.target.value)})}}
                            className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border " 

                        />
                        <input
                            type="number"
                            placeholder = 'Total amount allotted by Students Union'
                            value={eventDetails.tot_amt_allot_su}
                            onChange={(e)=>{setEventDetails({...eventDetails, tot_amt_allot_su: parseInt(e.target.value)})}}
                            className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"

                        />
                    </div>
                    <div className="w-45/100 flex flex-col gap-[20px]">
                        <input
                            type="number"
                            placeholder = 'Expected no of Audience / Participants'
                            value={eventDetails.exp_no_aud}
                            onChange={(e)=>{setEventDetails({...eventDetails, exp_no_aud: parseInt(e.target.value)})}}
                            className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"

                        />
                        <input
                            type="text"
                            placeholder = 'Faculty Observer with Designation'
                            value={eventDetails.faculty_obs_desig}
                            onChange={(e)=>{setEventDetails({...eventDetails, faculty_obs_desig:e.target.value})}}
                            className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"

                        />
                        <input
                            type="text"
                            placeholder = 'Faculty Observer Department'
                            value={eventDetails.faculty_obs_dept}
                            onChange={(e)=>{setEventDetails({...eventDetails, faculty_obs_dept:e.target.value})}}
                            className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"

                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default OptionalEventDetails;