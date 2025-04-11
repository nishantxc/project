// app/api/members/route.ts
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

  const { data: members, error } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Members fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ members });
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
    const memberData = await req.json();
    console.log("Member data received:", memberData);

    const { data: member, error } = await supabase
      .from("members")
      .insert([
        {
          ...memberData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          online: memberData.online || false,
          avatar: memberData.avatar || "",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Member creation error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ member });
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
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    // 🔐 Ensure the member belongs to the user
    const { data: existingMember, error: fetchError } = await supabase
      .from("members")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingMember) {
      console.error("Member fetch error or unauthorized access:", fetchError);
      return NextResponse.json(
        { error: "Member not found or access denied" },
        { status: 404 }
      );
    }

    const { data: updatedMember, error: updateError } = await supabase
      .from("members")
      .update(updateFields)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .maybeSingle();

    if (updateError) {
      console.error("Member update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    if (!updatedMember) {
      return NextResponse.json(
        { error: "No member updated. Member may not exist or not belong to user." },
        { status: 404 }
      );
    }

    return NextResponse.json({ member: updatedMember });
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

export async function DELETE(req: Request) {
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
    // Get the member ID from URL parameters
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    // 🔐 Ensure the member belongs to the user
    const { data: existingMember, error: fetchError } = await supabase
      .from("members")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingMember) {
      console.error("Member fetch error or unauthorized access:", fetchError);
      return NextResponse.json(
        { error: "Member not found or access denied" },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabase
      .from("members")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Member deletion error:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    console.error("Request processing error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Error processing request", details: errorMessage },
      { status: 500 }
    );
  }
}