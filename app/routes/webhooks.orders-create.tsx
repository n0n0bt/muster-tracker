import type { ActionFunctionArgs } from "@remix-run/node";
import  prisma  from "~/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const rawBody = await request.text();
  const order = JSON.parse(rawBody);

  const hasMuster = order.line_items.some((item: any) =>
    item.title.toLowerCase().includes("muster") ||
    (item.tags || []).some((tag: string) => tag.toLowerCase().includes("muster"))
  );

  if (!hasMuster) {
    console.log("🚫 Order does not contain a muster product.");
    return new Response("no_muster");
  }

  const recentGclidEvent = await prisma.trackingEvent.findFirst({
    where: {
      gclid: { not: "" },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!recentGclidEvent) {
    console.log("⚠️ No recent gclid found in trackingEvent.");
    return new Response("no_gclid");
  }

  await prisma.order.create({
    data: {
      shopifyOrderId: String(order.id),
      email: order.email || "unknown@example.com",
      gclid: recentGclidEvent.gclid,
      createdAt: new Date(order.created_at),
    },
  });

  console.log("✅ Muster order tracked:", {
    orderId: order.id,
    gclid: recentGclidEvent.gclid,
  });

  return new Response("ok");
};
