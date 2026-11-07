export type UserRole = "admin" | "user";

export interface SystemUserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthenticatedSession {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  loggedInAt: string;
}
