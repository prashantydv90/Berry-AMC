



function calculateXIRR(cashflows, dates, guess = 0.1) {
  const maxIter = 100;
  const tol = 1e-6;

  const baseDate = new Date(dates[0]);

  const f = (rate) =>
    cashflows.reduce((acc, cf, i) => {
      const t = daysBetween(baseDate, dates[i]) / 365;
      return acc + cf / Math.pow(1 + rate, t);
    }, 0);

  const fPrime = (rate) =>
    cashflows.reduce((acc, cf, i) => {
      const t = daysBetween(baseDate, dates[i]) / 365;
      return acc - (t * cf) / Math.pow(1 + rate, t + 1);
    }, 0);

  let rate = guess;

  for (let i = 0; i < maxIter; i++) {
    const newRate = rate - f(rate) / fPrime(rate);
    if (Math.abs(newRate - rate) < tol) return rate * 100;
    rate = newRate;
  }

  return rate * 100;
}




export default function calculateClientXIRR(client) {
  if (
    !client?.MFInvestments?.length ||
    !client?.MFPeriodicInterest?.length
  ) {
    return 0;
  }

  // 1️⃣ Find latest return period (checkpoint)
  const lastReturn = client.MFPeriodicInterest.reduce((latest, curr) =>
    new Date(curr.endMonth) > new Date(latest.endMonth) ? curr : latest
  );

  const valuationDate = new Date(lastReturn.endMonth);
  const portfolioValue = Number(lastReturn.currentValue || lastReturn.totalValue);

  if (!portfolioValue || portfolioValue <= 0) return 0;

  const cashflows = [];
  const dates = [];

  // 2️⃣ Include ALL investments & withdrawals before valuation date
  for (const inv of client.MFInvestments) {
    if (new Date(inv.date) <= valuationDate) {
      const amt = Number(inv.investedValue);

      // invest → negative, withdraw → positive
      cashflows.push(amt > 0 ? -amt : Math.abs(amt));
      dates.push(new Date(inv.date));
    }
  }

  // 3️⃣ Final inflow = portfolio value at checkpoint
  cashflows.push(portfolioValue);
  dates.push(valuationDate);

  // 4️⃣ Sort by date
  const sorted = cashflows
    .map((cf, i) => ({ cf, date: dates[i] }))
    .sort((a, b) => a.date - b.date);

  const sortedCF = sorted.map((x) => x.cf);
  const sortedDates = sorted.map((x) => x.date);

  // 5️⃣ Must have at least one -ve and one +ve
  if (
    !sortedCF.some((x) => x < 0) ||
    !sortedCF.some((x) => x > 0)
  ) {
    return 0;
  }

  const xirr = calculateXIRR(sortedCF, sortedDates);
  return Number.isFinite(xirr) ? xirr.toFixed(2) : 0;
}




function normalizeDate(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function daysBetween(d1, d2) {
  return (normalizeDate(d2) - normalizeDate(d1)) / (1000 * 60 * 60 * 24);
}

