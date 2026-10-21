import os
import json
import re
import random
import requests
from django.conf import settings

def get_gemini_api_key():
    raw = getattr(settings, "GEMINI_API_KEY", "") or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY") or ""
    return str(raw).strip().strip('"').strip("'")

def call_gemini(prompt, system_instruction="You are an expert placement trainer, technical recruiter, and AI evaluator.", temperature=0.7):
    """
    Calls Google Gemini API using REST endpoint or google-genai SDK.
    Returns response text or raises an exception.
    """
    api_key = get_gemini_api_key()
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured.")

    # Try Google GenAI SDK first
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model='gemini-3.5-flash-lite',
            contents=prompt,
        )
        if response and response.text:
            return response.text
    except Exception as e_sdk:
        pass

    # Try direct REST endpoint with active Gemini models
    models = ["gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.8-flash"]
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": 4096,
            }
        }
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=25)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"]
            else:
                print(f"Gemini REST error ({model}): {resp.status_code} - {resp.text[:200]}")
        except Exception as e_rest:
            print(f"Gemini REST exception ({model}): {e_rest}")

    raise RuntimeError("Failed to communicate with Gemini API.")

def clean_json_response(text):
    """
    Cleans markdown code fences and returns parsed JSON.
    """
    if not text:
        return None
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.MULTILINE)
        cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.MULTILINE)
    cleaned = cleaned.strip()

    # Find the outermost { ... } or [ ... ]
    match = re.search(r"(\{.*\}|\[.*\])", cleaned, re.DOTALL)
    if match:
        cleaned = match.group(1)

    try:
        return json.loads(cleaned)
    except Exception as e:
        print(f"JSON parse error on: {cleaned[:300]}... Error: {e}")
        return None

# =========================================================================
# 1. RESUME ATS ANALYSIS WITH GEMINI
# =========================================================================

def analyze_resume_ats(resume_text, job_title="Software Developer", job_description=""):
    """
    Evaluates candidate resume against the selected job description using Gemini.
    Provides ATS score (0-100), summary, what to add, what to remove, and strengths.
    """
    prompt = f"""
You are a senior ATS (Applicant Tracking System) specialist and technical hiring director.
Analyze the following candidate resume for the target job role.

TARGET ROLE: {job_title}
JOB DESCRIPTION / REQUIREMENTS:
{job_description or "Strong knowledge of data structures, algorithms, problem-solving, modern programming languages, system design, databases, teamwork, and software development practices."}

CANDIDATE RESUME CONTENT:
\"\"\"
{resume_text[:6000]}
\"\"\"

Carefully evaluate keywords match, technical skills, project relevance, quantifiable achievements, formatting/clarity, and role readiness.
Respond STRICTLY with a valid JSON object without any additional text or markdown formatting:
{{
  "ats_score": <integer from 0 to 100>,
  "role_fit": "<Excellent / Strong / Moderate / Needs Significant Improvement>",
  "summary": "<Concise 2-3 sentence assessment of candidate fit for this role>",
  "strengths": [
    "<Key strength or well-matching qualification 1>",
    "<Key strength or qualification 2>",
    "<Key strength or qualification 3>"
  ],
  "what_to_add": [
    "<Specific technical skill, missing keyword, or project type to add>",
    "<Another recommendation to add to boost ATS match>",
    "<Another specific addition (e.g. metrics, certifications, specific tools)>"
  ],
  "what_to_remove": [
    "<Irrelevant skill, outdated tool, or generic buzzword to remove>",
    "<Vague bullet point or formatting practice to fix or remove>",
    "<Another element to eliminate to improve ATS parsing>"
  ]
}}
"""
    try:
        raw_output = call_gemini(prompt, temperature=0.3)
        parsed = clean_json_response(raw_output)
        if parsed and isinstance(parsed, dict) and "ats_score" in parsed:
            # Ensure valid bounds and list formats
            ats_score = int(parsed.get("ats_score", 65))
            parsed["ats_score"] = max(10, min(99, ats_score))
            if not isinstance(parsed.get("strengths"), list):
                parsed["strengths"] = [str(parsed.get("strengths", ""))]
            if not isinstance(parsed.get("what_to_add"), list):
                parsed["what_to_add"] = [str(parsed.get("what_to_add", ""))]
            if not isinstance(parsed.get("what_to_remove"), list):
                parsed["what_to_remove"] = [str(parsed.get("what_to_remove", ""))]
            return parsed
    except Exception as e:
        print(f"Gemini ATS Analysis error: {e}. Utilizing smart heuristic fallback.")

    # Fallback heuristic analyzer if Gemini is unavailable
    return fallback_ats_analysis(resume_text, job_title, job_description)

