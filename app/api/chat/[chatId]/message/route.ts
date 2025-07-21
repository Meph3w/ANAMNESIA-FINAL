import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/utils/supabase/server";


/**
 * POST /api/chat/[chatId]/message
 * Inserts a new message into the specified chat.
 */
export async function POST(request: NextRequest, context: { params: { chatId: string } }): Promise<NextResponse> {
  // Extract chatId from dynamic route parameters
  const chatId = context.params.chatId;
  if (!chatId) {
    return NextResponse.json({ error: "Invalid chatId" }, { status: 400 });
  }

  const supabase = await createSupabaseClient();

  // Authenticate user
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse and validate request body
  const body = await request.json();
  const { sender, content } = body;
  if (!sender || !content) {
    return NextResponse.json({ error: "Missing sender or content" }, { status: 400 });
  }

  // Insert message into database
  const { error: insertErr } = await supabase
    .from("messages")
    .insert([{ chat_id: chatId, sender, content }]);
  if (insertErr) {
    console.error("Error saving message:", insertErr);
    return NextResponse.json({ error: "Error saving message" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
