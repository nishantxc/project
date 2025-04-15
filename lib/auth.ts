// utils/auth.ts
import { cookies } from "next/headers";

export type SupabaseTokenData = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user?: any;
};

/**
 * Extracts and decodes the Supabase access token from cookies (server-side)
 */
export function getSupabaseToken(): string | null {
  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("sb-hlincslokiqoudwrvwle-auth-token")?.value;
    
    if (!tokenCookie || !tokenCookie.startsWith("base64-")) {
      return null;
    }
    
    // Remove prefix and decode in one step
    const base64String = tokenCookie.substring(7); // Remove "base64-" prefix
    const jsonString = Buffer.from(base64String, "base64").toString("utf-8");
    const session = JSON.parse(jsonString) as SupabaseTokenData;

    console.log(session.access_token, "hii");
    
    
    return session.access_token || null;
  } catch (error) {
    console.error("Error extracting Supabase token:", error);
    return null;
  }
}

/**
 * Creates a Supabase client with the user's access token
 */
export function createAuthenticatedSupabaseClient(accessToken: string) {
  const { createClient } = require("@supabase/supabase-js");
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
}

// Client-side helper to get token from cookie
export function getClientSideToken(): string | null {
  try {
    // Only run in browser
    if (typeof window === 'undefined') return null;
    
    const tokenCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('sb-hlincslokiqoudwrvwle-auth-token='));
    
    if (!tokenCookie) return null;
    
    const cookieValue = tokenCookie.split('=')[1];
    if (!cookieValue || !cookieValue.startsWith('base64-')) return null;
    
    const base64String = cookieValue.substring(7);
    const jsonString = atob(base64String);
    const session = JSON.parse(jsonString);
    
    return session.access_token || null;
  } catch (error) {
    console.error("Error extracting client token:", error);
    return null;
  }
}