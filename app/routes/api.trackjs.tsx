// app/routes/api.trackjs.ts
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const js = `
  (function () {
    console.log("🟨 muster-tracker.js loaded");

    const gclid = new URLSearchParams(window.location.search).get("gclid");
    if (gclid) {
      console.log("💾 Saving gclid:", gclid);
      localStorage.setItem("gclid", gclid);
    }

    const checkMuster = async () => {
      try {
        const res = await fetch("/cart.js");
        const cart = await res.json();
        console.log("🛒 Cart fetched:", cart);

        const hasMuster = cart.items.some(item =>
          item.product_title.toLowerCase().includes("muster") ||
          (item.tags || []).some(tag => tag.toLowerCase().includes("muster"))
        );

        if (hasMuster) {
          const storedGclid = localStorage.getItem("gclid");
          console.log("📤 Sending muster_cart with gclid:", storedGclid);

          fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "muster_cart", gclid: storedGclid }),
          });
        }
      } catch (err) {
        console.error("⚠️ Error checking cart:", err);
      }
    };

    setInterval(checkMuster, 2000);
  })();
`;

  return new Response(js, {
    headers: {
      "Content-Type": "application/javascript",
    },
  });
};
