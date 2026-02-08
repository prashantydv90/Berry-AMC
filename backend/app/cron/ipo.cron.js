import cron from "node-cron";
import axios from "axios";
import { IPO } from "../models/markets/ipo.model.js";

/* ================= NSE CONFIG ================= */
const NSE_URL =
  "https://www.nseindia.com/api/all-upcoming-issues?category=ipo";

const axiosInstance = axios.create({
  timeout: 15000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json",
    Referer: "https://www.nseindia.com/",
    "Accept-Language": "en-US,en;q=0.9",
    Connection: "keep-alive",
  },
  withCredentials: true,
});

/* ================= HELPER ================= */
const mapStatus = (startDate, endDate) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (today < start) return "Upcoming";
  if (today > end) return "Closed";
  return "Open";
};

/* ================= CRON FUNCTION ================= */
export const startIpoCron = () => {
  // Runs every 5 hours
  cron.schedule("0 */5 * * *", async () => {
    console.log(
      `[CRON] IPO fetch started at ${new Date().toISOString()}`
    );

    try {
      const response = await axiosInstance.get(NSE_URL);
      const ipoList =
        response?.data || [];

      if (!Array.isArray(ipoList)) {
        console.error("[CRON] Invalid IPO data format");
        return;
      }

      for (const ipo of ipoList) {
        const symbol = ipo?.symbol?.toUpperCase();
        if (!symbol) continue;

        const issueStartDate = new Date(ipo.issueStartDate);
        const issueEndDate = new Date(ipo.issueEndDate);

        const status = mapStatus(
          issueStartDate,
          issueEndDate
        );

        await IPO.findOneAndUpdate(
          { symbol },
          {
            symbol,
            companyName: ipo.companyName,
            series: ipo.series || "EQ",
            issueStartDate,
            issueEndDate,
            priceBand: ipo.issuePrice,
            issueSize: Number(ipo.issueSize) || 0,
            overallSubscription: "--",
            status: "Upcoming",
          },
          {
            upsert: true,
            new: true,
          }
        );
      }

      console.log(
        `[CRON] IPO fetch completed | Records: ${ipoList.length}`
      );
    } catch (error) {
      console.error(
        "[CRON] IPO fetch failed:",
        error.message
      );
    }
  });
};
