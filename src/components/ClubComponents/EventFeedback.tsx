import React from 'react'
import { useGetFeedback } from '../../hooks/useEvents';

interface FeedBackProps {
  event_id : string | undefined;
}

export default function Feedback({event_id}:FeedBackProps) {

  const {data:feedbacks} = useGetFeedback({event_id})
  
  if(feedbacks == undefined) {
    return <>
      <div className="flex justify-center items-center h-screen w-screen bg-black">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    </>
  }



  return (
    <div className="space-y-6">
    {feedbacks.length > 0 ? (
      feedbacks.map((feedback) => (
        <div key={feedback.id} className="bg-black/30 p-4 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-white font-medium">{`${feedback?.users?.name}`}</h3>
              <p className="text-gray-400 text-sm">{new Date(feedback.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-lg ${i < feedback.rating ? 'text-emerald-400' : 'text-gray-600'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-300">{feedback.feedback}</p>
        </div>
      ))
    ) : (
      <div className="text-center py-8 text-gray-400">No feedback available for this event</div>
    )}
  </div>
  )
}
