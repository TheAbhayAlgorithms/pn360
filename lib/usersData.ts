import { UserAccount } from './types';

export const defaultUsers: UserAccount[] = [
  {
    id: "user-abhay",
    username: "abhay",
    name: "Abhay Raj Singh",
    email: "abhay@nexus.edu",
    password: "password123",
    track: "Software Engineering",
    rank: 4,
    previousRank: 6, // Climbed +2 Ranks
    resumeScore: 84,
    mcqScore: 73,
    interviewScore: 65,
    overallScore: 72,
    status: "In Diagnostic Review",
    history: {
      weekly: [
        { label: "Week 1", mcq: 58, interview: 50, overall: 54, rank: 6 },
        { label: "Week 2", mcq: 68, interview: 62, overall: 64, rank: 6 },
        { label: "Week 3", mcq: 73, interview: 60, overall: 68, rank: 5 },
        { label: "Week 4", mcq: 73, interview: 65, overall: 72, rank: 4 }
      ],
      monthly: [
        { label: "August", mcq: 50, interview: 44, overall: 50, rank: 8 },
        { label: "September", mcq: 60, interview: 52, overall: 58, rank: 7 },
        { label: "October", mcq: 68, interview: 58, overall: 65, rank: 6 },
        { label: "November", mcq: 73, interview: 65, overall: 72, rank: 4 }
      ],
      yearly: [
        { label: "2023", mcq: 44, interview: 40, overall: 45, rank: 12 },
        { label: "2024", mcq: 56, interview: 48, overall: 54, rank: 9 },
        { label: "2025", mcq: 66, interview: 58, overall: 64, rank: 7 },
        { label: "2026", mcq: 73, interview: 65, overall: 72, rank: 4 }
      ]
    }
  },
  {
    id: "user-priya",
    username: "priya",
    name: "Priya Sharma",
    email: "priya@nexus.edu",
    password: "password123",
    track: "Software Engineering",
    rank: 1,
    previousRank: 1, // Steady Leader
    resumeScore: 94,
    mcqScore: 90,
    interviewScore: 92,
    overallScore: 92,
    status: "Offered • Google",
    history: {
      weekly: [
        { label: "Week 1", mcq: 86, interview: 88, overall: 88, rank: 1 },
        { label: "Week 2", mcq: 88, interview: 90, overall: 90, rank: 1 },
        { label: "Week 3", mcq: 90, interview: 91, overall: 91, rank: 1 },
        { label: "Week 4", mcq: 90, interview: 92, overall: 92, rank: 1 }
      ],
      monthly: [
        { label: "August", mcq: 82, interview: 80, overall: 82, rank: 1 },
        { label: "September", mcq: 85, interview: 86, overall: 86, rank: 1 },
        { label: "October", mcq: 88, interview: 89, overall: 89, rank: 1 },
        { label: "November", mcq: 90, interview: 92, overall: 92, rank: 1 }
      ],
      yearly: [
        { label: "2023", mcq: 72, interview: 68, overall: 70, rank: 3 },
        { label: "2024", mcq: 80, interview: 76, overall: 78, rank: 2 },
        { label: "2025", mcq: 86, interview: 84, overall: 86, rank: 1 },
        { label: "2026", mcq: 90, interview: 92, overall: 92, rank: 1 }
      ]
    }
  },
  {
    id: "user-rohan",
    username: "rohan",
    name: "Rohan Verma",
    email: "rohan@nexus.edu",
    password: "password123",
    track: "Backend & Systems",
    rank: 2,
    previousRank: 3, // Climbed +1
    resumeScore: 88,
    mcqScore: 86,
    interviewScore: 88,
    overallScore: 87,
    status: "Offered • Microsoft",
    history: {
      weekly: [
        { label: "Week 1", mcq: 80, interview: 81, overall: 81, rank: 3 },
        { label: "Week 2", mcq: 82, interview: 83, overall: 83, rank: 3 },
        { label: "Week 3", mcq: 84, interview: 85, overall: 85, rank: 3 },
        { label: "Week 4", mcq: 86, interview: 88, overall: 87, rank: 2 }
      ],
      monthly: [
        { label: "August", mcq: 76, interview: 74, overall: 75, rank: 4 },
        { label: "September", mcq: 80, interview: 78, overall: 79, rank: 3 },
        { label: "October", mcq: 83, interview: 82, overall: 83, rank: 3 },
        { label: "November", mcq: 86, interview: 88, overall: 87, rank: 2 }
      ],
      yearly: [
        { label: "2023", mcq: 65, interview: 60, overall: 64, rank: 6 },
        { label: "2024", mcq: 74, interview: 70, overall: 73, rank: 4 },
        { label: "2025", mcq: 82, interview: 80, overall: 81, rank: 3 },
        { label: "2026", mcq: 86, interview: 88, overall: 87, rank: 2 }
      ]
    }
  },
  {
    id: "user-sneha",
    username: "sneha",
    name: "Sneha Patel",
    email: "sneha@nexus.edu",
    password: "password123",
    track: "Cloud & DevOps",
    rank: 3,
    previousRank: 2, // Fell 1
    resumeScore: 86,
    mcqScore: 84,
    interviewScore: 85,
    overallScore: 85,
    status: "Shortlisted • Amazon",
    history: {
      weekly: [
        { label: "Week 1", mcq: 85, interview: 86, overall: 86, rank: 2 },
        { label: "Week 2", mcq: 86, interview: 86, overall: 86, rank: 2 },
        { label: "Week 3", mcq: 85, interview: 85, overall: 85, rank: 2 },
        { label: "Week 4", mcq: 84, interview: 85, overall: 85, rank: 3 }
      ],
      monthly: [
        { label: "August", mcq: 80, interview: 82, overall: 81, rank: 2 },
        { label: "September", mcq: 82, interview: 84, overall: 83, rank: 2 },
        { label: "October", mcq: 85, interview: 86, overall: 86, rank: 2 },
        { label: "November", mcq: 84, interview: 85, overall: 85, rank: 3 }
      ],
      yearly: [
        { label: "2023", mcq: 70, interview: 72, overall: 71, rank: 2 },
        { label: "2024", mcq: 76, interview: 78, overall: 77, rank: 3 },
        { label: "2025", mcq: 83, interview: 84, overall: 84, rank: 2 },
        { label: "2026", mcq: 84, interview: 85, overall: 85, rank: 3 }
      ]
    }
  },
  {
    id: "user-kunal",
    username: "kunal",
    name: "Kunal Deshmukh",
    email: "kunal@nexus.edu",
    password: "password123",
    track: "Full Stack Platform",
    rank: 5,
    previousRank: 4,
    resumeScore: 78,
    mcqScore: 70,
    interviewScore: 72,
    overallScore: 72,
    status: "Eligible for Drives",
    history: {
      weekly: [
        { label: "Week 1", mcq: 72, interview: 74, overall: 73, rank: 4 },
        { label: "Week 2", mcq: 72, interview: 72, overall: 73, rank: 4 },
        { label: "Week 3", mcq: 71, interview: 72, overall: 72, rank: 4 },
        { label: "Week 4", mcq: 70, interview: 72, overall: 72, rank: 5 }
      ],
      monthly: [
        { label: "August", mcq: 65, interview: 66, overall: 66, rank: 6 },
        { label: "September", mcq: 68, interview: 70, overall: 69, rank: 5 },
        { label: "October", mcq: 71, interview: 72, overall: 72, rank: 4 },
        { label: "November", mcq: 70, interview: 72, overall: 72, rank: 5 }
      ],
      yearly: [
        { label: "2023", mcq: 50, interview: 52, overall: 52, rank: 8 },
        { label: "2024", mcq: 60, interview: 62, overall: 62, rank: 6 },
        { label: "2025", mcq: 68, interview: 70, overall: 70, rank: 5 },
        { label: "2026", mcq: 70, interview: 72, overall: 72, rank: 5 }
      ]
    }
  },
  {
    id: "user-ananya",
    username: "ananya",
    name: "Ananya Iyer",
    email: "ananya@nexus.edu",
    password: "password123",
    track: "Backend & Systems",
    rank: 6,
    previousRank: 5,
    resumeScore: 76,
    mcqScore: 72,
    interviewScore: 68,
    overallScore: 71,
    status: "Eligible for Drives",
    history: {
      weekly: [
        { label: "Week 1", mcq: 70, interview: 66, overall: 69, rank: 5 },
        { label: "Week 2", mcq: 71, interview: 67, overall: 70, rank: 5 },
        { label: "Week 3", mcq: 72, interview: 68, overall: 71, rank: 6 },
        { label: "Week 4", mcq: 72, interview: 68, overall: 71, rank: 6 }
      ],
      monthly: [
        { label: "August", mcq: 64, interview: 60, overall: 63, rank: 7 },
        { label: "September", mcq: 68, interview: 64, overall: 67, rank: 6 },
        { label: "October", mcq: 70, interview: 66, overall: 69, rank: 5 },
        { label: "November", mcq: 72, interview: 68, overall: 71, rank: 6 }
      ],
      yearly: [
        { label: "2023", mcq: 48, interview: 44, overall: 48, rank: 10 },
        { label: "2024", mcq: 58, interview: 54, overall: 58, rank: 7 },
        { label: "2025", mcq: 66, interview: 62, overall: 66, rank: 6 },
        { label: "2026", mcq: 72, interview: 68, overall: 71, rank: 6 }
      ]
    }
  },
  {
    id: "user-vikram",
    username: "vikram",
    name: "Vikram Malhotra",
    email: "vikram@nexus.edu",
    password: "password123",
    track: "Software Engineering",
    rank: 7,
    previousRank: 8,
    resumeScore: 72,
    mcqScore: 68,
    interviewScore: 64,
    overallScore: 67,
    status: "Diagnostic Phase",
    history: {
      weekly: [
        { label: "Week 1", mcq: 62, interview: 58, overall: 61, rank: 8 },
        { label: "Week 2", mcq: 64, interview: 60, overall: 63, rank: 8 },
        { label: "Week 3", mcq: 66, interview: 62, overall: 65, rank: 7 },
        { label: "Week 4", mcq: 68, interview: 64, overall: 67, rank: 7 }
      ],
      monthly: [
        { label: "August", mcq: 55, interview: 50, overall: 54, rank: 9 },
        { label: "September", mcq: 60, interview: 56, overall: 59, rank: 8 },
        { label: "October", mcq: 64, interview: 60, overall: 63, rank: 8 },
        { label: "November", mcq: 68, interview: 64, overall: 67, rank: 7 }
      ],
      yearly: [
        { label: "2023", mcq: 40, interview: 36, overall: 40, rank: 15 },
        { label: "2024", mcq: 50, interview: 46, overall: 49, rank: 11 },
        { label: "2025", mcq: 60, interview: 55, overall: 59, rank: 8 },
        { label: "2026", mcq: 68, interview: 64, overall: 67, rank: 7 }
      ]
    }
  }
];
