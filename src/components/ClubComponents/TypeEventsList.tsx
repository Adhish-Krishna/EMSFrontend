import React from 'react'
import useEvents from '../../hooks/useEvents'
import EventList from '../ui/EventList'

export function PastEventsList() {
  const {data:event} = useEvents({type:"past"})
  return (
    <>
      <EventList events={event || []} event_type='past'/>
    </>
  )
}

export function OngoingEvents() {
  const {data:event} = useEvents({type:"ongoing"})
  return (
    <>
      <EventList events={event || []} event_type='ongoing'/>
    </>
  )
}

export function UpcomingEvents() {
  const {data:event} = useEvents({type:"upcoming"})
  return (
    <>
      <EventList events={event || []} event_type='upcoming'/>
    </>
  )
}