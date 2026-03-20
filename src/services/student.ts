/**
 * Represents a question in an exam.
 */
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

/**
 * Represents an exam paper.
 */
export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  status: 'published' | 'draft';
  createdAt: string;
}

/**
 * Represents a student's academic record.
 */
export interface StudentRecord {
  results: string;
  attendance: string;
  feeDues: number;
  name?: string;
  email: string;
  role: 'student' | 'admin';
}

/**
 * Mock storage for the demo.
 */
const getStorageKey = (key: string) => `campus_connect_${key}`;

export async function getStudentRecord(email: string, password: string): Promise<StudentRecord> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const mockStudentDatabase: { [email: string]: { passwordHash: string; data: Omit<StudentRecord, 'email'> } } = {
    'student1@college.edu': {
      passwordHash: 'roll123',
      data: { results: 'A', attendance: '95%', feeDues: 0, name: 'Alice Smith', role: 'student' },
    },
    'admin@college.edu': {
      passwordHash: 'admin123',
      data: { results: 'N/A', attendance: 'N/A', feeDues: 0, name: 'Admin User', role: 'admin' },
    },
     'test@example.com': {
      passwordHash: 'testpass',
      data: { results: 'C', attendance: '75%', feeDues: 50.00, name: 'Test User', role: 'student' },
    },
  };

  const studentEntry = mockStudentDatabase[email.toLowerCase()];

  if (studentEntry && studentEntry.passwordHash === password) {
    return {
      ...studentEntry.data,
      email: email.toLowerCase(),
    };
  } else {
    throw new Error('Invalid email or password');
  }
}

/**
 * Retrieve all exams from mock storage.
 */
export async function getExams(): Promise<Exam[]> {
  const stored = sessionStorage.getItem(getStorageKey('exams'));
  if (!stored) {
    const initialExams: Exam[] = [
      {
        id: '1',
        title: 'Mid-term Mathematics',
        description: 'Covers Algebra and Calculus basics.',
        status: 'published',
        createdAt: new Date().toISOString(),
        questions: [
          { id: 'q1', text: 'What is 2+2?', options: ['3', '4', '5', '6'], correctAnswer: 1 },
          { id: 'q2', text: 'Solve for x: 2x = 10', options: ['2', '5', '10', '20'], correctAnswer: 1 }
        ]
      }
    ];
    sessionStorage.setItem(getStorageKey('exams'), JSON.stringify(initialExams));
    return initialExams;
  }
  return JSON.parse(stored);
}

/**
 * Save a new exam.
 */
export async function saveExam(exam: Exam): Promise<void> {
  const exams = await getExams();
  const existingIndex = exams.findIndex(e => e.id === exam.id);
  if (existingIndex >= 0) {
    exams[existingIndex] = exam;
  } else {
    exams.push(exam);
  }
  sessionStorage.setItem(getStorageKey('exams'), JSON.stringify(exams));
}
