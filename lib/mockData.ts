import { StudentProfile, ReadinessProgress, JobOpportunity, ScheduledTest, AssessmentRecord, MCQQuestion } from './types';

export const initialProfile: StudentProfile = {
  name: "Abhay Raj Singh",
  technology: "Software Engineering Track",
  gpa: 8.8,
  degree: "B.Tech Computer Science"
};

export const initialProgress: ReadinessProgress = {
  overall_readiness: 72,
  resume_score: 84,
  mock_score: 73,
  interview_score: 65,
  resume_completed: true,
  mock_passed: true,
  interview_passed: true
};

export const defaultJobs: JobOpportunity[] = [
  { id: 1, title: "Software Development Engineer", company: "Google", salary: "₹32 - ₹45 LPA", location: "Bangalore / Hyderabad" },
  { id: 2, title: "Backend Engineer (Distributed Systems)", company: "Microsoft", salary: "₹28 - ₹42 LPA", location: "Hyderabad" },
  { id: 3, title: "Systems Engineer (Java/Python)", company: "Amazon", salary: "₹30 - ₹44 LPA", location: "Bangalore" },
  { id: 4, title: "Full Stack Platform Engineer", company: "Atlassian", salary: "₹26 - ₹38 LPA", location: "Bengaluru" },
  { id: 5, title: "Cloud & Reliability Engineer", company: "Uber", salary: "₹34 - ₹48 LPA", location: "Bangalore" },
  { id: 6, title: "High-Frequency Data Systems Developer", company: "Flipkart", salary: "₹24 - ₹36 LPA", location: "Bengaluru" }
];

export const initialScheduledTests: ScheduledTest[] = [
  { id: 1, test_type: "Full Placement Simulation", date: "Nov 22, 2026", time: "10:00 AM" },
  { id: 2, test_type: "30 MCQ Technical Assessment", date: "Nov 24, 2026", time: "02:30 PM" }
];

export const initialAssessmentRecords: AssessmentRecord[] = [
  { id: 101, type: "30 MCQ Technical", technology: "Data Structures & Algorithms", date: "Nov 18, 2026 • 19:40", violations: 0, score: 80, passed: true },
  { id: 102, type: "AI Voice Interview", technology: "System Architecture & Core CS", date: "Nov 17, 2026 • 14:15", violations: 0, score: 72, passed: true },
  { id: 103, type: "30 MCQ Technical", technology: "Python & Backend Systems", date: "Nov 16, 2026 • 11:30", violations: 1, score: 58, passed: false },
  { id: 104, type: "AI Voice Interview", technology: "Behavioral & STAR Leadership", date: "Nov 14, 2026 • 16:00", violations: 0, score: 78, passed: true }
];

