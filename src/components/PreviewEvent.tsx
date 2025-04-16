import React from 'react';
import { EventDetails } from '../pages/clubAdmin/CreateEvent';

interface PreviewEventProps {
    eventDetails: EventDetails;
    onPublish: () => Promise<void>;
    onClose: () => void;
    loading: boolean;
}

const PreviewEvent: React.FC<PreviewEventProps> = ({ eventDetails, onPublish, onClose, loading }) => {
    const posterUrl = eventDetails.poster ? URL.createObjectURL(eventDetails.poster) : null;

    const renderOptionalDetail = (label: string, value: string | number | undefined) => {
        if (value !== undefined && value !== null && value !== '') {
            return <p><strong>{label}:</strong> {value}</p>;
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-secondary  flex justify-center items-center z-50 p-4">
            <div className="bg-tertiary border-1 border-border text-white p-6 rounded-[20px] max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-center text-primary">Event Preview</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-2 border-b border-gray-600 pb-1">Details</h3>
                        <p><strong>Name:</strong> {eventDetails.name}</p>
                        <p><strong>About:</strong> {eventDetails.about}</p>
                        <p><strong>Date:</strong> {eventDetails.date ? new Date(eventDetails.date).toLocaleDateString() : 'Not set'}</p>
                        <p><strong>Venue:</strong> {eventDetails.venue}</p>
                        <p><strong>Event Type:</strong> {eventDetails.event_type}</p>
                        <p><strong>Event Category:</strong> {eventDetails.event_category}</p>

                        {renderOptionalDetail('Min Members', eventDetails.min_no_member)}
                        {renderOptionalDetail('Max Members', eventDetails.max_no_member)}
                        {renderOptionalDetail('Chief Guest', eventDetails.chief_guest)}
                        {renderOptionalDetail('Expected Expense (₹)', eventDetails.exp_expense)}
                        {renderOptionalDetail('Amount Allotted SU (₹)', eventDetails.tot_amt_allot_su)}
                        {renderOptionalDetail('Amount Sponsored DOR (₹)', eventDetails.tot_amt_spt_dor)}
                        {renderOptionalDetail('Expected Audience', eventDetails.exp_no_aud)}
                        {renderOptionalDetail('Faculty Observer Designation', eventDetails.faculty_obs_desig)}
                        {renderOptionalDetail('Faculty Observer Department', eventDetails.faculty_obs_dept)}

                        <h3 className="text-xl font-semibold mt-4 mb-2 border-b border-gray-600 pb-1">Convenors</h3>
                        {eventDetails.eventConvenors.length > 0 ? (
                            <ul className="list-disc list-inside">
                                {eventDetails.eventConvenors.map((convenor, index) => (
                                    <li key={index}>{convenor}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No convenors added.</p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2 border-b border-gray-600 pb-1">Poster</h3>
                        {posterUrl ? (
                            <img src={posterUrl} alt="Event Poster Preview" className="max-w-full h-auto rounded-md object-contain max-h-96" />
                        ) : (
                            <p className="text-gray-400">No poster uploaded.</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 text-white px-4 py-2 rounded-[10px] hover:bg-gray-500 cursor-pointer"
                        disabled={loading}
                    >
                        Edit
                    </button>
                    <button
                        onClick={onPublish}
                        className="bg-primary text-white px-4 py-2 rounded-[10px] hover:bg-opacity-80 cursor-pointer flex justify-center items-center min-w-[80px]"
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Publish'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreviewEvent;