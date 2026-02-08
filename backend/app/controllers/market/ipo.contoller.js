import { IPO } from "../../models/markets/ipo.model.js";


/* ================= COMMON HANDLER ================= */
const fetchByStatus = async (req, res, status) => {
  try {
    const ipos = await IPO.find({
      status,
    })
      .sort({ issueStartDate: 1 }) // earliest first
      .lean();

    return res.status(200).json({
      success: true,
      count: ipos.length,
      data: ipos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch IPOs",
      error: error.message,
    });
  }
};

/* ================= UPCOMING IPOs ================= */
export const getUpcomingIPOs = async (req, res) => {
  return fetchByStatus(req, res, "Upcoming");
};

/* ================= OPEN IPOs ================= */
export const getOpenIPOs = async (req, res) => {
  return fetchByStatus(req, res, "Open");
};

/* ================= CLOSED IPOs ================= */
export const getClosedIPOs = async (req, res) => {
  return fetchByStatus(req, res, "Closed");
};
