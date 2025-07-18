# Manual Migration Instructions

1. Open your Supabase project dashboard at https://app.supabase.com.
2. Select your project `cdbvabpotcujozpandpw`.
3. In the left sidebar, click **SQL Editor** → **New query**.
4. Open the file `supabase/migrations/0001_create_chats_messages_tables.sql` in your code editor.
5. Copy all SQL statements from that file.
6. Paste the SQL into the Supabase SQL Editor textbox.
7. Click **Run** (▶️) to execute the migration.
8. Verify tables:
   - Click **Table Editor** → **public** → **chats** and **messages**.
   - Ensure columns and RLS policies are present.
9. Test chat creation:
   - Submit a new chat from the UI.
   - Confirm no 500 errors and a new record appears in **public.chats**.

Once complete, return here with confirmation.