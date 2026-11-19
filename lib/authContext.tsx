'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, GrowthPoint } from './types';
import { defaultUsers } from './usersData';

interface RegisterData {
  name: string;
  username: string;
  email: string;
  password?: string;
  track: string;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  allUsers: UserAccount[];
  isLoading: boolean;
  login: (usernameOrEmail: string, password?: string) => { success: boolean; error?: string };
  register: (data: RegisterData) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userIdOrUsername: string) => void;
  updateUserScore: (type: 'mcq' | 'interview' | 'resume', score: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [allUsers, setAllUsers] = useState<UserAccount[]>(defaultUsers);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize users and current active session
  useEffect(() => {
    try {
      let users = defaultUsers;
      const storedUsers = localStorage.getItem('pn360_users');
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          users = parsed;
        }
      } else {
        localStorage.setItem('pn360_users', JSON.stringify(defaultUsers));
      }
      setAllUsers(users);

      const activeId = localStorage.getItem('pn360_active_user_id') || 'user-abhay';
      const active = users.find(u => u.id === activeId || u.username === activeId) || users[0];
      setCurrentUser(active);
    } catch (e) {
      console.warn("Auth initialization fallback:", e);
      setCurrentUser(defaultUsers[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (usernameOrEmail: string, password?: string) => {
    const clean = usernameOrEmail.trim().toLowerCase();
    const user = allUsers.find(
      u => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean
    );

    if (!user) {
      return { success: false, error: "No account found with this username or email." };
    }

    if (password && user.password && user.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    setCurrentUser(user);
    try {
      localStorage.setItem('pn360_active_user_id', user.id);
    } catch {}
    return { success: true };
  };

  const register = (data: RegisterData) => {
    const cleanUsername = data.username.trim().toLowerCase();
    const cleanEmail = data.email.trim().toLowerCase();

    if (!data.name.trim()) {
      return { success: false, error: "Please enter your full name." };
    }
    if (!cleanUsername) {
      return { success: false, error: "Please choose a username." };
    }
    if (!cleanEmail) {
      return { success: false, error: "Please enter a valid email address." };
    }

    // Check if username or email already exists
    const exists = allUsers.some(
      u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanEmail
    );
    if (exists) {
      return { success: false, error: "Username or email is already registered." };
    }

    const nextRank = allUsers.length + 1;
    const initialWeekly: GrowthPoint[] = [
      { label: "Week 1", mcq: 50, interview: 48, overall: 49, rank: nextRank + 2 },
      { label: "Week 2", mcq: 56, interview: 52, overall: 54, rank: nextRank + 1 },
      { label: "Week 3", mcq: 62, interview: 58, overall: 60, rank: nextRank },
      { label: "Week 4", mcq: 65, interview: 60, overall: 63, rank: nextRank }
    ];

    const initialMonthly: GrowthPoint[] = [
      { label: "August", mcq: 45, interview: 42, overall: 44, rank: nextRank + 4 },
      { label: "September", mcq: 52, interview: 48, overall: 50, rank: nextRank + 2 },
      { label: "October", mcq: 58, interview: 54, overall: 56, rank: nextRank + 1 },
      { label: "November", mcq: 65, interview: 60, overall: 63, rank: nextRank }
    ];

    const initialYearly: GrowthPoint[] = [
      { label: "2023", mcq: 38, interview: 35, overall: 37, rank: nextRank + 6 },
      { label: "2024", mcq: 48, interview: 44, overall: 46, rank: nextRank + 3 },
      { label: "2025", mcq: 58, interview: 52, overall: 55, rank: nextRank + 1 },
      { label: "2026", mcq: 65, interview: 60, overall: 63, rank: nextRank }
    ];

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password || "password123",
      track: data.track || "Software Engineering",
      rank: nextRank,
      previousRank: nextRank + 1, // New users start with positive movement!
      resumeScore: 70,
      mcqScore: 65,
      interviewScore: 60,
      overallScore: 63,
      status: "In Diagnostic Review",
      history: {
        weekly: initialWeekly,
        monthly: initialMonthly,
        yearly: initialYearly
      }
    };

    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    setCurrentUser(newUser);

    try {
      localStorage.setItem('pn360_users', JSON.stringify(updatedUsers));
      localStorage.setItem('pn360_active_user_id', newUser.id);
    } catch {}

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('pn360_active_user_id');
    } catch {}
  };

  const switchUser = (userIdOrUsername: string) => {
    const user = allUsers.find(u => u.id === userIdOrUsername || u.username === userIdOrUsername);
    if (user) {
      setCurrentUser(user);
      try {
        localStorage.setItem('pn360_active_user_id', user.id);
      } catch {}
    }
  };

  const updateUserScore = (type: 'mcq' | 'interview' | 'resume', score: number) => {
    if (!currentUser) return;

    const updated = { ...currentUser };
    if (type === 'mcq') updated.mcqScore = score;
    if (type === 'interview') updated.interviewScore = score;
    if (type === 'resume') updated.resumeScore = score;

    // Recalculate overall readiness: resume 25%, mcq 35%, interview 40%
    updated.overallScore = Math.round(
      updated.resumeScore * 0.25 + updated.mcqScore * 0.35 + updated.interviewScore * 0.40
    );

    // Update last weekly point
    if (updated.history.weekly.length > 0) {
      const lastW = updated.history.weekly[updated.history.weekly.length - 1];
      if (type === 'mcq') lastW.mcq = score;
      if (type === 'interview') lastW.interview = score;
      lastW.overall = updated.overallScore;
    }

    const newUsers = allUsers.map(u => u.id === updated.id ? updated : u);
    setAllUsers(newUsers);
    setCurrentUser(updated);

    try {
      localStorage.setItem('pn360_users', JSON.stringify(newUsers));
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isLoading,
        login,
        register,
        logout,
        switchUser,
        updateUserScore
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
