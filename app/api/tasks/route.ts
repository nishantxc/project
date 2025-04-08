// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  getSupabaseToken,
  createAuthenticatedSupabaseClient,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const accessToken = getSupabaseToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAuthenticatedSupabaseClient(accessToken);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth error:", userError);
    return NextResponse.json(
      { error: "Unauthorized", details: userError?.message },
      { status: 401 }
    );
  }

  // Check for middleware processing
  const middlewareProcessed = headers().get("x-middleware-processed");
  console.log(
    `Request processed by middleware: ${middlewareProcessed === "true"}`
  );

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Task fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const accessToken = getSupabaseToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAuthenticatedSupabaseClient(accessToken);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth error:", userError);
    return NextResponse.json(
      { error: "Unauthorized", details: userError?.message },
      { status: 401 }
    );
  }

  try {
    const taskData = await req.json();
    console.log("Task data received:", taskData);

    const { data: task, error } = await supabase
      .from("tasks")
      .insert([
        {
          ...taskData,
          user_id: user.id,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Task creation error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Request parsing error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Invalid request body", details: errorMessage },
      { status: 400 }
    );
  }
}

export async function PUT(req: Request) {
  const accessToken = getSupabaseToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAuthenticatedSupabaseClient(accessToken);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth error:", userError);
    return NextResponse.json(
      { error: "Unauthorized", details: userError?.message },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // 🔐 Ensure the task belongs to the user
    const { data: existingTask, error: fetchError } = await supabase
      .from("tasks")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingTask) {
      console.error("Task fetch error or unauthorized access:", fetchError);
      return NextResponse.json(
        { error: "Task not found or access denied" },
        { status: 404 }
      );
    }

    const { data: updatedTask, error: updateError } = await supabase
      .from("tasks")
      .update(updateFields)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .maybeSingle();

    if (updateError) {
      console.error("Task update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    if (!updatedTask) {
      return NextResponse.json(
        { error: "No task updated. Task may not exist or not belong to user." },
        { status: 404 }
      );
    }

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error("Request parsing error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Invalid request body", details: errorMessage },
      { status: 400 }
    );
  }
}
