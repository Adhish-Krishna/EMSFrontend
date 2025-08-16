import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import { usePastEvents } from '../../hooks/useClub'
import { useQueryClient } from '@tanstack/react-query'
import { FiUsers, FiCalendar, FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { clubProfile } from '../../layout/ClubAdminLayout'
import LoadingScreen from '../../components/ClubComponents/loading.tsx';
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
    // --- NEW LOGIC FOR PARTICIPATION CHART ---
    const today = new Date();
    const participationLabels = [];
    const registeredData = Array(4).fill(0);
    const attendanceData = Array(4).fill(0);

    // Generate labels for the last 4 months (current + 3 previous)
    for (let i = 3; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      participationLabels.push(d.toLocaleDateString('en-US', { month: 'short' }));
    }

    // Get the start date of the 4-month period
    const fourMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    fourMonthsAgo.setHours(0, 0, 0, 0);

    // Filter and aggregate data for the last 4 months
    pastEvents?.forEach(event => {
      const eventDate = new Date(event.date);
      if (eventDate >= fourMonthsAgo) {
        const monthDiff = (eventDate.getFullYear() - fourMonthsAgo.getFullYear()) * 12 + (eventDate.getMonth() - fourMonthsAgo.getMonth());
        
        if (monthDiff >= 0 && monthDiff < 4) {
          registeredData[monthDiff] += event.total_registered_teams || 0;
          attendanceData[monthDiff] += event.total_attendance || 0;
        }
      }
    });

    const participationData = {
      labels: participationLabels,
      datasets: [
        {
          label: 'Registered Teams',
          data: registeredData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
        },
        {
          label: 'Attendance',
          data: attendanceData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
        }
      ]
    };

    
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

  // Calculate dynamic options for the participation chart
  const getParticipationChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#fff' // Legend text in white
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(251, 255, 255, 0.15)', // X-axis grid lines
            drawTicks: false, // remove extra ticks
            drawOnChartArea: true
          },
          ticks: {
            color: '#fff' // X-axis labels in white
          },
          
        },
        y: {
          grid: {
            color: 'rgba(251, 255, 255, 0.15)', // Y-axis grid lines
            drawTicks: false, // remove extra ticks
            drawOnChartArea: true
          },
          ticks: {
            color: '#fff' // Y-axis labels in white
          },
         
        }
      }
    };
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !pastEvents) {
    return (
      <div className="text-center py-8 text-red-500 text-lg">
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
            <h1 className="text-4xl font-bold text-primary text-gradient mb-1">
              {clubProfile?.club || 'Club Name'}
            </h1>
            <p className="text-gray-300">
              <span className="text-primary">Admin:</span> {clubProfile?.name}
            </p>
            <p className="text-gray-300 text-sm mt-2">
              <span className='text-primary'>Roll No:</span> {clubProfile?.rollno}
            </p>
          </div>
        <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-900/20 rounded-xl">
                <FiCalendar className="w-8 h-8 text-primary" />
            </div>
            <div>
                <p className="text-2xl font-bold text-white"> {pastEvents.length} </p>
                <p className="text-primary text-sm">Total Events</p>
            </div>
        </div>

        </div>
      </motion.div>

      {/* Statistics Charts */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-neutral-800/40 p-6 rounded-xl border border-emerald-500">
          <h3 className="text-lg font-semibold text-primary mb-4">Participation Trends</h3>
          <div className="h-64">
            <Line 
              data={participationData}
              options={getParticipationChartOptions()}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-neutral-800/40 p-6 rounded-xl border border-emerald-500">
          <h3 className="text-lg font-semibold text-primary mb-4">Event Ratings</h3>
          <div className="h-64">
            <Bar
              data={ratingsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: '#fff' // Legend text in white
                    }
                  }
                },
                scales: {
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)', // X-axis grid lines
                      drawTicks: false, // remove extra ticks
                      drawOnChartArea: true,
                      
                    },
                    ticks: {
                      color: '#fff' // X-axis labels in white
                    },
                    
                  },
                  y: { 
                    beginAtZero: true, 
                    max: 5,
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)', // Y-axis grid lines
                      drawTicks: false, // remove extra ticks
                      drawOnChartArea: true
                    },
                    ticks: {
                      color: '#fff' // Y-axis labels in white
                    },
                   
                  }
                }
              }}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-neutral-800/40 p-6 rounded-xl border border-emerald-500">
          <h3 className="text-lg font-semibold text-primary mb-4">Event Categories</h3>
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
        <h2 className="text-2xl font-bold text-primary">Events Conducted</h2>
        
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
                  <h3 className="text-xl font-semibold text-primary">{event.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-300">
                    <FiCalendar className="flex-shrink-0" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <button className="text-primary">
                  {expandedEvent === event.name ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>

              {expandedEvent === event.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 space-y-4"
                >
                  <p className="text-gray-500 text-sm">{event.about}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-primary text-sm font-medium">Convenors</p>
                      {event.eventConvenors.map((convenor, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-white text-sm">{convenor.name}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="text-primary text-sm font-medium">Winners</p>
                      {event.eventWinners.map((winner, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-primary">
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                          </span>
                          <p className="text-white text-sm">{winner.team_name}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-emerald-900/30">
                    <div className="flex items-center gap-2">
                      <FiStar className="text-amber-500" />
                      <span className="text-white">{event.average_rating}/5</span>
                    </div>
                    <div className="text-sm text-gray-500">
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