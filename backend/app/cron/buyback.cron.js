import cron from "node-cron";
import { fetchAnnouncements } from "../controllers/market/buyback.controller.js";



export function startBuybackCron() {
  // Runs every 3 minutes
  cron.schedule("*/3 * * * *", async () => {
    console.log(
      `[CRON] Buyback fetch started at ${new Date().toISOString()}`
    );

    try {
      await fetchAnnouncements();
      console.log("[CRON] Buyback fetch completed");
    } catch (err) {
      console.error("[CRON] Buyback fetch failed:", err.message);
    }
  });
}