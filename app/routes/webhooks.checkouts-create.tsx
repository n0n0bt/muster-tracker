import { json } from "@remix-run/node";

export const action = async ({ request }: { request: Request }) => {
  console.log("📩 Webhook: checkouts/create triggered");

  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);

    const lineItems = payload.line_items || [];

    const hasMuster = lineItems.some((item: any) =>
      item.title.toLowerCase().includes("muster")
    );

    if (hasMuster) {
      console.log("🟡 Muster detected in checkout!");
    } else {
      console.log("🟢 No Muster in checkout.");
    }

    return json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new Response("Webhook error", { status: 500 });
  }
};
