export interface StudentProfile {
  name: string;
  technology: string;
  gpa: number;
  degree: string;
}

export interface ReadinessProgress {
  overall_readiness: number;
  resume_score: number;
  mock_score: number;
  interview_score: number;
  resume_completed: boolean;
  mock_passed: boolean;
  interview_passed: boolean;
}

export interface NextAction {
  title: string;
  desc: string;
  badge: string;
  badge_class: string;
  icon: string;
  action_url: string;
  action_text: string;
}

export interface JobOpportunity {
  id: number;
  title: string;
  company: string;
  salary: string;
  location: string;
}

export interface ScheduledTest {
  id: number;
  test_type: string;
  date: string;
  time: string;
}

export interface AssessmentRecord {
  id: number;
  type: '30 MCQ Technical' | 'AI Voice Interview';
  technology: string;
  date: string;
  violations: number;
  score: number;
  passed: boolean;
}

export interface MCQQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface ATSResult {
  score: number;
  role: string;
  extractedSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  whatToAdd: string[];
  whatToRemove: string[];
}

export interface InterviewEvaluation {
  overallScore: number;
  starBreakdown: {
    situation: number;
    task: number;
    action: number;
    result: number;
  };
  feedback: string;
  strengths: string[];
  improvements: string[];
}
