export interface Event {
    id: number;
    name: string;
    about: string;
    date: string;
    event_type: string;
    venue: string;
    event_category: string;
    min_no_member: number;
    max_no_member: number;
    chief_guest?: string;
    exp_expense?: number;
    tot_amt_allot_su?: number;
    tot_amt_spt_dor?: number;
    exp_no_aud?: number;
    faculty_obs_desig?: string;
    faculty_obs_dept?: string;
    poster?: string;
  }
  
  export interface Team {
    id: number;
    name: string;
    event_id: number;
  }
  
  export interface FacultyAdvisor {
    id: number;
    name: string;
    department: string;
    designation: string;
  }
  
  export interface EventRegistration {
    id: number;
    event_id: number;
    team_id: number;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
  }
  
  export interface TeamMember {
    id: number;
    user_id: number;
    team_id: number;
    event_id: number;
    is_present: boolean;
    user?: User;
  }
  
  export interface Feedback {
    id: number;
    user_id: number;
    event_id: number;
    feedback: string;
    rating: number;
    created_at: string;
    user?: User;
  }
  
  export interface EventWinner {
    id: number;
    team_id: number;
    event_id: number;
    position: number;
    team?: Team;
  }
  
  export type TabType = 'upcoming' | 'past' | 'ongoing' | 'all';

// Generate dates for different event states
const today = new Date();
const pastDate = new Date(today);
pastDate.setMonth(pastDate.getMonth() - 1);

const futureDate = new Date(today);
futureDate.setMonth(futureDate.getMonth() + 1);

const ongoingDate = new Date(today);

// Mock event categories
const eventCategories = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'];
const eventTypes = ['Competition', 'Exhibition', 'Conference', 'Meetup', 'Hackathon'];
const venues = ['Main Auditorium', 'Seminar Hall', 'Sports Complex', 'Central Lawn', 'Lab Complex'];

// Mock Events Data
export const mockEvents: Event[] = [
  {
    id: 1,
    name: 'Code Fiesta 2025',
    about: 'Annual coding competition with multiple rounds testing algorithmic skills.',
    date: futureDate.toISOString().split('T')[0],
    event_type: 'Competition',
    venue: 'Main Auditorium',
    event_category: 'Technical',
    min_no_member: 1,
    max_no_member: 3,
    chief_guest: 'Dr. Jane Smith, CTO of TechCorp',
    exp_expense: 5000,
    tot_amt_allot_su: 3000,
    tot_amt_spt_dor: 2000,
    exp_no_aud: 300,
    faculty_obs_desig: 'Professor',
    faculty_obs_dept: 'Computer Science',
    
  },
  {
    id: 2,
    name: 'Design Thinking Workshop',
    about: 'Learn how to apply design thinking methodology to solve complex problems.',
    date: pastDate.toISOString().split('T')[0],
    event_type: 'Workshop',
    venue: 'Seminar Hall',
    event_category: 'Technical',
    min_no_member: 1,
    max_no_member: 1,
    chief_guest: 'Prof. Robert Johnson',
    exp_expense: 3000,
    tot_amt_allot_su: 2000,
    tot_amt_spt_dor: 1000,
    exp_no_aud: 150,
    faculty_obs_desig: 'Associate Professor',
    faculty_obs_dept: 'Design',
    poster: 'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg'
  },
  {
    id: 3,
    name: 'Robotics Exhibition',
    about: 'Showcase of innovative robotic projects developed by students.',
    date: ongoingDate.toISOString().split('T')[0],
    event_type: 'Exhibition',
    venue: 'Lab Complex',
    event_category: 'Technical',
    min_no_member: 2,
    max_no_member: 5,
    exp_expense: 7000,
    tot_amt_allot_su: 4000,
    tot_amt_spt_dor: 3000,
    exp_no_aud: 200,
    faculty_obs_desig: 'Professor',
    faculty_obs_dept: 'Robotics',
    poster: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg'
  },
  {
    id: 4,
    name: 'Cultural Night',
    about: 'Annual cultural celebration with performances from various clubs.',
    date: futureDate.toISOString().split('T')[0],
    event_type: 'Cultural',
    venue: 'Main Auditorium',
    event_category: 'Cultural',
    min_no_member: 5,
    max_no_member: 15,
    chief_guest: 'Ms. Lisa Chen, Famous Choreographer',
    exp_expense: 10000,
    tot_amt_allot_su: 7000,
    tot_amt_spt_dor: 3000,
    exp_no_aud: 500,
    faculty_obs_desig: 'Dean',
    faculty_obs_dept: 'Student Affairs',
    poster: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg'
  },
  {
    id: 5,
    name: 'Sports Tournament',
    about: 'Inter-college sports competition with multiple events.',
    date: ongoingDate.toISOString().split('T')[0],
    event_type: 'Tournament',
    venue: 'Sports Complex',
    event_category: 'Sports',
    min_no_member: 10,
    max_no_member: 15,
    exp_expense: 15000,
    tot_amt_allot_su: 10000,
    tot_amt_spt_dor: 5000,
    exp_no_aud: 400,
    faculty_obs_desig: 'Sports Director',
    faculty_obs_dept: 'Physical Education',
    poster: 'https://images.pexels.com/photos/3755440/pexels-photo-3755440.jpeg'
  },
  {
    id: 6,
    name: 'AI Conference',
    about: 'Conference on latest developments in artificial intelligence and machine learning.',
    date: pastDate.toISOString().split('T')[0],
    event_type: 'Conference',
    venue: 'Seminar Hall',
    event_category: 'Technical',
    min_no_member: 1,
    max_no_member: 2,
    chief_guest: 'Dr. Michael Brown, AI Researcher',
    exp_expense: 8000,
    tot_amt_allot_su: 5000,
    tot_amt_spt_dor: 3000,
    exp_no_aud: 250,
    faculty_obs_desig: 'Professor',
    faculty_obs_dept: 'Computer Science',
    poster: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg'
  }
];