def fallback_ats_analysis(resume_text, job_title, job_description):
    """
    Intelligent heuristic fallback analyzer when API key is missing or quota exceeded.
    """
    text_lower = resume_text.lower()
    
    role_keywords = {
        "software dev": ["python", "java", "c++", "data structures", "algorithms", "git", "sql", "api", "rest", "oop", "docker", "testing"],
        "frontend": ["html", "css", "javascript", "react", "typescript", "vue", "tailwind", "redux", "ui", "ux", "responsive", "webpack"],
        "backend": ["python", "django", "node.js", "express", "sql", "postgresql", "mongodb", "redis", "docker", "rest api", "microservices", "aws"],
        "data engineer": ["python", "sql", "spark", "hadoop", "etl", "pandas", "airflow", "kafka", "data pipeline", "aws", "snowflake", "big data"],
        "engineer": ["problem solving", "debugging", "system design", "architecture", "git", "ci/cd", "linux", "cloud", "agile", "collaboration"]
    }

    matched_role_key = "software dev"
    for k in role_keywords:
        if k in job_title.lower():
            matched_role_key = k
            break

    target_keywords = role_keywords.get(matched_role_key, role_keywords["software dev"])
    found_keywords = [kw for kw in target_keywords if kw in text_lower]
    missing_keywords = [kw for kw in target_keywords if kw not in text_lower]

    ratio = len(found_keywords) / max(len(target_keywords), 1)
    base_score = int(45 + (ratio * 45))
    base_score = max(35, min(92, base_score))

    strengths = [f"Found core competencies: {', '.join(found_keywords[:3]).title()}"] if found_keywords else ["Demonstrated foundational academic or project experience."]
    if len(found_keywords) >= 4:
        strengths.append(f"Demonstrates alignment with {', '.join(found_keywords[3:6]).title()}.")
    strengths.append("Structured format with identifiable project and education segments.")

    what_to_add = [f"Add high-impact keywords for {job_title}: {', '.join(missing_keywords[:3]).title()}"] if missing_keywords else ["Add quantifiable performance metrics (e.g. 'Reduced latency by 30%')."]
    what_to_add.append("Include links to live demo deployments, GitHub repositories, or technical writeups.")
    what_to_add.append(f"Tailor section headings explicitly matching the '{job_title}' job specifications.")

    what_to_remove = [
        "Remove generic subjective statements like 'Hardworking team player' in favor of concrete achievements.",
        "Remove outdated technologies or irrelevant non-technical hobbies that distract ATS scanners.",
        "Avoid multi-column tables or complex graphical headers that can confuse standard ATS parsers."
    ]

    fit = "Strong" if base_score >= 75 else ("Moderate" if base_score >= 55 else "Needs Improvement")

    return {
        "ats_score": base_score,
        "role_fit": fit,
        "summary": f"Resume exhibits a {base_score}% match with target role requirements for {job_title}. Key skills were identified, but strategic keyword alignment and quantifiable achievements will maximize interview shortlisting.",
        "strengths": strengths,
        "what_to_add": what_to_add,
        "what_to_remove": what_to_remove,
    }

# =========================================================================
# 2. 30 MCQ QUESTIONS GENERATION WITH GEMINI (PLACEMENT PREPARATION LEVEL)
# =========================================================================

