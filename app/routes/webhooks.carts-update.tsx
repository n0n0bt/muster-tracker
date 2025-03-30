import { json } from "@remix-run/node";

export const action = async ({ request }: { request: Request }) => {
  console.log("📩 Webhook: carts/update triggered");

  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);

    const lineItems = payload.line_items || [];

    const hasMuster = lineItems.some((item: any) =>
      item.title.toLowerCase().includes("muster")
    );

    if (hasMuster) {
      console.log("🟡 Muster detected in cart!");
    } else {
      console.log("🟢 No Muster in cart.");
    }

    return json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new Response("Webhook error", { status: 500 });
  }
};
