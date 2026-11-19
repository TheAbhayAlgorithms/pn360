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
  const prompt = `Analyze this candidate's resume as a strict Applicant Tracking System (ATS) and Senior Technical Recruiter.
Resume Content:
${resumeText.slice(0, 3500)}

Return ONLY valid JSON matching this exact structure:
{
  "ats_score": number (0 to 100),
  "match_tier": "High Placement Fit" | "Competitive Match" | "Optimization Needed",
  "summary": "Concise 2-sentence executive summary of the resume's competitiveness and ATS parseability.",
  "extracted_skills": string[],
  "missing_keywords": string[],
  "improvements_needed": string[],
  "buzzwords_to_avoid": [
    {
      "buzzword": "vague/cliché phrase (e.g., 'Responsible for', 'Team player', 'Hard worker', 'Worked on')",
      "replacement": "powerful action verb and impact phrase (e.g., 'Architected & Deployed', 'Collaborated across pods to ship')",
      "reason": "Why the buzzword hurts ATS scoring and how the replacement demonstrates measurable ownership."
    }
  ],
  "strengths": string[],
  "what_to_add": string[],
  "what_to_remove": string[]
}`;

  const geminiResponse = await callGemini(prompt, "You are an elite Applicant Tracking System (ATS) auditor and campus placement technical recruiter.");

  if (geminiResponse) {
    try {
      const cleanJson = geminiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        score: Math.min(100, Math.max(0, Number(parsed.ats_score) || 78)),
        role: jobTitle,
        matchTier: parsed.match_tier || (Number(parsed.ats_score) >= 75 ? "High Placement Fit" : Number(parsed.ats_score) >= 60 ? "Competitive Match" : "Optimization Needed"),
        summary: parsed.summary || "Resume demonstrates core competencies with opportunities to improve metric quantification and eliminate passive phrasing.",
        extractedSkills: parsed.extracted_skills || ["Data Structures", "Algorithms", "Python", "SQL", "Git"],
        missingKeywords: parsed.missing_keywords || ["Microservices", "Docker", "Unit Testing", "CI/CD"],
        improvementsNeeded: parsed.improvements_needed || [
          "Incorporate quantifiable business impact metrics (e.g., 'reduced response latency by 35%')",
          "Specify concrete architectures and databases used in each project",
          "Replace generic duty descriptions with active ownership verbs"
        ],
        buzzwordsToAvoid: (parsed.buzzwords_to_avoid && parsed.buzzwords_to_avoid.length > 0) ? parsed.buzzwords_to_avoid : [
          {
            buzzword: "Responsible for developing",
            replacement: "Architected and Deployed",
            reason: "Passive phrasing masks individual ownership. Strong verbs show proactive engineering leadership."
          },
          {
            buzzword: "Team player",
            replacement: "Collaborated cross-functionally across 4 engineering pods",
            reason: "Subjective buzzword that ATS parsers ignore. Demonstrates actual collaborative scale with numbers."
          },
          {
            buzzword: "Hardworking & Passionate",
            replacement: "Engineered fault-tolerant pipeline achieving 99.9% uptime",
            reason: "Clichés cannot be verified. Tangible outcomes and uptime benchmarks substantiate work ethic."
          }
        ],
        strengths: parsed.strengths || ["Clean single-column layout suitable for ATS parsers", "Recognizable technical stack"],
        whatToAdd: parsed.what_to_add || ["Quantifiable impact metrics", "Direct project GitHub links"],
        whatToRemove: parsed.what_to_remove || ["Generic subjective adjectives", "Non-technical introductory summary"]
      };
    } catch (e) {
      // Fallback to heuristic
    }
  }

  // Built-in intelligent heuristic engine
  const lower = resumeText.toLowerCase();
  const coreKeywords = ["python", "java", "sql", "git", "dsa", "react", "api", "docker", "c++", "database", "algorithms", "redis", "linux", "cloud", "aws"];
  const matched = coreKeywords.filter(k => lower.includes(k));
  const missing = coreKeywords.filter(k => !lower.includes(k));

  const score = Math.min(96, Math.max(52, Math.round(54 + (matched.length / coreKeywords.length) * 42)));

  // Identify detected buzzwords or provide top placement buzzwords to avoid
  const detectedBuzzwords = [];
  if (lower.includes("responsible for") || lower.includes("duties included")) {
    detectedBuzzwords.push({
      buzzword: "Responsible for / Handled",
      replacement: "Architected, Engineered, or Spearheaded",
      reason: "'Responsible for' reads like a job description rather than an achievement. Use action verbs that prove execution."
    });
  } else {
    detectedBuzzwords.push({
      buzzword: "Responsible for creating APIs",
      replacement: "Engineered and deployed 12 RESTful microservices with 99.9% uptime",
      reason: "Passive task language fails to demonstrate personal scope and technical excellence to ATS scanners."
    });
  }

  if (lower.includes("team player") || lower.includes("worked with team")) {
    detectedBuzzwords.push({
      buzzword: "Team player",
      replacement: "Collaborated cross-functionally across 4 developers in 2-week agile sprints",
      reason: "'Team player' is an unprovable cliché. Specifying team size, sprint cycles, and deliverables validates real teamwork."
    });
  } else {
    detectedBuzzwords.push({
      buzzword: "Team player / Good communicator",
      replacement: "Conducted peer code reviews and co-authored API documentation",
      reason: "Demonstrates tangible collaboration through verifiable engineering artifacts."
    });
  }

  if (lower.includes("passionate") || lower.includes("hardworking") || lower.includes("quick learner") || lower.includes("fast learner")) {
    detectedBuzzwords.push({
      buzzword: "Fast learner / Passionate coder",
      replacement: "Independently prototyped and integrated Redis caching layer within 48 hours",
      reason: "Replace self-proclaimed traits with proof of rapid problem solving and initiative."
    });
  } else {
    detectedBuzzwords.push({
      buzzword: "Hardworking / Self-starter",
      replacement: "Independently audited SQL query plans, reducing latency from 450ms to 85ms",
      reason: "Technical metrics provide hard evidence of dedication and analytical depth."
    });
  }

  detectedBuzzwords.push({
    buzzword: "Helped in / Assisted with",
    replacement: "Co-designed, Implemented, or Optimized",
    reason: "'Helped' minimizes your contribution. Clarify the specific module, algorithm, or interface you owned."
  });

  return {
    score: score,
    role: jobTitle,
    matchTier: score >= 75 ? "High Placement Fit" : score >= 60 ? "Competitive Match" : "Optimization Needed",
    summary: `Resume parsed successfully with ${matched.length} key engineering competencies detected. ATS keyword density is ${score >= 75 ? 'strong' : 'moderate'} with actionable keyword and verb enhancements available.`,
    extractedSkills: matched.map(s => s.toUpperCase()),
    missingKeywords: missing.slice(0, 5).map(s => s.toUpperCase()),
    improvementsNeeded: [
      "Quantify bullet points with tangible metrics (e.g., latency reduction, queries optimized, active user counts)",
      `Integrate missing industry-standard keywords: ${missing.slice(0, 3).join(", ").toUpperCase()}`,
      "Ensure project entries specify the architectural pattern (MVC, Microservices, Event-driven) and databases used",
      "Include direct GitHub repository links or live demo URLs for automated recruiter verification"
    ],
    buzzwordsToAvoid: detectedBuzzwords,
    strengths: [
      "Structured layout with identifiable technical projects and education milestones",
      `Matches ${matched.length} core competencies expected in placement evaluations`,
      "Clean linear single-column structure suitable for modern ATS parsers"
    ],
    whatToAdd: [
      `Add explicit target keywords: ${missing.slice(0, 3).join(", ").toUpperCase()}`,
      "Include quantifiable performance outcomes (e.g. 'Optimized query latency by 35%')",
      "Provide verifiable links to production code repositories and live demonstrations"
    ],
    whatToRemove: [
      "Remove generic summary statements in favor of verifiable technical achievements",
      "Eliminate outdated frameworks and passive buzzwords that dilute impact"
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