def generate_mcq_test(languages, count=30):
    """
    Generates placement preparation level MCQs for chosen languages.
    Guarantee 30 questions with 4 options each and distinct questions per test attempt.
    """
    lang_str = ", ".join(languages) if isinstance(languages, list) else str(languages)
    if not lang_str:
        lang_str = "Python, Data Structures & Algorithms, Problem Solving"

    salt = random.randint(1000, 99999)

    prompt = f"""
You are a senior technical interviewer preparing a college/campus placement exam.
Generate exactly {count} distinct multiple-choice questions (MCQs) for campus placement preparation.

TOPICS / LANGUAGES SELECTED: {lang_str}
DIFFICULTY LEVEL: Campus Placement Preparation (Mix of moderate to high difficulty: syntax nuances, algorithmic complexity, memory management, output prediction, edge cases, system design fundamentals).
RANDOM SEED: {salt} (Ensure questions are unique and fresh every time).

STRICT RULES:
1. Provide exactly {count} questions numbered 1 to {count}.
2. Each question MUST have exactly 4 choices: "A", "B", "C", "D".
3. Provide the correct answer text or option.
4. Provide a clear, short 1-2 sentence explanation.
5. Return ONLY a valid JSON array of objects. No markdown, no preface, no trailing text.

JSON FORMAT:
[
  {{
    "id": 1,
    "topic": "Language/Topic name",
    "question": "Clear technical question or output prediction code snippet",
    "options": ["Option text 1", "Option text 2", "Option text 3", "Option text 4"],
    "answer": "Exact text of the correct option or A/B/C/D",
    "explanation": "Why this answer is correct."
  }},
  ...
]
"""
    try:
        raw_output = call_gemini(prompt, temperature=0.85)
        parsed = clean_json_response(raw_output)
        if parsed and isinstance(parsed, list) and len(parsed) >= 15:
            # Normalize questions
            formatted = []
            for i, q in enumerate(parsed[:count]):
                opts = q.get("options", [])
                if len(opts) < 4:
                    opts = (opts + ["None of the above", "All of the above", "Undefined", "Compilation Error"])[:4]
                formatted.append({
                    "id": i + 1,
                    "topic": q.get("topic", lang_str),
                    "question": q.get("question", f"Question {i+1}"),
                    "options": opts[:4],
                    "answer": q.get("answer", opts[0]),
                    "explanation": q.get("explanation", "Standard placement concept.")
                })
            # If slightly short of 30, supplement from fallback bank
            if len(formatted) < count:
                supplement = get_fallback_mcq_bank(languages, count - len(formatted))
                for s in supplement:
                    s["id"] = len(formatted) + 1
                    formatted.append(s)
            return formatted[:count]
    except Exception as e:
        print(f"Gemini MCQ Generation error: {e}. Using curated placement question bank.")

    # Curated placement question bank guaranteeing 30 unique questions
    return get_fallback_mcq_bank(languages, count)