// Mock Users
export const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: 3, name: 'Robert Johnson', email: 'robert.johnson@example.com' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com' },
  { id: 5, name: 'Michael Brown', email: 'michael.brown@example.com' }
];

// Mock Teams
export const mockTeams: Team[] = [
  { id: 1, name: 'Code Wizards', event_id: 1 },
  { id: 2, name: 'Design Thinkers', event_id: 2 },
  { id: 3, name: 'Robo Masters', event_id: 3 },
  { id: 4, name: 'Cultural Club', event_id: 4 },
  { id: 5, name: 'Sports Team A', event_id: 5 },
  { id: 6, name: 'AI Enthusiasts', event_id: 6 }
];

// Mock Faculty Advisors
export const mockFacultyAdvisors: FacultyAdvisor[] = [
  { id: 1, name: 'Dr. Alan Parker', department: 'Computer Science', designation: 'Professor' },
  { id: 2, name: 'Dr. Sarah Lee', department: 'Design', designation: 'Associate Professor' },
  { id: 3, name: 'Dr. Brian Miller', department: 'Robotics', designation: 'Professor' }
];

// Mock Event Registrations
export const mockEventRegistrations: EventRegistration[] = [
  { id: 1, event_id: 1, team_id: 1 },
  { id: 2, event_id: 2, team_id: 2 },
  { id: 3, event_id: 3, team_id: 3 },
  { id: 4, event_id: 4, team_id: 4 },
  { id: 5, event_id: 5, team_id: 5 },
  { id: 6, event_id: 6, team_id: 6 }
];

// Mock Team Members
export const mockTeamMembers: TeamMember[] = [
  { id: 1, user_id: 1, team_id: 1, event_id: 1, is_present: true },
  { id: 2, user_id: 2, team_id: 1, event_id: 1, is_present: true },
  { id: 3, user_id: 3, team_id: 2, event_id: 2, is_present: false },
  { id: 4, user_id: 4, team_id: 3, event_id: 3, is_present: true },
  { id: 5, user_id: 5, team_id: 4, event_id: 4, is_present: false },
  { id: 6, user_id: 1, team_id: 5, event_id: 5, is_present: true },
  { id: 7, user_id: 2, team_id: 6, event_id: 6, is_present: true }
];

// Mock Feedback
export const mockFeedback: Feedback[] = [
  { 
    id: 1, 
    user_id: 1, 
    event_id: 2, 
    feedback: 'The workshop was very informative and well-organized.',
    rating: 5,
    created_at: new Date().toISOString()
  },
  { 
    id: 2, 
    user_id: 2, 
    event_id: 6, 
    feedback: 'Great conference with insightful talks.',
    rating: 4,
    created_at: new Date().toISOString()
  },
  { 
    id: 3, 
    user_id: 3, 
    event_id: 2, 
    feedback: 'Could have been more interactive.',
    rating: 3,
    created_at: new Date().toISOString()
  }
];

// Mock Event Winners
export const mockEventWinners: EventWinner[] = [
  { id: 1, team_id: 1, event_id: 1, position: 1 },
  { id: 2, team_id: 6, event_id: 6, position: 1 },
  { id: 3, team_id: 2, event_id: 2, position: 2 }
];

// Helper functions to get related data
export const getEventStatus = (event: Event): 'upcoming' | 'past' | 'ongoing' => {
  const eventDate = new Date(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (eventDate.getTime() > today.getTime()) {
    return 'upcoming';
  } else if (eventDate.getTime() < today.getTime()) {
    return 'past';
  } else {
    return 'ongoing';
  }
};

export const getEventsByStatus = (status: 'upcoming' | 'past' | 'ongoing' | 'all'): Event[] => {
  if (status === 'all') {
    return mockEvents;
  }
  
  return mockEvents.filter(event => getEventStatus(event) === status);
};

export const getTeamsByEventId = (eventId: number): Team[] => {
  return mockTeams.filter(team => team.event_id === eventId);
};

export const getRegistrationsByEventId = (eventId: number): EventRegistration[] => {
  return mockEventRegistrations.filter(reg => reg.event_id === eventId);
};

export const getTeamMembersByEventId = (eventId: number): TeamMember[] => {
  return mockTeamMembers.filter(member => member.event_id === eventId).map(member => ({
    ...member,
    user: mockUsers.find(user => user.id === member.user_id)
  }));
};

export const getFeedbackByEventId = (eventId: number): Feedback[] => {
  return mockFeedback.filter(feedback => feedback.event_id === eventId).map(feedback => ({
    ...feedback,
    user: mockUsers.find(user => user.id === feedback.user_id)
  }));
};

export const getWinnersByEventId = (eventId: number): EventWinner[] => {
  return mockEventWinners.filter(winner => winner.event_id === eventId).map(winner => ({
    ...winner,
    team: mockTeams.find(team => team.id === winner.team_id)
  }));
};