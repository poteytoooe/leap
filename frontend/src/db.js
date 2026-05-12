// ============================================================
// MOCK DATABASE — mirrors MySQL schema exactly
// ============================================================
export const DB = {
  users: [
    { user_id: 1, email: "admin@ncf.edu.ph",              is_active: 1, is_staff: 1, is_superuser: 1, date_joined: "2024-08-01", last_login: null, avatar_url: null },
    { user_id: 2, email: "prof.santos@ncf.edu.ph",        is_active: 1, is_staff: 1, is_superuser: 0, date_joined: "2024-08-10", last_login: null, avatar_url: null },
    { user_id: 3, email: "juan.delacruz@gbox.ncf.edu.ph", is_active: 1, is_staff: 0, is_superuser: 0, date_joined: "2024-09-01", last_login: null, avatar_url: null },
    { user_id: 4, email: "ana.santos@gbox.ncf.edu.ph",    is_active: 1, is_staff: 0, is_superuser: 0, date_joined: "2024-09-02", last_login: null, avatar_url: null },
    { user_id: 5, email: "maria.reyes@gbox.ncf.edu.ph",   is_active: 1, is_staff: 0, is_superuser: 0, date_joined: "2024-09-03", last_login: null, avatar_url: null },
    { user_id: 6, email: "kevin.lim@gbox.ncf.edu.ph",     is_active: 1, is_staff: 0, is_superuser: 0, date_joined: "2024-09-04", last_login: null, avatar_url: null },
  ],
  admins: [
    { admin_id: 1, user_id: 1, role: "System Administrator", status: "active" },
  ],
  instructors: [
    { instructor_id: 1, user_id: 2, first_name: "Maria", middle_name: "L.", last_name: "Santos", age: 38, birth_date: "1986-03-15", gender: "Female", address: "NCF Campus", contact_no: "09171234567", specialization: "Chinese Language Arts", hire_date: "2020-06-01", status: "active" },
  ],
  students: [
    { student_id: 1, user_id: 3, first_name: "Juan",  middle_name: "P.", last_name: "dela Cruz", gender: "Male",   address: "Antipolo",   year_level: 2, dept_id: 1 },
    { student_id: 2, user_id: 4, first_name: "Ana",   middle_name: "C.", last_name: "Santos",    gender: "Female", address: "Caloocan",   year_level: 3, dept_id: 1 },
    { student_id: 3, user_id: 5, first_name: "Maria", middle_name: "T.", last_name: "Reyes",     gender: "Female", address: "Novaliches", year_level: 2, dept_id: 1 },
    { student_id: 4, user_id: 6, first_name: "Kevin", middle_name: "R.", last_name: "Lim",       gender: "Male",   address: "Fairview",   year_level: 1, dept_id: 1 },
  ],
  courses: [
    { course_id: 1, course_name: "CTA Basics A1",       course_code: "CTA-101", description: "Beginner Chinese for Tourism & Hospitality", is_published: 1, created_at: "2024-08-15", updated_at: "2024-10-01", status: "active" },
    { course_id: 2, course_name: "CTA Intermediate A2", course_code: "CTA-201", description: "Intermediate Chinese conversations",          is_published: 1, created_at: "2024-08-15", updated_at: "2024-10-01", status: "active" },
  ],
  enrollments: [
    { enrollment_id: 1, student_id: 1, course_id: 1, early_enrolled: 0 },
    { enrollment_id: 2, student_id: 2, course_id: 1, early_enrolled: 1 },
    { enrollment_id: 3, student_id: 3, course_id: 1, early_enrolled: 0 },
    { enrollment_id: 4, student_id: 4, course_id: 1, early_enrolled: 0 },
  ],
  lessons: [
    { lesson_id: 1, course_id: 1, title: "Basic Greetings",        description: "Ni hao, xie xie, and core phrases", attachment: null, lesson_order: 1, section_order: 1 },
    { lesson_id: 2, course_id: 1, title: "Introducing Yourself",   description: "Wǒ jiào... self-introduction",       attachment: null, lesson_order: 2, section_order: 1 },
    { lesson_id: 3, course_id: 1, title: "Ordering Food",          description: "Restaurant and food vocabulary",     attachment: null, lesson_order: 3, section_order: 2 },
    { lesson_id: 4, course_id: 1, title: "Numbers & Counting",     description: "1-100 and prices",                  attachment: null, lesson_order: 4, section_order: 2 },
    { lesson_id: 5, course_id: 1, title: "Directions & Transport", description: "Getting around the city",           attachment: null, lesson_order: 5, section_order: 3 },
  ],
  requirements: [
    { requirement_id: 1, lesson_id: 1, title: "Vocabulary Quiz",       type: "quiz",        due_date: "2024-10-10", total_points: 10, max_attempts: 3 },
    { requirement_id: 2, lesson_id: 2, title: "Pronunciation Practice", type: "oral",        due_date: "2024-10-12", total_points: 20, max_attempts: 2 },
    { requirement_id: 3, lesson_id: 3, title: "Ordering Food Roleplay", type: "ai_roleplay", due_date: "2024-10-14", total_points: 30, max_attempts: 1 },
  ],
  submissions: [
    { submission_id: 1, requirement_id: 1, attempt_number: 1, date_submitted: "2024-10-10", true_or_false: 1, status: "graded", feedback: "Great work!" },
    { submission_id: 2, requirement_id: 2, attempt_number: 1, date_submitted: "2024-10-12", true_or_false: 1, status: "graded", feedback: "Good pronunciation" },
    { submission_id: 3, requirement_id: 3, attempt_number: 1, date_submitted: "2024-10-14", true_or_false: 0, status: "graded", feedback: "Below 70% on-topic threshold" },
  ],
  grades: [
    { grade_id: 1, student_id: 1, course_id: 1, grade_value: 78.5, date_awarded: "2024-10-15" },
    { grade_id: 2, student_id: 2, course_id: 1, grade_value: 96.0, date_awarded: "2024-10-15" },
    { grade_id: 3, student_id: 3, course_id: 1, grade_value: 81.0, date_awarded: "2024-10-15" },
    { grade_id: 4, student_id: 4, course_id: 1, grade_value: 85.0, date_awarded: "2024-10-15" },
  ],
  badges: [
    { badge_id: 1, badge_name: "First Steps",   description: "Complete your first lesson", created_at: "2024-08-15" },
    { badge_id: 2, badge_name: "Quiz Master",    description: "Score 100% on any quiz",     created_at: "2024-08-15" },
    { badge_id: 3, badge_name: "Streak Starter", description: "Log in 7 days in a row",     created_at: "2024-08-15" },
  ],
  badgeConditions: [
    { badge_id: 1, condition_type: "lessons_completed", required_score: 1,   created_at: "2024-08-15" },
    { badge_id: 2, condition_type: "quiz_score",         required_score: 100, created_at: "2024-08-15" },
    { badge_id: 3, condition_type: "streak_days",        required_score: 7,   created_at: "2024-08-15" },
  ],
  studentBadges: [
    { student_badge_id: 1, student_id: 2, badge_id: 1, date_earned: "2024-10-10" },
    { student_badge_id: 2, student_id: 2, badge_id: 2, date_earned: "2024-10-10" },
    { student_badge_id: 3, student_id: 1, badge_id: 1, date_earned: "2024-10-11" },
  ],
  subscriptions: [
    { sub_id: 1, student_id: 1, status: "pending",  paid_date: "2024-10-14", exp_date: null,         tokens_used: 10200 },
    { sub_id: 2, student_id: 2, status: "active",   paid_date: "2024-09-01", exp_date: "2026-06-30", tokens_used: 30120 },
    { sub_id: 3, student_id: 3, status: "expired",  paid_date: "2024-08-01", exp_date: "2024-10-01", tokens_used: 22340 },
    { sub_id: 4, student_id: 4, status: "active",   paid_date: "2024-09-15", exp_date: "2026-06-30", tokens_used: 18500 },
  ],
};