def get_fallback_mcq_bank(languages, count=30):
    """
    Curated placement questions bank covering Python, Java, C++, JS, SQL, and DSA.
    """
    pool = [
        # Python
        {
            "topic": "Python",
            "question": "What will be the output of print(type(lambda: None)) in Python 3?",
            "options": ["<class 'function'>", "<class 'lambda'>", "<class 'NoneType'>", "SyntaxError"],
            "answer": "<class 'function'>",
            "explanation": "Lambdas in Python are anonymous function instances belonging to class 'function'."
        },
        {
            "topic": "Python",
            "question": "What is the time complexity of searching an element in a Python dictionary (average case)?",
            "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            "answer": "O(1)",
            "explanation": "Python dictionaries are implemented as hash tables, giving average O(1) lookup time."
        },
        {
            "topic": "Python",
            "question": "What is the output of print([i for i in range(5) if i % 2 == 0])?",
            "options": ["[0, 2, 4]", "[2, 4]", "[1, 3, 5]", "[0, 1, 2, 3, 4]"],
            "answer": "[0, 2, 4]",
            "explanation": "The list comprehension filters numbers from 0 to 4 that are divisible by 2 with remainder 0."
        },
        {
            "topic": "Python",
            "question": "Which of the following creates a shallow copy of a list 'a' in Python?",
            "options": ["a.copy()", "a[:]", "list(a)", "All of the above"],
            "answer": "All of the above",
            "explanation": "a.copy(), slicing a[:], and list(a) all create shallow copies of list 'a'."
        },
        {
            "topic": "Python",
            "question": "In Python, which built-in function returns an iterator of tuples containing index and value?",
            "options": ["enumerate()", "zip()", "map()", "filter()"],
            "answer": "enumerate()",
            "explanation": "enumerate() adds a counter to an iterable and returns it as an enumerate object."
        },
        {
            "topic": "Python",
            "question": "What does the GIL (Global Interpreter Lock) in CPython prevent?",
            "options": [
                "Multiple native threads from executing Python bytecodes simultaneously",
                "Memory leaks in garbage collection",
                "Recursive function stack overflows",
                "Deadlocks in async programming"
            ],
            "answer": "Multiple native threads from executing Python bytecodes simultaneously",
            "explanation": "GIL is a mutex that prevents multiple OS threads from executing CPython bytecodes at once."
        },
        # DSA / Algorithms
        {
            "topic": "Data Structures",
            "question": "Which data structure is optimal for implementing LRU (Least Recently Used) cache with O(1) operations?",
            "options": ["Doubly Linked List + Hash Map", "Queue + Stack", "Binary Search Tree", "Max Heap"],
            "answer": "Doubly Linked List + Hash Map",
            "explanation": "Hash map gives O(1) key access while Doubly Linked List gives O(1) node removal and re-insertion."
        },
        {
            "topic": "Algorithms",
            "question": "What is the worst-case time complexity of QuickSort when bad pivot selection occurs?",
            "options": ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"],
            "answer": "O(n^2)",
            "explanation": "When the smallest or largest element is consistently picked as the pivot, QuickSort degrades to O(n^2)."
        },
        {
            "topic": "Data Structures",
            "question": "In a max-heap of n elements, what is the time complexity to find the maximum element?",
            "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            "answer": "O(1)",
            "explanation": "In a max-heap, the maximum element is always at the root, accessible in O(1) time."
        },
        {
            "topic": "Algorithms",
            "question": "Dijkstra's algorithm cannot handle graphs with which of the following?",
            "options": ["Negative edge weights", "Directed edges", "Cycles with positive weights", "Multiple paths"],
            "answer": "Negative edge weights",
            "explanation": "Dijkstra assumes path costs never decrease with added edges; negative edges violate this greediness."
        },
        {
            "topic": "Data Structures",
            "question": "What is the minimum number of queues needed to implement a stack?",
            "options": ["2", "1", "3", "Not possible"],
            "answer": "2",
            "explanation": "A stack can be simulated using two queues by pushing and popping elements between them (or 1 with recursion)."
        },
        {
            "topic": "Algorithms",
            "question": "What is the space complexity of Breadth-First Search (BFS) on a balanced tree with branching factor b and depth d?",
            "options": ["O(b^d)", "O(d)", "O(b * d)", "O(1)"],
            "answer": "O(b^d)",
            "explanation": "BFS stores all nodes of the current frontier in memory, which in worst case has O(b^d) leaves."
        },
        # Java / OOP
        {
            "topic": "Java & OOP",
            "question": "In Java, can an interface have concrete methods?",
            "options": [
                "Yes, using 'default' or 'static' keywords (Java 8+)",
                "No, interfaces only contain abstract methods",
                "Only if the interface is marked private",
                "Only using final keywords"
            ],
            "answer": "Yes, using 'default' or 'static' keywords (Java 8+)",
            "explanation": "Java 8 introduced default and static methods in interfaces with complete implementation bodies."
        },
        {
            "topic": "Java & OOP",
            "question": "Which principle of OOP states that subclasses should be substitutable for their base classes?",
            "options": ["Liskov Substitution Principle", "Open/Closed Principle", "Single Responsibility", "Interface Segregation"],
            "answer": "Liskov Substitution Principle",
            "explanation": "The 'L' in SOLID stands for Liskov Substitution Principle."
        },
        {
            "topic": "Java & OOP",
            "question": "What happens if you don't override hashCode() when overriding equals() in Java?",
            "options": [
                "Equal objects may produce different hash codes breaking hash-based collections",
                "Compilation error",
                "Garbage collector crashes",
                "NullPointerException on object creation"
            ],
            "answer": "Equal objects may produce different hash codes breaking hash-based collections",
            "explanation": "Hash collections like HashMap rely on equals() objects returning the same hashCode()."
        },
        # C++ / Systems
        {
            "topic": "C++",
            "question": "What is the purpose of the 'virtual' keyword in C++ member functions?",
            "options": [
                "To enable dynamic (runtime) polymorphism",
                "To make the function static",
                "To allocate memory on heap",
                "To prevent function overriding"
            ],
            "answer": "To enable dynamic (runtime) polymorphism",
            "explanation": "Virtual functions allow derived classes to override methods and resolve calls via vtable at runtime."
        },
        {
            "topic": "C++",
            "question": "Which smart pointer in modern C++ (C++11) represents exclusive ownership with no copy allowed?",
            "options": ["std::unique_ptr", "std::shared_ptr", "std::weak_ptr", "std::auto_ptr"],
            "answer": "std::unique_ptr",
            "explanation": "std::unique_ptr uniquely owns the underlying object and cannot be copied, only moved."
        },
        # JavaScript / Web
        {
            "topic": "JavaScript",
            "question": "What will console.log(typeof NaN) output in JavaScript?",
            "options": ["number", "NaN", "undefined", "object"],
            "answer": "number",
            "explanation": "NaN stands for Not-a-Number, but its numeric type in the ECMAScript spec is 'number'."
        },
        {
            "topic": "JavaScript",
            "question": "What is the execution order of microtasks (e.g. Promises) vs macrotasks (e.g. setTimeout) in JS event loop?",
            "options": [
                "All microtasks run before the next macrotask",
                "Macrotasks always run first",
                "They alternate one by one",
                "Random depending on CPU"
            ],
            "answer": "All microtasks run before the next macrotask",
            "explanation": "The microtask queue is fully cleared after the current script and before the next macrotask execution."
        },
        {
            "topic": "JavaScript",
            "question": "What is the difference between '==' and '===' in JavaScript?",
            "options": [
                "'===' checks both value and type without type coercion",
                "'==' is faster than '==='",
                "'===' performs type casting automatically",
                "There is no difference"
            ],
            "answer": "'===' checks both value and type without type coercion",
            "explanation": "'===' is strict equality comparison which forbids implicit type conversion."
        },
        # SQL / DBMS
        {
            "topic": "SQL & DBMS",
            "question": "What is the ACID property that guarantees transactions are committed permanently even in case of power failure?",
            "options": ["Durability", "Atomicity", "Consistency", "Isolation"],
            "answer": "Durability",
            "explanation": "Durability guarantees that once a transaction is committed, changes survive system failure."
        },
        {
            "topic": "SQL & DBMS",
            "question": "Which SQL clause is used to filter records after aggregate grouping?",
            "options": ["HAVING", "WHERE", "GROUP BY", "ORDER BY"],
            "answer": "HAVING",
            "explanation": "WHERE filters rows before aggregation, while HAVING filters aggregated group results."
        },
        {
            "topic": "SQL & DBMS",
            "question": "What type of index is physically stored in the same order as rows in the table?",
            "options": ["Clustered Index", "Non-clustered Index", "Bitmap Index", "Secondary Index"],
            "answer": "Clustered Index",
            "explanation": "A clustered index sorts and stores data rows in the table based on their key values."
        },
        # Operating Systems / Networking
        {
            "topic": "Operating Systems",
            "question": "Which scheduling algorithm is non-preemptive and can cause the convoy effect?",
            "options": ["First-Come, First-Served (FCFS)", "Round Robin", "Shortest Remaining Time First", "Priority Preemptive"],
            "answer": "First-Come, First-Served (FCFS)",
            "explanation": "FCFS suffers from the convoy effect when short processes wait behind a long CPU-intensive process."
        },
        {
            "topic": "Operating Systems",
            "question": "What is thrashing in virtual memory management?",
            "options": [
                "When the CPU spends more time paging than executing instructions",
                "When cache memory is full",
                "When deadlock occurs among threads",
                "When processes run out of disk swap space"
            ],
            "answer": "When the CPU spends more time paging than executing instructions",
            "explanation": "Thrashing occurs when high page fault frequency causes continuous disk I/O over computation."
        },
        {
            "topic": "Computer Networks",
            "question": "How many packets are exchanged in the standard TCP 3-way handshake to establish a connection?",
            "options": ["3 (SYN, SYN-ACK, ACK)", "2 (SYN, ACK)", "4 (SYN, ACK, SYN, ACK)", "1 (CONNECT)"],
            "answer": "3 (SYN, SYN-ACK, ACK)",
            "explanation": "Client sends SYN, server responds with SYN-ACK, and client finishes with ACK."
        },
        {
            "topic": "Computer Networks",
            "question": "Which protocol operates at the Application Layer of the OSI model and provides secure web browsing?",
            "options": ["HTTPS", "TCP", "IP", "TLS"],
            "answer": "HTTPS",
            "explanation": "HTTPS is an Application Layer protocol running over TLS/TCP on port 443."
        },
        {
            "topic": "Software Engineering",
            "question": "Which design pattern ensures a class has only one instance and provides global access to it?",
            "options": ["Singleton Pattern", "Factory Pattern", "Observer Pattern", "Adapter Pattern"],
            "answer": "Singleton Pattern",
            "explanation": "Singleton restricts instantiation of a class to a single object."
        },
        {
            "topic": "Data Structures",
            "question": "What is the height of an AVL tree with n nodes?",
            "options": ["O(log n)", "O(n)", "O(n log n)", "O(sqrt(n))"],
            "answer": "O(log n)",
            "explanation": "AVL trees are self-balancing binary search trees where height difference is at most 1, preserving O(log n)."
        },
        {
            "topic": "Algorithms",
            "question": "Which algorithmic paradigm does Merge Sort utilize?",
            "options": ["Divide and Conquer", "Dynamic Programming", "Greedy Approach", "Backtracking"],
            "answer": "Divide and Conquer",
            "explanation": "Merge sort divides the array in halves, recursively sorts them, and merges the sorted halves."
        },
        {
            "topic": "System Design",
            "question": "In distributed systems, what does the CAP theorem state is impossible to guarantee simultaneously in presence of network partitions?",
            "options": [
                "Consistency and Availability",
                "Latency and Throughput",
                "Security and Scalability",
                "Durability and Atomicity"
            ],
            "answer": "Consistency and Availability",
            "explanation": "Under network partition (P), a distributed system can choose Consistency (C) or Availability (A), but not both."
        }
    ]

    # Shuffle to ensure freshness
    random.shuffle(pool)
    selected = pool[:count]
    
    # If count > len(pool), duplicate with slight variations
    while len(selected) < count:
        item = pool[len(selected) % len(pool)].copy()
        selected.append(item)

    for i, item in enumerate(selected):
        item["id"] = i + 1

    return selected[:count]

