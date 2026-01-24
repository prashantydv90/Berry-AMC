import { Client } from "../models/client.model.js";
import { FDInvestment } from "../models/fdInvestment.model.js";

export const updateFDs = async () => {
  try {
    const fds = await FDInvestment.find().populate("client");
    if (!fds.length) {
      console.log("No FDs found to update.");
      return;
    }

    const clientMap = new Map();
    const now = new Date();

    for (let fd of fds) {
      try {
        const fdDate = new Date(fd.date);
        if (isNaN(fdDate)) {
          console.warn(`Skipping FD ${fd._id}: Invalid date`);
          continue;
        }

        // Calculate difference in days
        const s=normalizeDate(fdDate);
        const e=normalizeDate(now)
        const diffTime = e - s; // milliseconds
        const diffDays = (diffTime / (1000 * 60 * 60 * 24)) ;
        const yearsElapsed = diffDays / 365;

        // Approximate months for rate calculation
        const monthsElapsed = diffDays / 30;
        const rate = getFdRate(monthsElapsed);

        // Update FD total value
        fd.totalValue = fd.investedValue * Math.pow(1 + rate / 100, yearsElapsed);
        fd.rate = rate;

        await fd.save();
        console.log(`✅ FD ${fd._id} for client ${fd.client._id} updated: invested=${fd.investedValue}, totalValue=${fd.totalValue.toFixed(2)}, rate=${rate}%`);

        // Aggregate totals per client
        if (!clientMap.has(fd.client._id)) {
          clientMap.set(fd.client._id, {
            invested: 0,
            value: 0,
            client: fd.client,
          });
        }
        const data = clientMap.get(fd.client._id);
        data.invested += fd.investedValue;
        data.value += fd.totalValue;

      } catch (err) {
        console.error(`❌ Error updating FD ${fd._id}:`, err.message);
      }
    }

    // Update all clients once
    for (let { invested, value, client } of clientMap.values()) {
      try {
        client.FDTotalInvested = invested.toFixed(2);
        client.FDTotalValue = value.toFixed(2);
        await client.save();
        console.log(`✅ Client ${client._id} totals updated: FDTotalInvested=${client.FDTotalInvested}, FDTotalValue=${client.FDTotalValue}`);
      } catch (err) {
        console.error(`❌ Error updating client ${client._id}:`, err.message);
      }
    }

    console.log("🎯 All FD values updated successfully!");

  } catch (err) {
    console.error("❌ Error in updateFDs function:", err.message);
  }
};

function getFdRate(months) {
  if (months <= 6) return 12;
  if (months <= 9) return 14;
  if (months <= 12) return 16;
  return 18;
}


function normalizeDate(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}
