// src/api/index.ts

import {
  Member,
  MemberResponse,
  MembersResponse,
  TasksResponse,
  Task,
  TaskResponse,
} from "@/types/apiTypes";
import { apiMethods } from "./api-methods";
import { createSupabaseClient } from "@/lib/supabase";

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Get authentication token from storage
 */
const getAuthToken = async () => {
  if (typeof window !== "undefined") {
    try {
      const client = createSupabaseClient();
      const { data: userSession } = await client.auth.getSession();
      if (!userSession) return null;
      console.log(userSession.session?.access_token, "===user==");
      return userSession?.session?.access_token || null;

      // const tokenCookie = document.cookie
      //   .split("; ")
      //   .find((row) => row.startsWith("sb-hlincslokiqoudwrvwle-auth-token="));

      // if (!tokenCookie) return null;

      // const cookieValue = tokenCookie.split("=")[1];
      // if (!cookieValue || !cookieValue.startsWith("base64-")) return null;

      // const base64String = cookieValue.substring(7);
      // const jsonString = atob(base64String);
      // const session = JSON.parse(jsonString);

      // // Add debug logging
      // console.log("Session token:", session.access_token);

      // return session.access_token || null;
    } catch (e) {
      console.error("Error retrieving auth token:", e);
      return null;
    }
  }
  return null;
};

/**
 * API Collection - Centralized place for all API endpoints
 */
export const api = {
  /**
   * Task-related API endpoints
   */
  tasks: {
    /**
     * Get all tasks for the authenticated user
     */
    getAll: async (): Promise<TasksResponse> => {
      const token = getAuthToken();
      console.log(token, "===token==");

      if (!token) throw new Error("Authentication required");

      return apiMethods.get<TasksResponse>(`${API_BASE_URL}/api/tasks`, token);
    },

    /**
     * Create a new task
     */
    create: async (taskData: Omit<Task, "id">): Promise<TaskResponse> => {
      const token = getAuthToken();
      console.log(token, "===token==");

      if (!token) throw new Error("Authentication required");

      return apiMethods.post<TaskResponse>("/api/tasks", taskData, token);
    },

    /**
     * Update an existing task
     */
    update: async (
      taskId: string,
      updateData: Partial<Omit<Task, "id" | "user_id" | "created_at">>
    ): Promise<TaskResponse> => {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      return apiMethods.put<TaskResponse>(
        `${API_BASE_URL}/tasks`,
        { id: taskId, ...updateData },
        token
      );
    },

    /**
     * Delete a task
     */
    delete: async (taskId: string): Promise<{ success: boolean }> => {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      return apiMethods.delete<{ success: boolean }>(
        `${API_BASE_URL}/tasks?id=${taskId}`,
        token
      );
    },
  },

  /**
   * Member-related API endpoints
   */
  members: {
    /**
     * Get all team members
     */
    getAll: async (): Promise<MembersResponse> => {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      return apiMethods.get<MembersResponse>(`${API_BASE_URL}/members`, token);
    },

    /**
     * Create a new member
     */
    create: async (memberData: Omit<Member, "id">): Promise<MemberResponse> => {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      return apiMethods.post<MemberResponse>(
        `${API_BASE_URL}/members`,
        memberData,
        token
      );
    },

    /**
     * Delete a member
     */
    delete: async (
      memberId: string
    ): Promise<{ success: boolean; message: string }> => {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication required");

      return apiMethods.delete<{ success: boolean; message: string }>(
        `${API_BASE_URL}/members?id=${memberId}`,
        token
      );
    },
  },
};
