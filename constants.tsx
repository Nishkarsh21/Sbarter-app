
import { User } from './types';

export const STANDARD_SKILLS = [
  'React Development',
  'Python Programming',
  'Video Editing (Premiere Pro)',
  'Graphic Design (Figma)',
  'Digital Marketing',
  'SQL & Databases',
  'Public Speaking',
  'Content Writing',
  'Data Science',
  'Mobile App Development'
];

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    email: 'aarav@example.in',
    avatar: 'https://picsum.photos/seed/aarav/200',
    skillsToTeach: ['React Development', 'TypeScript', 'Node.js'],
    skillsToLearn: ['Video Editing (Premiere Pro)', 'Python Programming'],
    credits: 8,
    bio: 'Software Architect based in Bangalore. I can help you build scalable web apps.',
    rating: 4.9,
    sessionsCompleted: 14,
    blockedUserIds: []
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@example.in',
    avatar: 'https://picsum.photos/seed/priya/200',
    skillsToTeach: ['Video Editing (Premiere Pro)', 'After Effects', 'Cinematography'],
    skillsToLearn: ['Python Programming', 'Data Science', 'SQL & Databases'],
    credits: 5,
    bio: 'Filmmaker from Mumbai. Looking to automate my editing workflows with Python.',
    rating: 4.7,
    sessionsCompleted: 8,
    blockedUserIds: []
  },
  {
    id: '3',
    name: 'Vihaan Gupta',
    email: 'vihaan@example.in',
    avatar: 'https://picsum.photos/seed/vihaan/200',
    skillsToTeach: ['Graphic Design (Figma)', 'UI/UX Design', 'Branding'],
    skillsToLearn: ['React Development', 'Public Speaking'],
    credits: 3,
    bio: 'Product Designer at a top fintech. I love teaching clean interface design.',
    rating: 5.0,
    sessionsCompleted: 22,
    blockedUserIds: []
  },
  {
    id: '4',
    name: 'Ananya Iyer',
    email: 'ananya@example.in',
    avatar: 'https://picsum.photos/seed/ananya/200',
    skillsToTeach: ['Public Speaking', 'Business Communication'],
    skillsToLearn: ['Digital Marketing', 'Content Writing'],
    credits: 6,
    bio: 'Soft skills trainer helping engineers communicate better. Learning SEO on the side.',
    rating: 4.8,
    sessionsCompleted: 11,
    blockedUserIds: []
  }
];

export const INITIAL_USER: User = {
  id: 'current-user',
  name: 'Arjun Das',
  email: 'arjun@example.in',
  avatar: 'https://picsum.photos/seed/arjun/200',
  skillsToTeach: ['Python Programming', 'SQL & Databases'],
  skillsToLearn: ['React Development', 'Graphic Design (Figma)'],
  credits: 5,
  bio: 'Backend developer exploring frontend and design.',
  rating: 4.5,
  sessionsCompleted: 0,
  blockedUserIds: []
};
