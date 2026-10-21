"""
Backward-compatible wrapper routing to the unified Gemini AI engine.
"""
from Placement.ai.gemini_engine import (
    generate_mcq_test,
    get_fallback_mcq_bank,
    generate_interview_questions,
    evaluate_interview_answer,
    analyze_resume_ats
)

def generate_ai_questions(technology):
    techs = [t.strip() for t in technology.split(",") if t.strip()] if isinstance(technology, str) else technology
    return generate_mcq_test(techs, count=30)

def get_fallback_questions(technology):
    return get_fallback_mcq_bank([technology], count=30)