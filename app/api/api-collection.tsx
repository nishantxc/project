// src/api/index.ts

import {
  Member,
  MemberResponse,
  MembersResponse,
  TasksResponse,
  Task,
  TaskResponse,
  Company,
  CompanyResponse,
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
      if (!userSession?.session) return null;

      // Return the user's access token
      return userSession.session.access_token || null;
    } catch (e) {
      console.error("Error retrieving auth token:", e);
      return null;
    }
  }
  return null;
};

export const api = {
  tasks: {
    /**
     * Get all tasks for the authenticated user
     */
    getAll: async (): Promise<TasksResponse> => {
      const token = await getAuthToken(); // Make sure to await the token
      console.log(token, "===token==");

      if (!token) throw new Error("Authentication required");

      return apiMethods.get<TasksResponse>(`${API_BASE_URL}/api/tasks`, token);
    },

    // Fix the other methods similarly by adding await
    create: async (taskData: Omit<Task, "id">): Promise<TaskResponse> => {
      const token = await getAuthToken();
      if (!token) throw new Error("Authentication required");

      return apiMethods.post<TaskResponse>(
        `${API_BASE_URL}/api/tasks`,
        taskData,
        token
      );
    },
    /**
     * Update an existing task
     */
    update: async (
      taskId: string,
      updateData: Partial<Omit<Task, "id">>
    ): Promise<TaskResponse> => {
      const token = await getAuthToken();
      if (!token) throw new Error("Authentication required");

      return apiMethods.put<TaskResponse>(
        `${API_BASE_URL}/api/tasks`,
        { id: taskId, ...updateData },
        token
      );
    },

    /**
     * Delete a task
     */
    delete: async (taskId: string): Promise<{ success: boolean }> => {
      const token = await getAuthToken();
      if (!token) throw new Error("Authentication required");

      return apiMethods.delete<{ success: boolean }>(
        `${API_BASE_URL}/tasks?id=${taskId}`,
        token
      );
    },
  },
  members: {
    getAll: async (): Promise<MembersResponse> => {
      const token = await getAuthToken();
      if (!token) throw new Error("Authentication required");

      return apiMethods.get<MembersResponse>(`${API_BASE_URL}/api/members`, token);
    },
    create: async (memberData: Omit<Member, "id">): Promise<MemberResponse> => {
      const token = await getAuthToken();
      if (!token) throw new Error("Authentication required");

      return apiMethods.post<MemberResponse>(
        `${API_BASE_URL}/api/members`,
        memberData,
        token
      );
    },
    delete: async (
      memberId: string
    ): Promise<{ success: boolean; message: string }> => {
      const token = await getAuthToken();
      if (!token) throw new Error("Authentication required");

      return apiMethods.delete<{ success: boolean; message: string }>(
        `${API_BASE_URL}/members?id=${memberId}`,
        token
      );
    },
  },
  company: {
    getAll: async (): Promise<CompanyResponse> => {
      const token = await getAuthToken();
      if (!token) throw new Error("Authentication required");

      return apiMethods.get<CompanyResponse>(`${API_BASE_URL}/api/company`, token);
    },
  },
    create: async (companyData: Omit<Company, "id">): Promise<CompanyResponse> => {
      const token = await getAuthToken();
      if (!token) throw new Error("Authentication required");

      return apiMethods.post<CompanyResponse>(
        `${API_BASE_URL}/api/company`,
        companyData,
        token
      );
    },
};
