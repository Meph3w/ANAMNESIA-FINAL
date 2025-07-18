import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseClient } from "@/utils/supabase/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: Request) {
  const buf = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed.", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle subscription events
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const creditsMeta = subscription.metadata["creditos_mensais"];
    const credits = creditsMeta ? parseInt(creditsMeta, 10) : 0;

    try {
      const supabase = await createSupabaseClient();
      const { error } = await supabase
        .from("profiles")
        .update({ monthly_plan_credits: credits, monthly_usage: 0 })
        .eq("stripe_customer_id", customerId);
      if (error) {
        console.error("[Stripe Webhook] Supabase update error", error);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
    } catch (err) {
      console.error("[Stripe Webhook] Unexpected error", err);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}