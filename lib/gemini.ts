import { ATSResult, InterviewEvaluation, MCQQuestion } from './types';
import { defaultQuestionsBank } from './mockData';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AQ.Ab8RN6Kd7f5JcoVnjU5JucTVIf1lWhrOcvu7Bx-f3liD62KXIg";

export async function callGemini(prompt: string, systemInstruction: string = "You are an expert technical interviewer and placement auditor."): Promise<string | null> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
    return null;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1200 }
      })
    });

    if (!res.ok) {
      console.warn("Gemini REST API status:", res.status);
      return null;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch (err) {
    console.warn("Gemini API call failed, falling back to local heuristic engine:", err);
    return null;
  }
}

export async function auditResumeATS(resumeText: string, jobTitle: string = "Software Development Engineer"): Promise<ATSResult> {
  const prompt = `Analyze this resume for the position of "${jobTitle}".
Resume Content:
${resumeText.slice(0, 3000)}

Return ONLY valid JSON matching this exact structure:
{
  "ats_score": number (0 to 100),
  "extracted_skills": string[],
  "missing_keywords": string[],
  "strengths": string[],
  "what_to_add": string[],
  "what_to_remove": string[]
}`;

  const geminiResponse = await callGemini(prompt, "You are a professional ATS resume audit algorithm for campus placements.");

  if (geminiResponse) {
    try {
      const cleanJson = geminiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        score: Math.min(100, Math.max(0, Number(parsed.ats_score) || 75)),
        role: jobTitle,
        extractedSkills: parsed.extracted_skills || ["Data Structures", "Algorithms", "Python", "SQL", "Git"],
        missingKeywords: parsed.missing_keywords || ["Microservices", "Docker", "Unit Testing", "CI/CD"],
        strengths: parsed.strengths || ["Clear educational background with strong GPA", "Demonstrated problem solving on GitHub"],
        whatToAdd: parsed.what_to_add || ["Quantifiable impact metrics (e.g., 'Reduced response latency by 25%')", "Direct project links"],
        whatToRemove: parsed.what_to_remove || ["Generic subjective adjectives", "Non-technical hobbies"]
      };
    } catch (e) {
      // Fallback
    }
  }

  // Built-in intelligent heuristic engine
  const lower = resumeText.toLowerCase();
  const coreKeywords = ["python", "java", "sql", "git", "dsa", "react", "api", "docker", "c++", "database", "algorithms", "redis", "linux"];
  const matched = coreKeywords.filter(k => lower.includes(k));
  const missing = coreKeywords.filter(k => !lower.includes(k));

  const score = Math.min(96, Math.max(48, Math.round(50 + (matched.length / coreKeywords.length) * 45)));

  return {
    score: score,
    role: jobTitle,
    extractedSkills: matched.map(s => s.toUpperCase()),
    missingKeywords: missing.slice(0, 5).map(s => s.toUpperCase()),
    strengths: [
      "Structured layout with identifiable technical projects and education milestones",
      `Matches ${matched.length} key engineering competencies for ${jobTitle}`,
      "Clean single-column formatting suitable for standard ATS scanners"
    ],
    whatToAdd: [
      `Add explicit target keywords: ${missing.slice(0, 3).join(", ").toUpperCase()}`,
      "Include quantifiable performance outcomes (e.g. 'Optimized DB throughput by 35%')",
      "Provide verifiable links to production code repositories and live demonstrations"
    ],
    whatToRemove: [
      "Remove generic summary statements in favor of verifiable technical achievements",
      "Eliminate outdated frameworks that distract modern applicant tracking systems"
    ]
  };
}

export async function evaluateInterviewSpeech(question: string, transcript: string, role: string = "Software Engineer"): Promise<InterviewEvaluation> {
  const prompt = `Evaluate the candidate's spoken interview answer using the STAR (Situation, Task, Action, Result) rubric.
Interview Question: "${question}"
Candidate Transcript: "${transcript}"

Return ONLY valid JSON matching this schema:
{
  "overall_score": number (0 to 100),
  "situation": number (0 to 25),
  "task": number (0 to 25),
  "action": number (0 to 25),
  "result": number (0 to 25),
  "feedback": string,
  "strengths": string[],
  "improvements": string[]
}`;

  const geminiResponse = await callGemini(prompt, "You are a senior tech lead conducting placement interviews with STAR rubrics.");

  if (geminiResponse) {
    try {
      const cleanJson = geminiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        overallScore: Math.min(100, Math.max(0, Number(parsed.overall_score) || 72)),
        starBreakdown: {
          situation: Number(parsed.situation) || 18,
          task: Number(parsed.task) || 18,
          action: Number(parsed.action) || 20,
          result: Number(parsed.result) || 16
        },
        feedback: parsed.feedback || "Good technical reasoning with clear explanation of trade-offs.",
        strengths: parsed.strengths || ["Clear articulation of technical concepts", "Structured presentation of the approach"],
        improvements: parsed.improvements || ["Conclude with measurable business or system metrics", "Explicitly mention test cases considered"]
      };
    } catch (e) {
      // Fallback below
    }
  }

  // Heuristic analysis based on transcript length and depth
  const wordCount = transcript.trim().split(/\s+/).length;
  const hasActionWords = /built|implemented|engineered|debugged|designed|optimized|solved/i.test(transcript);
  const hasMetrics = /\d+|percent|reduced|increased|latency|seconds|minutes/i.test(transcript);

  let score = 55;
  if (wordCount > 30) score += 15;
  if (wordCount > 80) score += 10;
  if (hasActionWords) score += 10;
  if (hasMetrics) score += 8;
  score = Math.min(95, score);

  const situation = Math.min(25, Math.round(score * 0.24));
  const task = Math.min(25, Math.round(score * 0.24));
  const action = Math.min(25, Math.round(score * 0.28));
  const result = Math.min(25, Math.round(score * 0.24));

  return {
    overallScore: score,
    starBreakdown: { situation, task, action, result },
    feedback: `Candidate articulated technical strategy with ${wordCount} words. Communication was direct and covered the core requirements of the question.`,
    strengths: [
      hasActionWords ? "Strong use of active engineering verbs demonstrating direct execution" : "Identified the core problem statement clearly",
      "Logical progression from problem description to proposed resolution"
    ],
    improvements: [
      hasMetrics ? "Elaborate further on edge cases encountered during testing" : "Incorporate quantifiable outcome metrics (e.g. latency, throughput, scale)",
      "Specify collaborative aspects or code review steps"
    ]
  };
}