# =========================================================================
# 3. INTERVIEW QUESTIONS GENERATION WITH GEMINI
# =========================================================================

def generate_interview_questions(role_or_tech="Software Development"):
    """
    Generates placement interview questions including personal introduction,
    future career aspirations, technical problems, and behavioral scenarios.
    """
    prompt = f"""
You are an expert HR and Technical Placement Interviewer for top tech companies.
Generate 5 diverse, professional placement interview questions for a candidate applying for: {role_or_tech}.

REQUIRED QUESTION TYPES:
1. Warmup / Self Introduction (e.g., Introduce yourself, engineering background, and core passions).
2. Future Aspirations & Goals (e.g., Where do you see yourself in 5 years? How does this role align with your ambitions?).
3. Technical Problem Solving & Debugging (e.g., Describe a complex bug or technical engineering hurdle you encountered and solved).
4. System & Software Quality (e.g., How do you design applications for scalability, maintainability, and clean code?).
5. Teamwork & Conflict Resolution (e.g., Tell us about a time you handled disagreement or a tight deadline).

STRICT RULES:
Return ONLY a valid JSON array of 5 objects. No markdown, no preface.
JSON FORMAT:
[
  {{
    "id": 1,
    "category": "Introduction",
    "question": "...",
    "expected_focus": "..."
  }},
  ...
]
"""
    try:
        raw_output = call_gemini(prompt, temperature=0.7)
        parsed = clean_json_response(raw_output)
        if parsed and isinstance(parsed, list) and len(parsed) >= 3:
            return parsed
    except Exception as e:
        print(f"Gemini Interview Questions error: {e}. Using curated placement interview set.")

    # High quality standard placement interview questions
    return [
        {
            "id": 1,
            "category": "Introduction & Background",
            "question": "Please introduce yourself, highlight your technical journey, and tell us what drives your passion for software engineering.",
            "expected_focus": "Clear communication, education, key technical projects, passion for engineering."
        },
        {
            "id": 2,
            "category": "Career Vision & Aspirations",
            "question": "Where do you see yourself 5 years from now in your career, and how does this role fit into that vision?",
            "expected_focus": "Goal orientation, realistic growth trajectory, commitment to learning, leadership or technical mastery."
        },
        {
            "id": 3,
            "category": "Technical Problem Solving",
            "question": "Can you describe a challenging technical problem or difficult bug you encountered in a project and how you diagnosed and resolved it?",
            "expected_focus": "Debugging mindset, systematic analysis, understanding root cause, outcome."
        },
        {
            "id": 4,
            "category": "Code Quality & Scalability",
            "question": "When designing and writing code, what principles and best practices do you follow to ensure the software is maintainable, clean, and scalable?",
            "expected_focus": "Modular design, OOP/SOLID principles, code reviews, testing, performance optimization."
        },
        {
            "id": 5,
            "category": "Behavioral & Collaboration",
            "question": "Tell us about a time you had to work under a tight deadline or collaborate with someone with a different viewpoint. How did you manage it?",
            "expected_focus": "Team collaboration, adaptability, emotional intelligence, constructive conflict resolution."
        }
    ]

