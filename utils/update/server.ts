import { createClient } from "@updatedev/js";
import { createSupabaseClient } from "../supabase/server";

export async function createUpdateClient() {
  return createClient(process.env.NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY!, {
    getSessionToken: async () => {
      const supabase = await createSupabaseClient();
      const { data } = await supabase.auth.getSession();
      if (data.session == null) return;
      return data.session.access_token;
    },
    environment: process.env.NODE_ENV === "production" ? "live" : "test",
  });
}
// Handle Update.dev webhook for plan renewal
export async function handleUpdateWebhook(payload: { userId: string; planCredits: number; }) {
  const { userId, planCredits } = payload;
  if (!userId || typeof planCredits !== "number") {
    throw new Error("Invalid payload for Update webhook");
  }
  const supabase = await createSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({ monthly_plan_credits: planCredits, monthly_usage: 0 })
    .eq("id", userId);
  if (error) {
    console.error("[UpdateWebhook] Supabase update error", error);
    throw error;
  }
}
