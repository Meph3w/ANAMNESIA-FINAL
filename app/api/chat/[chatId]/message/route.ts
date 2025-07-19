import { NextRequest } from "next/server";
import { createSupabaseClient } from "@/utils/supabase/server";

/**
 * POST /api/chat/[chatId]/message
 * Inserts a new message into the specified chat.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const chatId = params.chatId;
  if (!chatId) {
    return new Response(JSON.stringify({ error: "Invalid chatId" }), { status: 400 });
  }

  const supabase = await createSupabaseClient();

  // Authenticate user
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // Parse and validate request body
  const body = await req.json();
  const { sender, content } = body;
  if (!sender || !content) {
    return new Response(JSON.stringify({ error: "Missing sender or content" }), { status: 400 });
  }

  // Insert message into database
  const { error: insertErr } = await supabase
    .from("messages")
    .insert([{ chat_id: chatId, sender, content }]);
  if (insertErr) {
    console.error("Error saving message:", insertErr);
    return new Response(JSON.stringify({ error: "Error saving message" }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}