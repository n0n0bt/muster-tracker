// app/routes/api.track.ts
import prisma from "~/db.server";
import type { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { event, gclid } = await request.json();

  if (event === "muster_cart" && gclid) {
    await prisma.trackingEvent.create({
      data: {
        eventType: event,
        gclid,
        source: "script",
      },
    });
  }

  console.log("📩 Tracker hit:", { event, gclid });
  return new Response("ok");
};
