import { Client } from "../models/client.model.js";
import { smeipo } from "../models/smeipo.model.js";

export const updateSMEIPOs = async () => {
  try {
    const investments = await smeipo
      .find({ status: "active" })
      .populate("client");

    if (!investments.length) {
      console.log("No SME IPO investments found to update.");
      return;
    }

    const clientMap = new Map();
    const now = new Date();

    for (const investment of investments) {
      try {
        const date = new Date(investment.date);

        if (isNaN(date)) {
          console.warn(
            `Skipping SME IPO ${investment._id}: Invalid date`
          );
          continue;
        }

        const start = normalizeDate(date);
        const end = normalizeDate(now);

        const diffTime = end - start;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        const yearsElapsed = diffDays / 365;
        const monthsElapsed = diffDays / 30;

        const rate = getSMEIPORate(monthsElapsed);

        investment.totalValue =
          investment.investedValue *
          Math.pow(1 + rate / 100, yearsElapsed);

        investment.rate = rate;

        await investment.save();

        console.log(
          `✅ SME IPO ${investment._id} updated: invested=${
            investment.investedValue
          }, totalValue=${investment.totalValue.toFixed(
            2
          )}, rate=${rate}%`
        );

        if (!clientMap.has(investment.client._id.toString())) {
          clientMap.set(investment.client._id.toString(), {
            invested: 0,
            value: 0,
            client: investment.client,
          });
        }

        const data = clientMap.get(investment.client._id.toString());

        data.invested += Number(investment.investedValue);
        data.value += Number(investment.totalValue);
      } catch (err) {
        console.error(
          `❌ Error updating SME IPO ${investment._id}:`,
          err.message
        );
      }
    }

    for (const { invested, value, client } of clientMap.values()) {
      try {

        client.SMEIPOLTReturns = (
          Number(client.SMEIPOLTReturns) +
          Number(value) -
          Number(client.SMEIPOTotalValue)
        ).toFixed(2);

        client.SMEIPOTotalInvested = invested.toFixed(2);
        client.SMEIPOTotalValue = value.toFixed(2);

        await client.save();

        console.log(
          `✅ Client ${client._id} SME IPO totals updated: ` +
            `SMEIPOTotalInvested=${client.SMEIPOTotalInvested}, ` +
            `SMEIPOTotalValue=${client.SMEIPOTotalValue}`
        );
      } catch (err) {
        console.error(
          `❌ Error updating client ${client._id}:`,
          err.message
        );
      }
    }

    console.log("🎯 All SME IPO values updated successfully!");
  } catch (err) {
    console.error("❌ Error in updateSMEIPOs function:", err.message);
  }
};

function getSMEIPORate(months) {
  if (months <= 3) return 7;
  if (months <= 6) return 8;
  if (months <= 9) return 9;
  if (months <= 12) return 9;
  return 10;
}

function normalizeDate(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}