export const defaultQuestionsBank: MCQQuestion[] = [
  // DSA
  {
    id: 1,
    category: "Data Structures",
    question: "What is the worst-case time complexity of searching in an unbalanced Binary Search Tree (BST)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct: 2,
    explanation: "When a BST degrades into a linear skewed linked list, worst-case search becomes linear O(n)."
  },
  {
    id: 2,
    category: "Data Structures",
    question: "Which data structure is primarily used to implement LRU (Least Recently Used) cache with O(1) operations?",
    options: ["Array and Stack", "Doubly Linked List and Hash Map", "Min-Heap and Binary Search Tree", "Circular Queue and Graph"],
    correct: 1,
    explanation: "A Hash Map provides O(1) key lookups, while a Doubly Linked List allows O(1) removal and insertion at head/tail."
  },
  {
    id: 3,
    category: "Algorithms",
    question: "Which algorithm finds the single-source shortest path on a weighted graph with non-negative edge weights?",
    options: ["Bellman-Ford Algorithm", "Dijkstra's Algorithm", "Floyd-Warshall Algorithm", "Kruskal's Algorithm"],
    correct: 1,
    explanation: "Dijkstra's algorithm efficiently computes shortest paths using a priority queue when edge weights are non-negative."
  },
  {
    id: 4,
    category: "Algorithms",
    question: "What is the time complexity of building a heap from an unordered array of n elements?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    correct: 1,
    explanation: "Using the bottom-up Floyd's heap construction algorithm (heapify), total operations sum to O(n)."
  },
  {
    id: 5,
    category: "Operating Systems",
    question: "Which of the following is NOT a necessary condition for a deadlock to occur?",
    options: ["Mutual Exclusion", "Hold and Wait", "Preemption allowed", "Circular Wait"],
    correct: 2,
    explanation: "The four Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Preemption breaks deadlocks."
  },
  {
    id: 6,
    category: "Operating Systems",
    question: "What is thrashing in an operating system?",
    options: [
      "A condition where CPU utilization drops because system spends more time swapping pages than executing instructions",
      "When two threads access shared memory without a lock",
      "When disk sectors get corrupt due to power failure",
      "A hardware interrupt loop caused by runaway peripheral devices"
    ],
    correct: 0,
    explanation: "Thrashing occurs when high memory demand leads to constant page faults and disk I/O, driving CPU utilization down."
  },
  {
    id: 7,
    category: "Database Systems",
    question: "In relational database ACID properties, what does 'Isolation' guarantee?",
    options: [
      "Data changes are written permanently to non-volatile storage",
      "Transactions execute independently without concurrent interference",
      "All statements in a transaction succeed or all fail together",
      "Database transitions only between valid states conforming to constraints"
    ],
    correct: 1,
    explanation: "Isolation ensures concurrent execution of transactions leaves the database in the same state as if executed serially."
  },
  {
    id: 8,
    category: "Database Systems",
    question: "Which normal form eliminates partial functional dependency on a composite primary key?",
    options: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
    correct: 1,
    explanation: "2NF requires the table to be in 1NF and all non-key attributes to be fully functionally dependent on the primary key."
  },
  {
    id: 9,
    category: "System Design",
    question: "What does the CAP theorem state regarding distributed data stores?",
    options: [
      "A distributed system can guarantee at most two out of Consistency, Availability, and Partition Tolerance",
      "Concurrency, Atomicity, and Performance cannot be achieved simultaneously",
      "Cache, Application, and Persistence layers must scale at equal ratios",
      "CPU, Array storage, and Paging must be isolated across nodes"
    ],
    correct: 0,
    explanation: "In the presence of a network partition (P), a distributed system must choose between Consistency (C) and Availability (A)."
  },
  {
    id: 10,
    category: "System Design",
    question: "Which consistent hashing benefit is most valuable when scaling out a distributed cache cluster?",
    options: [
      "Minimizes the number of keys that need to be remapped when a node is added or removed",
      "Ensures zero replication delay across availability zones",
      "Converts synchronous REST requests into asynchronous pub/sub topics",
      "Compresses cache values using Huffman encoding"
    ],
    correct: 0,
    explanation: "Consistent hashing only requires K/N keys to be remapped on average when a node joins or leaves, preventing cache stampedes."
  },
  {
    id: 11,
    category: "Python",
    question: "What is the purpose of Python's Global Interpreter Lock (GIL) in CPython?",
    options: [
      "Ensures only one native thread executes Python bytecode at a time to prevent race conditions in CPython memory management",
      "Locks global variables from being modified inside functions",
      "Encrypts compiled .pyc files for security",
      "Prevents recursive functions from causing stack overflow"
    ],
    correct: 0,
    explanation: "The GIL protects CPython's reference counting mechanism against multi-threaded race conditions."
  },
  {
    id: 12,
    category: "Python",
    question: "What is the output of `bool([])`, `bool([0])`, and `bool('')` in Python?",
    options: ["False, False, False", "False, True, False", "True, True, True", "False, False, True"],
    correct: 1,
    explanation: "Empty sequence types evaluate to False, but `[0]` is a non-empty list containing an integer, so it evaluates to True."
  },
  {
    id: 13,
    category: "Java",
    question: "What is the difference between `==` and `.equals()` when comparing two String objects in Java?",
    options: [
      "`==` compares memory reference addresses, while `.equals()` compares character sequence values",
      "`.equals()` compares memory references, while `==` compares contents",
      "`==` is used only for primitive numbers, not objects",
      "There is no difference; Java compiler treats them identically"
    ],
    correct: 0,
    explanation: "`==` tests reference identity (whether both variables point to the exact same object in heap), while `String.equals()` compares contents."
  },
  {
    id: 14,
    category: "Java",
    question: "Which Java Collection class is thread-safe and allows concurrent reads without locking?",
    options: ["ArrayList", "ConcurrentHashMap", "HashMap", "Vector"],
    correct: 1,
    explanation: "ConcurrentHashMap uses bucket-level locking and volatile reads, allowing high-throughput concurrent reads and writes."
  },
  {
    id: 15,
    category: "C++",
    question: "In C++, what does a `virtual` destructor in a base class ensure?",
    options: [
      "Correct derived class destructor is invoked when deleting an object through a base class pointer",
      "The class cannot be instantiated directly",
      "The destructor executes in a background thread",
      "Memory is automatically garbage collected"
    ],
    correct: 0,
    explanation: "Without a virtual destructor, deleting a derived object via a base pointer leads to undefined behavior and resource leaks."
  },
  {
    id: 16,
    category: "C++",
    question: "What is the key advantage of move semantics (`std::move` and rvalue references) introduced in C++11?",
    options: [
      "Transfers ownership of expensive heap resources rather than performing deep memory copies",
      "Forces variables to stay in CPU L1 cache",
      "Enables multi-threading without mutexes",
      "Replaces all pointers with smart pointers at compile time"
    ],
    correct: 0,
    explanation: "Move semantics allow temporary objects to transfer their allocated resources directly to the destination without allocating new memory."
  },
  {
    id: 17,
    category: "JavaScript",
    question: "What is the Event Loop in JavaScript responsible for?",
    options: [
      "Monitoring the Call Stack and moving queued callback tasks from Callback/Microtask Queues into the Call Stack when it is empty",
      "Running CSS animations at 60 FPS",
      "Garbage collecting unused DOM nodes",
      "Compiling JS code to machine instructions"
    ],
    correct: 0,
    explanation: "The event loop continuously checks if the call stack is empty and dequeues microtasks and macrotasks in order."
  },
  {
    id: 18,
    category: "JavaScript",
    question: "What does the `Promise.all()` method do if one of the promises in the input array rejects?",
    options: [
      "Immediately rejects with the reason of the first promise that rejected (fail-fast behavior)",
      "Waits for all other promises to resolve and ignores the rejection",
      "Retries the rejected promise up to 3 times",
      "Returns an array containing error objects for rejected promises"
    ],
    correct: 0,
    explanation: "Promise.all rejects immediately upon the first rejected promise. Use Promise.allSettled if you want results for all promises."
  },
  {
    id: 19,
    category: "Computer Networks",
    question: "Which layer of the OSI model does the TLS/SSL protocol typically operate across?",
    options: ["Data Link Layer", "Transport / Presentation Layer", "Network Layer", "Physical Layer"],
    correct: 1,
    explanation: "TLS operates on top of the transport layer (TCP port 443) to encrypt application layer data (Presentation/Session boundary)."
  },
  {
    id: 20,
    category: "Computer Networks",
    question: "What occurs during the TCP Three-Way Handshake before data transmission begins?",
    options: [
      "Client sends SYN, Server replies with SYN-ACK, Client sends ACK",
      "Client sends GET, Server sends 200 OK, Client sends FIN",
      "Client sends PING, Server sends PONG, Client sends DATA",
      "Client sends RST, Server sends ACK, Client sends SYN"
    ],
    correct: 0,
    explanation: "The TCP handshake establishes sequence numbers and socket connection via SYN -> SYN-ACK -> ACK."
  },
  {
    id: 21,
    category: "Data Structures",
    question: "Which collision resolution technique in hash tables stores collided elements in linked lists at each bucket index?",
    options: ["Separate Chaining", "Linear Probing", "Quadratic Probing", "Double Hashing"],
    correct: 0,
    explanation: "Separate chaining handles collisions by maintaining a linked list or small tree for each hash bucket index."
  },
  {
    id: 22,
    category: "Algorithms",
    question: "What is the optimal algorithm for finding the Minimum Spanning Tree (MST) in a dense graph with E ≈ V²?",
    options: ["Prim's Algorithm with an Adjacency Matrix O(V²)", "Kruskal's Algorithm O(E log E)", "Breadth-First Search O(V+E)", "Topological Sort O(V+E)"],
    correct: 0,
    explanation: "For dense graphs where E is close to V², Prim's algorithm using an adjacency matrix runs in O(V²), which is faster than O(V² log V)."
  },
  {
    id: 23,
    category: "Operating Systems",
    question: "What is the primary difference between a process and a thread?",
    options: [
      "A process has its own isolated virtual address space, while threads of the same process share memory space and open file descriptors",
      "Processes run in user space, while threads run exclusively in kernel space",
      "Threads cannot perform I/O operations",
      "Processes are scheduled by hardware, whereas threads are scheduled by compilers"
    ],
    correct: 0,
    explanation: "Processes provide memory isolation; threads share the process's code, data, and heap segments but have private stacks."
  },
  {
    id: 24,
    category: "Database Systems",
    question: "What is the purpose of an Index in a relational database?",
    options: [
      "Accelerates query retrieval speed at the cost of additional storage and write overhead",
      "Enforces user authorization and roles",
      "Encrypts columns stored on disk",
      "Automatically partitions tables across servers"
    ],
    correct: 0,
    explanation: "B-Tree and Hash indexes provide fast logarithmic or constant lookups for filtered queries, while slightly slowing INSERT/UPDATE."
  },
  {
    id: 25,
    category: "System Design",
    question: "In distributed message brokers (like Apache Kafka), what is a partition offset?",
    options: [
      "A sequential identifier assigned to each record within a specific partition that acts as the consumer's commit position",
      "The network delay between producer and consumer",
      "The encryption salt used to hash payload data",
      "The number of replicas configured for a topic"
    ],
    correct: 0,
    explanation: "Offsets uniquely identify messages within a partition and allow consumers to track their read progress independently."
  },
  {
    id: 26,
    category: "Python",
    question: "What is the difference between a generator function and a standard function in Python?",
    options: [
      "A generator function yields values one at a time using `yield`, pausing execution and conserving memory",
      "A generator runs in a separate multiprocessing worker",
      "A generator cannot accept parameters",
      "A generator returns a static tuple instead of a list"
    ],
    correct: 0,
    explanation: "Generators produce iterators lazily, evaluating items on-demand with `yield` without holding the entire collection in RAM."
  },
  {
    id: 27,
    category: "Java",
    question: "What happens when an exception is thrown in a `try` block that has an associated `finally` block?",
    options: [
      "The `finally` block executes regardless of whether an exception was caught or unhandled",
      "The `finally` block only executes if the catch block succeeds",
      "The program terminates immediately and skips `finally`",
      "The `finally` block executes only on JVM crash"
    ],
    correct: 0,
    explanation: "The `finally` block is guaranteed to execute to ensure resources (like streams or database handles) are safely closed."
  },
  {
    id: 28,
    category: "C++",
    question: "Which container in the C++ Standard Template Library (STL) guarantees constant time O(1) random access by index?",
    options: ["std::vector", "std::list", "std::set", "std::forward_list"],
    correct: 0,
    explanation: "`std::vector` stores elements contiguously in memory, enabling direct pointer offset arithmetic for O(1) random indexing."
  },
  {
    id: 29,
    category: "JavaScript",
    question: "What is a closure in JavaScript?",
    options: [
      "A function combined with its lexical environment, allowing it to access variables from its outer scope even after that outer function has returned",
      "A syntax error caused by an unclosed curly brace",
      "A method to close an active WebSocket connection",
      "An object frozen with `Object.freeze()`"
    ],
    correct: 0,
    explanation: "Closures give functions access to their outer enclosing scope's variables across asynchronous executions and callbacks."
  },
  {
    id: 30,
    category: "Algorithms",
    question: "What is the average time complexity of QuickSelect for finding the k-th smallest element in an unordered list?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correct: 0,
    explanation: "QuickSelect partitions the array like QuickSort, but only recurses into the partition containing k, resulting in expected linear time O(n)."
  }
];

export const interviewQuestionsList = [
  {
    id: 1,
    role: "Software Engineering",
    question: "Describe a complex technical project you engineered. What was the central challenge, what technical decisions did you make, and what measurable impact did it achieve?",
    category: "Technical Architecture & Delivery"
  },
  {
    id: 2,
    role: "Software Engineering",
    question: "Tell me about a high-pressure situation where a production system or assignment failed unexpectedly. How did you diagnose the root cause and resolve it under time constraints?",
    category: "Troubleshooting & Problem Solving"
  },
  {
    id: 3,
    role: "Software Engineering",
    question: "Walk me through how you optimize database queries or backend latency when a system experiences an unexpected 10x traffic spike.",
    category: "Scalability & Performance"
  },
  {
    id: 4,
    role: "Software Engineering",
    question: "How do you handle technical disagreements with a peer or team member regarding software architecture or code review standards?",
    category: "Collaboration & STAR Communication"
  }
];
