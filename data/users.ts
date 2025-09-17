export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  assignedCompanyIds: string[]
}

export const currentUser: User = {
  id: "user-1",
  name: "管理者",
  email: "admin@example.com",
  role: "admin",
  assignedCompanyIds: ["vwx-cooking", "stu-engineering", "pqr-international", "mno-research", "jkl-culture", "ghi-research", "def-optical"],
}

