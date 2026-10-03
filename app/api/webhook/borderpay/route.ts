import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("BorderPay Webhook Received:", JSON.stringify(payload));

    const event = payload.event;
    const data = payload.data || payload;
    const refId = data.reference_id;

    if (!refId) {
      return NextResponse.json(
        { ok: false, message: "Missing reference_id in webhook payload" },
        { status: 400 }
      );
    }

    if (event === "payment.paid" || data.status === "paid") {
      try {
        if (supabase) {
          const { error } = await supabase
            .from("orders")
            .update({
              payment_status: "lunas",
              order_status: "diproses",
              paid_at: data.paid_at || new Date().toISOString(),
            })
            .eq("id", refId);

          if (error) {
            console.error("Supabase webhook update error:", error);
          }
        }
      } catch (err) {
        console.error("Supabase webhook processing failed:", err);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Webhook processed successfully",
      reference_id: refId,
      event: event,
    });
  } catch (error: any) {
    console.error("BorderPay Webhook Handler Error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Webhook handling error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "BorderPay Webhook Endpoint",
    status: "active",
    time: new Date().toISOString(),
  });
}
