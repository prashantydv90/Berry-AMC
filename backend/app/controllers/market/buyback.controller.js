import axios from "axios";
import { Buyback } from "../../models/markets/buyback.model.js";

export const insertBuybacks = async (req, res) => {
  try {
    await fetchAnnouncements();
    res.json({ success: true, message: "Data synced" });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const client = axios.create({
  timeout: 15000,
  withCredentials: true,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    Accept: "application/json",
  },
});

const HOME_URL = "https://www.nseindia.com";
const API_URL =
  "https://www.nseindia.com/api/corporate-announcements?index=equities";

export async function fetchAnnouncements() {
  console.log("Fetching cookies...");
  // await client.get(HOME_URL);

  console.log("Fetching announcements...");
  const { data } = await client.get(API_URL);
  console.log(data);

  if (!Array.isArray(data)) {
    console.log("Unexpected response");
    return;
  }

  for (const item of data) {
    try {
      const desc = (item.desc || "").toLowerCase();
      const details = (item.attchmntText || "").toLowerCase();

      // 🚨 FILTER: only BUYBACK announcements
      if (!desc.includes("buyback") && !details.includes("buyback")) {
        continue; // skip non-buyback items
      }

      const broadcastAt = new Date(item.an_dt);

      await Buyback.updateOne(
        {
          symbol: item.symbol,
          broadcastAt,
        },
        {
          $setOnInsert: {
            symbol: item.symbol,
            companyName: item.sm_name,
            desc: item.desc,
            details: item.attchmntText,
            broadcastAt,
            pdfUrl: item.attchmntFile,
          },
        },
        { upsert: true },
      );
    } catch (err) {
      if (err.code !== 11000) {
        console.error(`Error for ${item.symbol}:`, err.message);
      }
    }
  }
}
