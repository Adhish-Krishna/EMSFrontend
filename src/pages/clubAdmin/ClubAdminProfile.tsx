import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import { usePastEvents } from '../../hooks/useClub'
import { useQueryClient } from '@tanstack/react-query'
import { FiUsers, FiCalendar, FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { clubProfile } from '../../layout/ClubAdminLayout'

Chart.register(...registerables)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } }
}

export default function ClubAdminProfile() {
  const { data: pastEvents, isLoading, isError } = usePastEvents()
  const queryClient = useQueryClient()
  const clubProfile:clubProfile | undefined = queryClient.getQueryData(["clubProfile"])
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)

  // Process data for charts
  const processChartData = () => {
    const labels = pastEvents?.map(event => 
      new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    ) || []

    const participationData = {
      labels,
      datasets: [
        {
          label: 'Registered Teams',
          data: pastEvents?.map(event => event.total_registered_teams) || [],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
        },
        {
          label: 'Attendance',
          data: pastEvents?.map(event => event.total_attendance) || [],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
        }
      ]
    }

    const ratingsData = {
      labels: pastEvents?.map(event => event.name) || [],
      datasets: [{
        label: 'Average Rating',
        data: pastEvents?.map(event => event.average_rating) || [],
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgba(245, 158, 11, 1)',
      }]
    }

    const categoryData = {
      labels: [...new Set(pastEvents?.map(event => event.event_category))],
      datasets: [{
        data: [...new Set(pastEvents?.map(event => event.event_category))].map(category => 
          pastEvents?.filter(event => event.event_category === category).length
        ),
        backgroundColor: [
          '#10b981',
          '#3b82f6',
          '#8b5cf6',
          '#f59e0b',
          '#ef4444'
        ],
        hoverOffset: 4
      }]
    }

    return { participationData, ratingsData, categoryData }
  }

  const { participationData, ratingsData, categoryData } = processChartData()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-black">
        <div className="animate-spin h-12 w-12 border-4 border-emerald-400 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (isError || !pastEvents) {
    return (
      <div className="text-center py-8 text-red-400 text-lg">
        Failed to load profile data
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="px-4 sm:px-6 lg:px-8 py-8 space-y-8 mt-10"
    >
      {/* Profile Header */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-black/40 to-neutral-900/50 p-8 rounded-2xl shadow-2xl border border-emerald-900/30">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-4xl font-bold text-emerald-300 mb-1">
              {clubProfile?.club || 'Club Name'}
            </h1>
            <p className="text-gray-300">
              <span className="text-emerald-400">Admin:</span> {clubProfile?.name}
            </p>
            <p className="text-gray-300 text-sm mt-2">
              Roll No: {clubProfile?.rollno}
            </p>
          </div>
        <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-900/20 rounded-xl">
                <FiCalendar className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
                <p className="text-2xl font-bold text-white"> {pastEvents.length} </p>
                <p className="text-emerald-400 text-sm">Total Events</p>
            </div>
        </div>

        </div>
      </motion.div>

      {/* Statistics Charts */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-neutral-800/40 p-6 rounded-xl border border-emerald-900/30">
          <h3 className="text-lg font-semibold text-emerald-300 mb-4">Participation Trends</h3>
          <div className="h-64">
            <Line 
              data={participationData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' }
                }
              }}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-neutral-800/40 p-6 rounded-xl border border-emerald-900/30">
          <h3 className="text-lg font-semibold text-emerald-300 mb-4">Event Ratings</h3>
          <div className="h-64">
            <Bar
              data={ratingsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, max: 5 }
                }
              }}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-neutral-800/40 p-6 rounded-xl border border-emerald-900/30">
          <h3 className="text-lg font-semibold text-emerald-300 mb-4">Event Categories</h3>
          <div className="h-64">
            <Pie
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Events  */}
      <motion.div variants={itemVariants} className="space-y-6">
        <h2 className="text-2xl font-bold text-emerald-300">Events Conducted</h2>
        
        <div className="space-y-4">
          {pastEvents.map((event, index) => (
            <motion.div
              key={event.name + index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-black/30 to-neutral-900/40 p-6 rounded-xl border border-emerald-900/30 hover:border-emerald-900/50 transition-all cursor-pointer"
              onClick={() => setExpandedEvent(expandedEvent === event.name ? null : event.name)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">{event.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-300">
                    <FiCalendar className="flex-shrink-0" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <button className="text-emerald-400">
                  {expandedEvent === event.name ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>

              {expandedEvent === event.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 space-y-4"
                >
                  <p className="text-gray-400 text-sm">{event.about}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-emerald-400 text-sm font-medium">Convenors</p>
                      {event.eventConvenors.map((convenor, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <p className="text-white text-sm">{convenor.name}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="text-emerald-400 text-sm font-medium">Winners</p>
                      {event.eventWinners.map((winner, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-emerald-400">
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                          </span>
                          <p className="text-white text-sm">{winner.team_name}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-emerald-900/30">
                    <div className="flex items-center gap-2">
                      <FiStar className="text-amber-400" />
                      <span className="text-white">{event.average_rating}/5</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {event.total_registered_teams} teams registered
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}