# =========================================================================
# 4. INTERVIEW ANSWER EVALUATION WITH GEMINI
# =========================================================================

def evaluate_interview_answer(question_text, spoken_transcript, role="Software Engineer"):
    """
    Evaluates candidate's spoken response using Gemini.
    Returns score percentage (0-100), verdict, positive feedback, and improvement suggestions.
    """
    if not spoken_transcript or len(spoken_transcript.strip()) < 5:
        return {
            "score_percentage": 15,
            "is_correct_or_good": False,
            "verdict": "Insufficient or Inaudible Response",
            "feedback": "The response was too brief or could not be detected clearly.",
            "improvement_tips": "Please elaborate with structured examples using the STAR method (Situation, Task, Action, Result)."
        }

    prompt = f"""
You are a senior hiring manager and communication coach conducting a placement interview evaluation.
Role: {role}

INTERVIEW QUESTION:
\"{question_text}\"

CANDIDATE'S SPOKEN TRANSCRIPT:
\"{spoken_transcript}\"

Evaluate the candidate's answer for:
1. Relevance to the question.
2. Depth of technical knowledge or behavioral maturity.
3. Clarity, structure, and articulation.
4. Suggestions for concrete improvement.

STRICT RULES:
Return ONLY a valid JSON object. No markdown, no preface.
FORMAT:
{{
  "score_percentage": <number between 0 and 100>,
  "is_correct_or_good": <true or false>,
  "verdict": "<Strong / Good / Average / Needs Substantial Improvement>",
  "feedback": "<Detailed positive and constructive analysis of what the candidate answered>",
  "improvement_tips": "<Clear, actionable recommendations on what to add, refine, or state better>"
}}
"""
    try:
        raw_output = call_gemini(prompt, temperature=0.3)
        parsed = clean_json_response(raw_output)
        if parsed and isinstance(parsed, dict) and "score_percentage" in parsed:
            score = int(parsed.get("score_percentage", 60))
            parsed["score_percentage"] = max(10, min(100, score))
            return parsed
    except Exception as e:
        print(f"Gemini Interview Evaluation error: {e}. Utilizing fallback scoring.")

    # Fallback heuristic evaluation
    words = spoken_transcript.strip().split()
    word_count = len(words)
    
    score = min(85, max(40, int(35 + (word_count * 0.8))))
    is_good = score >= 60

    return {
        "score_percentage": score,
        "is_correct_or_good": is_good,
        "verdict": "Good Response" if score >= 70 else ("Satisfactory" if score >= 55 else "Needs Improvement"),
        "feedback": f"Addressed the question with approximately {word_count} spoken words. Communicated the core thought clearly.",
        "improvement_tips": "Incorporate specific technical keywords, real project metrics, and follow the STAR technique to elevate your answer to senior level."
    }
