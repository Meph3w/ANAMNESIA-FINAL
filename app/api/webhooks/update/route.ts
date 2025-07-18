import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    // Parse incoming webhook payload
    const payload = await req.json();
    // Expect payload to include userId (auth.user’s id) and planCredits
    const { userId, planCredits } = payload;
    if (!userId || typeof planCredits !== "number") {
      return NextResponse.json(
        { error: "Missing or invalid userId or planCredits" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseClient();
    // On renewal: set new monthly_plan_credits and reset monthly_usage
    const { error } = await supabase
      .from("profiles")
      .update({
        monthly_plan_credits: planCredits,
        monthly_usage: 0,
      })
      .eq("id", userId);

    if (error) {
      console.error("[Update Webhook] Supabase update error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Update Webhook] Handler error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}