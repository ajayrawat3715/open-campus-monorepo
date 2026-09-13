import { User, Department, Course, ClassModel } from "@cms/models";

/**
 * Idempotent core seed script.
 * Populates foundational data required by all 13 teams:
 * Admin users, Teachers, Students, Departments, Courses, and Classes.
 *
 * Uses findOneAndUpdate with upsert: true or exists checks to ensure multiple executions
 * never produce duplicate records.
 */
export async function seedCore(): Promise<void> {
  console.log("  → Seeding Departments...");
  const departments = [
    {
      code: "CSE",
      name: "Computer Science & Engineering",
      description: "Department of Computing, Systems, and Software Architecture",
    },
    {
      code: "ECE",
      name: "Electronics & Communication Engineering",
      description: "Department of Digital Signal Processing, Embedded Systems & VLSI",
    },
    {
      code: "ME",
      name: "Mechanical Engineering",
      description: "Department of Mechanics, Thermodynamics, and Manufacturing",
    },
  ];

  for (const dept of departments) {
    await Department.findOneAndUpdate({ code: dept.code }, { $set: dept }, { upsert: true });
  }
  console.log("  ✓ Departments created / verified");

  console.log("  → Seeding Academic Courses...");
  const courses = [
    { code: "CS101", name: "Introduction to Computer Systems", credits: 4, departmentCode: "CSE" },
    { code: "CS201", name: "Data Structures & Algorithms", credits: 4, departmentCode: "CSE" },
    { code: "EC101", name: "Digital Logic & Circuit Theory", credits: 3, departmentCode: "ECE" },
    { code: "ME101", name: "Engineering Mechanics & Dynamics", credits: 3, departmentCode: "ME" },
  ];

  for (const course of courses) {
    await Course.findOneAndUpdate({ code: course.code }, { $set: course }, { upsert: true });
  }
  console.log("  ✓ Courses created / verified");

  console.log("  → Seeding Class Cohorts...");
  const classes = [
    {
      name: "CSE Year 1 Section A",
      departmentCode: "CSE",
      academicYear: "2026-2027",
      semester: 1,
      section: "A",
    },
    {
      name: "CSE Year 2 Section A",
      departmentCode: "CSE",
      academicYear: "2026-2027",
      semester: 3,
      section: "A",
    },
    {
      name: "ECE Year 1 Section A",
      departmentCode: "ECE",
      academicYear: "2026-2027",
      semester: 1,
      section: "A",
    },
  ];

  for (const cls of classes) {
    await ClassModel.findOneAndUpdate(
      {
        departmentCode: cls.departmentCode,
        academicYear: cls.academicYear,
        semester: cls.semester,
        section: cls.section,
      },
      { $set: cls },
      { upsert: true },
    );
  }
  console.log("  ✓ Classes created / verified");

  console.log("  → Seeding Admin Users...");
  const adminUsers = [
    {
      name: "System Administrator",
      email: "admin@college.edu",
      role: "admin",
      // Precomputed bcrypt hash for "AdminSecurePassword123!"
      passwordHash: "$2a$12$e8xH.071c0sXm9f8z8y0j.0hG8vK39G3sKzZ13.x79fJ7B0M6X3O6",
      isActive: true,
    },
  ];

  for (const admin of adminUsers) {
    await User.findOneAndUpdate({ email: admin.email }, { $set: admin }, { upsert: true });
  }
  console.log("  ✓ Admin created");

  console.log("  → Seeding Faculty Members (Teachers)...");
  const teachers = [
    {
      name: "Dr. Alan Turing",
      email: "alan.turing@college.edu",
      role: "teacher",
      department: "CSE",
      passwordHash: "$2a$12$e8xH.071c0sXm9f8z8y0j.0hG8vK39G3sKzZ13.x79fJ7B0M6X3O6",
      isActive: true,
    },
    {
      name: "Prof. Claude Shannon",
      email: "claude.shannon@college.edu",
      role: "teacher",
      department: "ECE",
      passwordHash: "$2a$12$e8xH.071c0sXm9f8z8y0j.0hG8vK39G3sKzZ13.x79fJ7B0M6X3O6",
      isActive: true,
    },
  ];

  for (const teacher of teachers) {
    await User.findOneAndUpdate({ email: teacher.email }, { $set: teacher }, { upsert: true });
  }
  console.log("  ✓ Teachers created");

  console.log("  → Seeding Students...");
  const students = [
    {
      name: "Ada Lovelace",
      email: "ada.lovelace@college.edu",
      role: "student",
      department: "CSE",
      rollNumber: "CSE-2026-001",
      passwordHash: "$2a$12$e8xH.071c0sXm9f8z8y0j.0hG8vK39G3sKzZ13.x79fJ7B0M6X3O6",
      isActive: true,
    },
    {
      name: "Grace Hopper",
      email: "grace.hopper@college.edu",
      role: "student",
      department: "CSE",
      rollNumber: "CSE-2026-002",
      passwordHash: "$2a$12$e8xH.071c0sXm9f8z8y0j.0hG8vK39G3sKzZ13.x79fJ7B0M6X3O6",
      isActive: true,
    },
    {
      name: "Nikola Tesla",
      email: "nikola.tesla@college.edu",
      role: "student",
      department: "ECE",
      rollNumber: "ECE-2026-001",
      passwordHash: "$2a$12$e8xH.071c0sXm9f8z8y0j.0hG8vK39G3sKzZ13.x79fJ7B0M6X3O6",
      isActive: true,
    },
  ];

  for (const student of students) {
    await User.findOneAndUpdate({ email: student.email }, { $set: student }, { upsert: true });
  }
  console.log("  ✓ Students created");
}
