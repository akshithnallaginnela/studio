/**
 * Represents a student's academic record.
 */
export interface StudentRecord {
  /**
   * The student's results.
   */
  results: string;
  /**
   * The student's attendance record.
   */
  attendance: string;
  /**
   * The student's fee dues.
   */
  feeDues: number;
  /**
   * Student's name (optional, for display)
   */
  name?: string;
   /**
   * Student's email (for identification)
   */
  email: string;
}

/**
 * Asynchronously retrieves a student's academic record.
 * In a real application, this would involve an API call to verify credentials
 * and fetch the student data.
 *
 * @param email The student's college email address.
 * @param password The student's roll number (used as password).
 * @returns A promise that resolves to a StudentRecord object if login is successful.
 * @throws Error if login fails (invalid credentials).
 */
export async function getStudentRecord(email: string, password: string): Promise<StudentRecord> {
  // --- MOCK IMPLEMENTATION ---
  // Replace this with your actual API call and authentication logic.

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock database of students (email -> {password, data})
  const mockStudentDatabase: { [email: string]: { passwordHash: string; data: Omit<StudentRecord, 'email'> } } = {
    'student1@college.edu': {
      passwordHash: 'roll123', // In reality, store hashed passwords
      data: { results: 'A', attendance: '95%', feeDues: 0, name: 'Alice Smith' },
    },
    'student2@college.edu': {
      passwordHash: 'roll456',
      data: { results: 'B+', attendance: '88%', feeDues: 150.00, name: 'Bob Johnson' },
    },
     'test@example.com': {
      passwordHash: 'testpass',
      data: { results: 'C', attendance: '75%', feeDues: 50.00, name: 'Test User' },
    },
  };

  const studentEntry = mockStudentDatabase[email.toLowerCase()];

  // Simulate checking password (DO NOT use plain text comparison in production)
  if (studentEntry && studentEntry.passwordHash === password) {
    // Login successful, return student data including the email
    return {
      ...studentEntry.data,
      email: email.toLowerCase(), // Return the email used for login
    };
  } else {
    // Login failed
    throw new Error('Invalid email or password');
  }
  // --- END MOCK IMPLEMENTATION ---
}
