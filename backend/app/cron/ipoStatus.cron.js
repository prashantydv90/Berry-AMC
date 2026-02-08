import cron from "node-cron";
import { IPO } from "../models/markets/ipo.model.js";


/* ================= HELPER ================= */
const getTodayMidnight = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/* ================= CRON ================= */
export const startIpoStatusCron = () => {
  // Runs every day at 12:00 AM
  cron.schedule("0 0 * * *", async () => {
    const today = getTodayMidnight();

    console.log(
      `[CRON] IPO status update started at ${today.toISOString()}`
    );

    try {
      /* ===== UPCOMING ===== */
      const upcomingResult = await IPO.updateMany(
        {
          issueStartDate: { $gt: today },
        },
        {
          $set: { status: "Upcoming" },
        }
      );

      /* ===== OPEN ===== */
      const openResult = await IPO.updateMany(
        {
          issueStartDate: { $lte: today },
          issueEndDate: { $gte: today },
        },
        {
          $set: { status: "Open" },
        }
      );

      /* ===== CLOSED ===== */
      const closedResult = await IPO.updateMany(
        {
          issueEndDate: { $lt: today },
        },
        {
          $set: { status: "Closed" },
        }
      );

      console.log(
        `[CRON] IPO status update completed | Upcoming: ${upcomingResult.modifiedCount}, Open: ${openResult.modifiedCount}, Closed: ${closedResult.modifiedCount}`
      );
    } catch (error) {
      console.error(
        "[CRON] IPO status update failed:",
        error.message
      );
    }
  });
};