// ============================================================
// API SERVICE — simulates backend queries against DB
// ============================================================
export const api = {
  async delay(ms = 300) {
    return new Promise(r => setTimeout(r, ms));
  },

  async login(email, password) {
    await this.delay(600);
    const user = DB.users.find(u => u.email === email);
    if (!user) throw new Error("No account found with that email.");
    if (password.length < 6) throw new Error("Invalid credentials.");
    const admin = DB.admins.find(a => a.user_id === user.user_id);
    if (admin) return { token: "tok_" + user.user_id, user: { ...user, role: "admin", name: "Administrator" } };
    const instructor = DB.instructors.find(i => i.user_id === user.user_id);
    if (instructor) return { token: "tok_" + user.user_id, user: { ...user, role: "instructor", name: instructor.first_name + " " + instructor.last_name, instructor } };
    const student = DB.students.find(s => s.user_id === user.user_id);
    if (student) return { token: "tok_" + user.user_id, user: { ...user, role: "student", name: student.first_name + " " + student.last_name, student } };
    throw new Error("Account type not found.");
  },

  async register(form) {
    await this.delay(800);
    if (DB.users.find(u => u.email === form.email)) throw new Error("Email already registered.");
    const newUserId = Math.max(...DB.users.map(u => u.user_id)) + 1;
    const newUser = {
      user_id: newUserId, email: form.email, is_active: 1, is_staff: 0,
      is_superuser: 0, date_joined: new Date().toISOString().slice(0, 10),
      last_login: null, avatar_url: null,
    };
    DB.users.push(newUser);
    if (form.role === "student") {
      const sid = Math.max(...DB.students.map(s => s.student_id)) + 1;
      DB.students.push({ student_id: sid, user_id: newUserId, first_name: form.first_name, middle_name: form.middle_name, last_name: form.last_name, gender: form.gender, address: "", year_level: parseInt(form.year_level) || 1, dept_id: parseInt(form.dept_id) || 1 });
    } else {
      const iid = Math.max(...DB.instructors.map(i => i.instructor_id)) + 1;
      DB.instructors.push({ instructor_id: iid, user_id: newUserId, first_name: form.first_name, middle_name: form.middle_name, last_name: form.last_name, age: null, birth_date: null, gender: form.gender, address: "", contact_no: form.contact_no, specialization: form.specialization, hire_date: new Date().toISOString().slice(0, 10), status: "active" });
    }
    return { success: true };
  },

  async getStudentDashboard(userId) {
    await this.delay(200);
    const student = DB.students.find(s => s.user_id === userId);
    if (!student) throw new Error("Student record not found.");
    const enrollments = DB.enrollments.filter(e => e.student_id === student.student_id);
    const grades = DB.grades.filter(g => g.student_id === student.student_id);
    const badges = DB.studentBadges
      .filter(b => b.student_id === student.student_id)
      .map(sb => ({ ...sb, badge: DB.badges.find(b => b.badge_id === sb.badge_id) }));
    const avgGrade = grades.length ? grades.reduce((a, g) => a + g.grade_value, 0) / grades.length : 0;
    const xp = Math.round(avgGrade * 1.2);
    const lessons = DB.lessons.filter(l => enrollments.some(e => e.course_id === l.course_id));
    const recentActivity = DB.submissions.slice(0, 3).map(sub => {
      const req = DB.requirements.find(r => r.requirement_id === sub.requirement_id);
      const lesson = req ? DB.lessons.find(l => l.lesson_id === req.lesson_id) : null;
      return { submission: sub, requirement: req, lesson };
    });
    return { student, enrollments, grades, badges, avgGrade, xp, lessons, recentActivity };
  },

  async getInstructorDashboard(userId) {
    await this.delay(200);
    const instructor = DB.instructors.find(i => i.user_id === userId);
    if (!instructor) throw new Error("Instructor record not found.");
    const courses = DB.courses.filter(c => c.is_published);
    const enrollments = DB.enrollments;
    const allStudents = DB.students;
    const grades = DB.grades;
    const transcripts = DB.submissions.map(sub => {
      const req = DB.requirements.find(r => r.requirement_id === sub.requirement_id);
      const lesson = req ? DB.lessons.find(l => l.lesson_id === req.lesson_id) : null;
      const student = allStudents[sub.submission_id - 1] || allStudents[0];
      return { submission: sub, requirement: req, lesson, student };
    });
    const pendingReviews = DB.submissions.filter(s => s.status === "graded").length;
    return { instructor, courses, enrollments, allStudents, grades, transcripts, pendingReviews };
  },

  async getAdminDashboard() {
    await this.delay(200);
    const subs = DB.subscriptions.map(s => {
      const student = DB.students.find(st => st.student_id === s.student_id);
      const user = student ? DB.users.find(u => u.user_id === student.user_id) : null;
      return { ...s, student, user };
    });
    const totalTokens = DB.subscriptions.reduce((a, s) => a + s.tokens_used, 0);
    const active  = subs.filter(s => s.status === "active").length;
    const pending = subs.filter(s => s.status === "pending").length;
    const expired = subs.filter(s => s.status === "expired").length;
    const apiUsage = DB.subscriptions.map(s => {
      const student = DB.students.find(st => st.student_id === s.student_id);
      const user = student ? DB.users.find(u => u.user_id === student.user_id) : null;
      return { ...s, student, user, pct: Math.round((s.tokens_used / totalTokens) * 100) };
    }).sort((a, b) => b.tokens_used - a.tokens_used);
    return { subs, totalTokens, active, pending, expired, apiUsage, userCount: DB.users.length };
  },

  async activateSubscription(subId) {
    await this.delay(300);
    const sub = DB.subscriptions.find(s => s.sub_id === subId);
    if (sub) { sub.status = "active"; sub.exp_date = "2026-06-30"; }
    return { success: true };
  },

  async getAllStudents() {
    await this.delay(150);
    return DB.students.map(s => {
      const user       = DB.users.find(u => u.user_id === s.user_id);
      const grade      = DB.grades.find(g => g.student_id === s.student_id);
      const enrollment = DB.enrollments.find(e => e.student_id === s.student_id);
      const course     = enrollment ? DB.courses.find(c => c.course_id === enrollment.course_id) : null;
      return { ...s, user, grade, course };
    });
  },

  async getAllCourses() {
    await this.delay(150);
    return DB.courses.map(c => {
      const enrolled = DB.enrollments.filter(e => e.course_id === c.course_id).length;
      const lessons  = DB.lessons.filter(l => l.course_id === c.course_id).length;
      return { ...c, enrolled, lessons };
    });
  },
};
