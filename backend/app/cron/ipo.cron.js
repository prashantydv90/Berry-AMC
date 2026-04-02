// import cron from "node-cron";
// import axios from "axios";
// import { IPO } from "../models/markets/ipo.model.js";

// /* ================= NSE CONFIG ================= */
// const NSE_URL =
//   "https://www.nseindia.com/api/all-upcoming-issues?category=ipo";

// const axiosInstance = axios.create({
//   timeout: 15000,
//   headers: {
//     "User-Agent":
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//     Accept: "application/json",
//     Referer: "https://www.nseindia.com/",
//     "Accept-Language": "en-US,en;q=0.9",
//     Connection: "keep-alive",
//   },
//   withCredentials: true,
// });

// /* ================= HELPER ================= */
// const mapStatus = (startDate, endDate) => {
//   const today = new Date();
//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   if (today < start) return "Upcoming";
//   if (today > end) return "Closed";
//   return "Open";
// };

// /* ================= CRON FUNCTION ================= */
// export const startIpoCron = () => {
//   // Runs every 5 hours
//   cron.schedule("0 */5 * * *", async () => {
//     console.log(
//       `[CRON] IPO fetch started at ${new Date().toISOString()}`
//     );

//     try {
//       const response = await axiosInstance.get(NSE_URL);
//       const ipoList =
//         response?.data || [];

//       if (!Array.isArray(ipoList)) {
//         console.error("[CRON] Invalid IPO data format");
//         return;
//       }

//       for (const ipo of ipoList) {
//         const symbol = ipo?.symbol?.toUpperCase();
//         if (!symbol) continue;

//         const issueStartDate = new Date(ipo.issueStartDate);
//         const issueEndDate = new Date(ipo.issueEndDate);

//         const status = mapStatus(
//           issueStartDate,
//           issueEndDate
//         );

//         await IPO.findOneAndUpdate(
//           { symbol },
//           {
//             symbol,
//             companyName: ipo.companyName,
//             series: ipo.series || "EQ",
//             issueStartDate,
//             issueEndDate,
//             priceBand: ipo.issuePrice,
//             issueSize: Number(ipo.issueSize) || 0,
//             overallSubscription: "--",
//             status,
//           },
//           {
//             upsert: true,
//             new: true,
//           }
//         );
//       }

//       console.log(
//         `[CRON] IPO fetch completed | Records: ${ipoList.length}`
//       );
//     } catch (error) {
//       console.error(
//         "[CRON] IPO fetch failed:",
//         error.message
//       );
//     }
//   });
// };








import cron from "node-cron";
import axios from "axios";
import { IPO } from "../models/markets/ipo.model.js";
import { extractLotSize, parsePriceBand } from "../utils/ipo.utils.js";


/* ================= NSE CONFIG ================= */
const LIST_URL =
  "https://www.nseindia.com/api/all-upcoming-issues?category=ipo";

const DETAIL_URL = (symbol, series) =>
  `https://www.nseindia.com/api/ipo-detail?symbol=${symbol}&series=${series}`;

const axiosInstance = axios.create({
  timeout: 15000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json",
    Referer: "https://www.nseindia.com/",
  },
});

/* ================= STATUS ================= */
const mapStatus = (start, end) => {
  const today = new Date();
  if (today < start) return "Upcoming";
  if (today > end) return "Closed";
  return "Open";
};

/* ================= CRON ================= */
export const startIpoCron = () => {
  // Runs every 5 hours
  cron.schedule("0 */1 * * *", async () => {
    console.log(
      `[CRON] IPO fetch started at ${new Date().toISOString()}`
    );

      try {
        /* 1️⃣ NSE LIST */
        const listRes = await axiosInstance.get(LIST_URL);
        const ipoList = listRes?.data || [];

        if (!Array.isArray(ipoList)) {
          console.error("[CRON] Invalid NSE list response");
          return;
        }

        /* 2️⃣ EXISTING SYMBOLS */
        const existing = await IPO.find({}, { symbol: 1 }).lean();
        const symbolSet = new Set(existing.map((i) => i.symbol));

        /* 3️⃣ FILTER NEW IPOs */
        const newIpos = ipoList.filter(
          (ipo) =>
            ipo?.symbol &&
            !symbolSet.has(ipo.symbol.toUpperCase())
        );

        if (!newIpos.length) {
          console.log("[CRON] No new IPOs found");
          return;
        }

        const documents = [];

        /* 4️⃣ ENRICH EACH NEW IPO */
        for (const ipo of newIpos) {
          const symbol = ipo.symbol.toUpperCase();
          const series = ipo.series || "EQ";

          const issueStartDate = new Date(ipo.issueStartDate);
          const issueEndDate = new Date(ipo.issueEndDate);

          let lotSize = null;
          let minInvestment = null;
          let maxInvestment = null;
          let lowerPrice=0;
          let upperPrice=0;
          try {
            const detailRes = await axiosInstance.get(
              DETAIL_URL(symbol, series)
            );

            const issueInfo =
              detailRes?.data?.issueInfo?.dataList || [];

            lotSize = extractLotSize(issueInfo);

            ({lowerPrice, upperPrice} =
              parsePriceBand(ipo.issuePrice));

            if (lotSize && lowerPrice && upperPrice) {
              minInvestment = series==='EQ' ? lotSize * lowerPrice : lotSize * lowerPrice * 2;
              maxInvestment = series==='EQ' ? lotSize * upperPrice : lotSize * upperPrice * 2;
            }
          } catch (err) {
            // Do NOT block insertion if detail API fails
            console.error(
              `[CRON] Detail fetch failed for ${symbol}:`,
              err.message
            );
          }

          documents.push({
            symbol,
            companyName: ipo.companyName,
            series,
            issueStartDate,
            issueEndDate,
            lowerPrice,
            upperPrice,
            issueSize: Number(ipo.issueSize) || 0,
            overallSubscription: "--",
            status: mapStatus(issueStartDate, issueEndDate),
            lotSize,
            minInvestment,
            maxInvestment,
            isActive: true,
          });
        }

        /* 5️⃣ INSERT ALL */
        if (documents.length) {
          await IPO.insertMany(documents);
        }

        console.log(
          `[CRON] IPO fetch completed | Inserted: ${documents.length}`
        );
      } catch (err) {
        console.error(
          "[CRON] IPO cron failed:",
          err.message
        );
      }
    },
    { timezone: "Asia/Kolkata" }
  );
};




