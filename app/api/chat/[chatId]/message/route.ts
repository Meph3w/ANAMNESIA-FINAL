import { createSupabaseClient } from "@/utils/supabase/server";

export async function POST(req: Request, context: any) {
console.log("POST handler context:", context);
  console.log("POST handler request URL:", req.url);
  const { chatId } = context.params;
  const supabase = await createSupabaseClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();
  const { sender, content } = body;
  if (!sender || !content) {
    return new Response(JSON.stringify({ error: "Missing sender or content" }), { status: 400 });
  }

  const { error: insertErr } = await supabase
    .from("messages")
    .insert([
      {
        chat_id: chatId,
        sender,
        content,
      },
    ]);

  if (insertErr) {
    console.error("Error saving message:", insertErr);
    return new Response(JSON.stringify({ error: "Error saving message" }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}