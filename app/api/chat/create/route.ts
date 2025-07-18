import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/utils/supabase/server";
import { startNewChat } from "@/app/actions";

/**
 * API route to create a new chat record and return its ID.
 */
export async function POST(request: NextRequest) {
    console.log("POST /api/chat/create called");
  try {
    const { prompt, model, contextId } = await request.json();
    console.log("API /api/chat/create payload:", { prompt, model, contextId });
    console.log("API /api/chat/create payload:", { prompt, model, contextId });
    const chatId = crypto.randomUUID();
    const result = await startNewChat(chatId, prompt, model, contextId);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    // Deduct one credit for user message send
    const supabaseClient = await createSupabaseClient();
    const {
      data: { user },
      error: authErr,
    } = await supabaseClient.auth.getUser();
    if (authErr || !user) {
      console.error("User not authenticated for credit deduction:", authErr);
      return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }
    const { data: profile, error: profileErr } = await supabaseClient
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();
    if (profileErr || (profile?.credits ?? 0) < 1) {
      console.error("Insufficient credits for user", user.id);
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }
    const remainingCredits = (profile.credits ?? 0) - 1;
    await supabaseClient
      .from("profiles")
      .update({ credits: remainingCredits })
      .eq("id", user.id);
    // Log credit usage (non-blocking)
    supabaseClient
      .from("credit_usage")
      .insert([{ user_id: user.id, credits_spent: 1 }])
      .then(({ error }) => {
        if (error) console.error("Error logging credit usage:", error);
      });
    return NextResponse.json({ chatId });
  } catch (err) {
    console.error("Error in /api/chat/create:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected error.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}