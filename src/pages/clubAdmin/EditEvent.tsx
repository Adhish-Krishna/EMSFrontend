import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import Header from "../../components/ClubHeader";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { EventDetails } from "./CreateEvent";

const EditEvent = () => {
    const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const [eventDetails, setEventDetails] = useState<EventDetails>({
        name: "",
        about: "",
        date: "",
        event_type: "",
        venue: "",
        event_category: "",
        min_no_member: undefined,
        max_no_member: undefined,
        chief_guest: "",
        poster: null,
        exp_expense: undefined,
        tot_amt_allot_su: undefined,
        tot_amt_spt_dor: undefined,
        exp_no_aud: undefined,
        faculty_obs_desig: undefined,
        faculty_obs_dept: undefined,
        eventConvenors: [],
    });
// Add these states after line 35, with other state declarations
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [isUpdatingPoster, setIsUpdatingPoster] = useState(false);
    const [showPosterUpload, setShowPosterUpload] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<any>("");
    const [updatingField, setUpdatingField] = useState<string | null>(null);
    
    // New states for convenor management
    const [newConvenorRoll, setNewConvenorRoll] = useState("");
    const [isAddingConvenor, setIsAddingConvenor] = useState(false);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${API_URL}/event/eventdetails?id=${id}`, {
                    withCredentials: true
                });
                
                if (response.status === 200) {
                    const eventData: EventDetails = response.data.data;
                    eventData.date = eventData.date.slice(0, 10);
                    setEventDetails(eventData);

                    // Fetch poster
                    try {
                        const posterResponse = await axios.get(`${API_URL}/event/eventposter?id=${id}`, {
                            withCredentials: true,
                            responseType: "blob"
                        });

                        if (posterResponse.status === 200) {
                            const blob = posterResponse.data;
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = () => {
                                const base64String = reader.result as string;
                                setEventDetails(prev => ({
                                    ...prev,
                                    poster: base64String
                                }));
                            };
                        }
                    } catch (posterErr) {
                        console.error("Error fetching poster:", posterErr);
                    }
                }
            } catch (err: any) {
                toast.error("Issue in fetching event details", {
                    position: "bottom-right",
                    autoClose: 3000,
                    theme: "dark"
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchEventDetails();
    }, [API_URL, id]);

    const handleEditClick = (fieldName: string, currentValue: any) => {
        setEditingField(fieldName);
        setTempValue(currentValue || "");
    };

    const handleSaveField = async (fieldName: string) => {
        try {
            setUpdatingField(fieldName);
            const updateData = { [fieldName]: tempValue };
            
            console.log(`Updating field ${fieldName}:`, JSON.stringify(updateData, null, 2));
            
            const response = await axios.put(`${API_URL}/event/${id}`, updateData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                setEventDetails(prev => ({ ...prev, [fieldName]: tempValue }));
                setEditingField(null);
                toast.success(`${fieldName} updated successfully!`, {
                    position: "bottom-right",
                    autoClose: 2000,
                    theme: "dark"
                });
            }
        } catch (error: any) {
            toast.error(`Failed to update ${fieldName}`, {
                position: "bottom-right",
                autoClose: 3000,
                theme: "dark"
            });
        } finally {
            setUpdatingField(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingField(null);
        setTempValue("");
    };

    // Add new convenor
    const handleAddConvenor = async () => {
        if (!newConvenorRoll.trim()) {
            toast.error("Please enter a roll number", {
                position: "bottom-right",
                autoClose: 2000,
                theme: "dark"
            });
            return;
        }

        if (eventDetails.eventConvenors.includes(newConvenorRoll.toLowerCase())) {
            toast.error("This convenor is already added", {
                position: "bottom-right",
                autoClose: 2000,
                theme: "dark"
            });
            return;
        }

        try {
            setIsAddingConvenor(true);
            const updatedConvenors = [...eventDetails.eventConvenors, newConvenorRoll.toLowerCase()];
            
            const response = await axios.put(`${API_URL}/event/${id}`, 
                { eventConvenors: updatedConvenors }, 
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.status === 200) {
                setEventDetails(prev => ({ ...prev, eventConvenors: updatedConvenors }));
                setNewConvenorRoll("");
                toast.success("Convenor added successfully!", {
                    position: "bottom-right",
                    autoClose: 2000,
                    theme: "dark"
                });
            }
        } catch (error: any) {
            toast.error("Failed to add convenor", {
                position: "bottom-right",
                autoClose: 3000,
                theme: "dark"
            });
        } finally {
            setIsAddingConvenor(false);
        }
    };

    const handlePosterUpdate = async () => {
        if (!posterFile) {
            toast.error("Please select a poster file", {
                position: "bottom-right",
                autoClose: 2000,
                theme: "dark"
            });
            return;
        }

        try {
            setIsUpdatingPoster(true);
            const formData = new FormData();
            formData.append('poster', posterFile);

            const response = await axios.post(`${API_URL}/admin/update-poster/${id}`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                // Refresh the poster by fetching it again
                try {
                    const posterResponse = await axios.get(`${API_URL}/event/eventposter?id=${id}`, {
                        withCredentials: true,
                        responseType: "blob"
                    });

                    if (posterResponse.status === 200) {
                        const blob = posterResponse.data;
                        const reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onloadend = () => {
                            const base64String = reader.result as string;
                            setEventDetails(prev => ({
                                ...prev,
                                poster: base64String
                            }));
                        };
                    }
                } catch (posterErr) {
                    console.error("Error fetching updated poster:", posterErr);
                }

                setPosterFile(null);
                setShowPosterUpload(false);
                toast.success("Poster updated successfully!", {
                    position: "bottom-right",
                    autoClose: 2000,
                    theme: "dark"
                });
            }
        } catch (error: any) {
            toast.error("Failed to update poster", {
                position: "bottom-right",
                autoClose: 3000,
                theme: "dark"
            });
            console.error("Error updating poster:", error);
        } finally {
            setIsUpdatingPoster(false);
        }
    };

    const handlePosterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPosterFile(e.target.files[0]);
        }
    };

    const cancelPosterUpload = () => {
        setPosterFile(null);
        setShowPosterUpload(false);
    };
    // Remove convenor
    const handleRemoveConvenor = async (rollToRemove: string) => {
        try {
            const updatedConvenors = eventDetails.eventConvenors.filter(roll => roll !== rollToRemove);
            
            const response = await axios.put(`${API_URL}/event/${id}`, 
                { eventConvenors: updatedConvenors }, 
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.status === 200) {
                setEventDetails(prev => ({ ...prev, eventConvenors: updatedConvenors }));
                toast.success("Convenor removed successfully!", {
                    position: "bottom-right",
                    autoClose: 2000,
                    theme: "dark"
                });
            }
        } catch (error: any) {
            toast.error("Failed to remove convenor", {
                position: "bottom-right",
                autoClose: 3000,
                theme: "dark"
            });
        }
    };

    const renderField = (label: string, fieldName: keyof EventDetails, type: string = "text", isFullWidth: boolean = false) => {
        const isEditing = editingField === fieldName;
        const isUpdating = updatingField === fieldName;
        const value = eventDetails[fieldName];

        return (
            <div className={isFullWidth ? "w-full" : ""}>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-white font-medium">{label}</label>
                    {!isEditing && (
                        <button
                            onClick={() => handleEditClick(fieldName, value)}
                            className="text-blue-400 hover:text-blue-300 p-1"
                            title="Edit"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    )}
                </div>
                
                {isEditing ? (
                    <div className="space-y-3">
                        {type === "textarea" ? (
                            <textarea
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="w-full p-3 rounded-[10px] bg-tertiary text-white border-1 border-border min-h-[100px] resize-y"
                                disabled={isUpdating}
                            />
                        ) : (
                            <input
                                type={type}
                                value={tempValue}
                                onChange={(e) => setTempValue(type === "number" ? Number(e.target.value) : e.target.value)}
                                className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border"
                                disabled={isUpdating}
                            />
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleSaveField(fieldName)}
                                disabled={isUpdating}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-[10px] text-sm"
                            >
                                {isUpdating ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-[10px] text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full p-2 rounded-[10px] bg-tertiary text-white border-1 border-border min-h-[40px] flex items-center">
                        {type === "date" ? 
                            (typeof value === "string" && value ? value : "Not set") :
                            (typeof value === "string" || typeof value === "number"
                                ? (value || "Not set")
                                : "Not set")
                        }
                    </div>
                )}
            </div>
        );
    };

    const getPosterUrl = (poster: string | File | Blob): string => {
        if (typeof poster === 'string') {
            return poster;
        }
        return URL.createObjectURL(poster);
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="w-screen h-screen bg-black pt-[100px] flex flex-col justify-center items-center">
                    <div className="text-white text-2xl">Loading event details...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="w-screen min-h-screen bg-slate-50 pt-[100px] pb-10 flex flex-col justify-center items-center gap-[20px] text-black">
                <h1 className="text-[32px] font-bold mb-8 text-blue-600">Edit Event Details</h1>
                {/* Required Details */}
                <div className="w-7/10 border border-gray-200 bg-white p-[20px] flex flex-col justify-center items-center gap-[10px] rounded-[10px] shadow">
                    <p className="text-blue-600 text-[22px] mb-[10px] font-medium">Required Details</p>
                    <div className='w-8/10 flex flex-row justify-between items-center'>
                        <div className="w-45/100 flex flex-col gap-[20px]">
                            {renderField("Event Name", "name")}
                            {renderField("Event Type", "event_type")}
                            {renderField("Event Category", "event_category")}
                        </div>
                        <div className="w-45/100 flex flex-col gap-[20px]">
                            {renderField("Venue", "venue")}
                            {renderField("Date", "date", "date")}
                            <div className="w-full flex flex-row justify-between items-center gap-[20px]">
                                <div className="w-full">
                                    {renderField("Min Member", "min_no_member", "number")}
                                </div>
                                <div className="w-full">
                                    {renderField("Max Member", "max_no_member", "number")}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-8/10 flex flex-row justify-center items-center mt-[20px]">
                        {renderField("About the Event", "about", "textarea", true)}
                    </div>
                </div>

                {/* Optional Details */}
                <div className="w-7/10 border border-gray-200 bg-white p-[20px] flex flex-col justify-center items-center gap-[10px] rounded-[10px] shadow">
                    <p className="text-blue-600 text-[22px] mb-[10px] font-medium">Optional Details</p>
                    <div className='w-8/10 flex flex-row justify-between items-start'>
                        <div className="w-45/100 flex flex-col gap-[20px]">
                            {renderField("Chief Guest (with address)", "chief_guest")}
                            {renderField("Expected Expense", "exp_expense", "number")}
                            {renderField("Total amount allotted by Students Union", "tot_amt_allot_su", "number")}
                            {renderField("Total amount spent on the date of request", "tot_amt_spt_dor", "number")}
                        </div>
                        <div className="w-45/100 flex flex-col gap-[20px]">
                            {renderField("Expected no of Audience / Participants", "exp_no_aud", "number")}
                            {renderField("Faculty Observer with Designation", "faculty_obs_desig")}
                            {renderField("Faculty Observer Department", "faculty_obs_dept")}
                        </div>
                    </div>
                </div>

                {/* Event Poster - Replace the existing poster section */}
                <div className="w-7/10 bg-white border border-gray-200 rounded-[10px] flex justify-center items-center p-[20px] flex-col gap-[20px] shadow">
                    <div className="flex justify-between items-center w-full">
                        <p className="text-blue-600 font-medium text-[22px]">Event Poster</p>
                        {eventDetails.poster && !showPosterUpload && (
                            <button
                                onClick={() => setShowPosterUpload(true)}
                                className="text-blue-600 hover:text-blue-400 p-2 bg-blue-100 rounded-lg transition-colors"
                                title="Update Poster"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Current Poster Display */}
                    {eventDetails.poster && !showPosterUpload && (
                        <div className="mt-4 p-2 border border-gray-200 rounded-lg">
                            <img 
                                src={getPosterUrl(eventDetails.poster)} 
                                alt="Event poster preview" 
                                className="max-h-64 object-contain rounded" 
                            />
                        </div>
                    )}

                    {/* No Poster State */}
                    {!eventDetails.poster && !showPosterUpload && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-gray-400 text-center">
                                <p>No poster available for this event</p>
                            </div>
                            <button
                                onClick={() => setShowPosterUpload(true)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-[10px] hover:bg-opacity-80 transition-colors"
                            >
                                Add Poster
                            </button>
                        </div>
                    )}

                    {/* Poster Upload Section */}
                    {showPosterUpload && (
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex flex-col gap-3">
                                <label className="text-blue-600 font-medium">
                                    {eventDetails.poster ? "Replace Poster" : "Upload Poster"}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePosterFileChange}
                                    className="w-full p-2 rounded-[10px] bg-blue-50 text-black border border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-opacity-80"
                                    disabled={isUpdatingPoster}
                                />
                            </div>

                            {/* Preview selected file */}
                            {posterFile && (
                                <div className="mt-4 p-2 border border-gray-200 rounded-lg">
                                    <p className="text-black text-sm mb-2">Preview:</p>
                                    <img 
                                        src={URL.createObjectURL(posterFile)} 
                                        alt="Poster preview" 
                                        className="max-h-64 object-contain rounded" 
                                    />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={handlePosterUpdate}
                                    disabled={!posterFile || isUpdatingPoster}
                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-[10px] transition-colors"
                                >
                                    {isUpdatingPoster ? "Updating..." : "Update Poster"}
                                </button>
                                <button
                                    onClick={cancelPosterUpload}
                                    disabled={isUpdatingPoster}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-[10px] transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Event Convenors */}
                <div className="w-7/10 border border-gray-200 bg-white p-[20px] flex flex-col justify-center items-center gap-[10px] rounded-[10px] shadow">
                    <p className="text-blue-600 text-[22px] mb-[10px] font-medium">Event Convenors</p>
                    {/* Add new convenor section */}
                    <div className="w-8/10 flex flex-col justify-center items-center">
                        <input
                            type="text"
                            placeholder="Roll No"
                            value={newConvenorRoll}
                            onChange={(e) => setNewConvenorRoll(e.target.value)}
                            className="w-45/100 p-2 rounded-[10px] bg-blue-50 text-black border border-gray-200"
                            disabled={isAddingConvenor}
                        />
                        <button
                            onClick={handleAddConvenor}
                            disabled={isAddingConvenor}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-[10px] hover:bg-opacity-80 cursor-pointer disabled:bg-gray-600"
                        >
                            {isAddingConvenor ? "Adding..." : "Add Convenor"}
                        </button>
                    </div>

                    {/* Display existing convenors */}
                    {eventDetails.eventConvenors && eventDetails.eventConvenors.length > 0 && (
                        <div className="w-7/10 mt-4 flex flex-col">
                            <h3 className="text-blue-600 text-[18px] mb-2">Added Convenors:</h3>
                            <div className="mt-2">
                                {eventDetails.eventConvenors.map((rollno, index) => (
                                    <div key={index} className="flex justify-between items-center p-[10px] border border-gray-200 bg-blue-50 rounded-[10px] mb-[10px]">
                                        <div>
                                            <span className="text-black">Roll No: {rollno}</span>
                                        </div>
                                        <button
                                            className="text-red-600 hover:text-red-400 cursor-pointer"
                                            onClick={() => handleRemoveConvenor(rollno)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer theme="dark" />
        </>
    );
};

export default EditEvent;