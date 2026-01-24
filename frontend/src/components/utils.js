export const  formatDate=(dateString)=> {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function formatDateRange(startDate, endDate) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const s = new Date(startDate);
  const e = new Date(endDate);

  const sDay = s.getDate();
  const sMonth = months[s.getMonth()];
  const sYear = s.getFullYear();

  const eDay = e.getDate();
  const eMonth = months[e.getMonth()];
  const eYear = e.getFullYear();

  // If same year
  if (sYear === eYear) {
    // If same month
    if (s.getMonth() === e.getMonth()) {
      return `${sDay}–${eDay} ${sMonth} ${sYear}`;
    } else {
      return `${sDay} ${sMonth} – ${eDay} ${eMonth} ${sYear}`;
    }
  }

  // If year changes
  return `${sDay} ${sMonth} ${String(sYear).slice(-2)}-${eDay} ${eMonth} ${String(eYear).slice(-2)}`;
}


export const formatYearMonth = (startMonth, endMonth) => {
if (!startMonth || !endMonth) return "—";

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const [startYear, startM] = startMonth.split("-").map(Number);
  const [endYear, endM] = endMonth.split("-").map(Number);

  const startMonthName = monthNames[startM - 1];
  const endMonthName = monthNames[endM - 1];

  if (startYear === endYear) {
    // Example: Jan–Mar 2025
    return `${startMonthName}-${endMonthName} ${startYear}`;
  } else {
    // Example: Dec'25–Feb'26
    return `${startMonthName}'${String(startYear).slice(-2)}-${endMonthName}'${String(endYear).slice(-2)}`;
  }
};


export const toIndianFormat=(num) =>{
  if (num === undefined || num === null || isNaN(num)) return "0";
  
  const x = num.toString().split(".");
  let integerPart = x[0];
  const decimalPart = x.length > 1 ? "." + x[1] : "";

  let lastThree = integerPart.slice(-3);
  let otherNumbers = integerPart.slice(0, -3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  const indianFormatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return indianFormatted + decimalPart;
}




export const getProjectedReturns=(principal, annualRate, startMonth = 8, startYear = 2025, years = 10)=> {
  const quarterlyRate = annualRate / 4 / 100; // convert annual % to quarterly decimal
  const quarters = years * 4;
  console.log(annualRate,quarterlyRate);

  let results = [];

  for (let i = 1; i <= quarters; i++) {
    const amount = principal * Math.pow(1 + quarterlyRate, i);

    // Every 4th quarter = 1 year completed
    if (i % 4 === 0) {
      const yearOffset = i / 4;
      const projectedYear = startYear + yearOffset;
      const projectedMonth = startMonth; // Keep same month

      // Format month/year nicely
      const monthName = new Date(projectedYear, projectedMonth - 1).toLocaleString('default', { month: 'short' });

      results.push({
        date: `${monthName} ${projectedYear}`,
        totalValue:  parseFloat(amount.toFixed(0)),
        profit:  parseFloat((amount - principal).toFixed(0)),
      });
    }
  }

  return results;
}


export const getAnnualizedReturn=(initialValue, finalValue, months)=> {
  if (initialValue <= 0 || months <= 0) {
    throw new Error("Initial value and months must be positive");
  }

  const years = months / 12; // convert months → years
  const annualizedRate = Math.pow(finalValue / initialValue, 1 / years) - 1;
  return annualizedRate * 100; // convert to %
}






export const calculateYearlyInterest=(data)=> {
  if (!Array.isArray(data) || data.length === 0) return 0;

  // Sort data by endMonth (latest first)
  const sorted = [...data].sort((a, b) => (a.endMonth < b.endMonth ? 1 : -1));

  // Extract latest period's end date
  const [latestYear, latestMonth] = sorted[0].endMonth.split('-').map(Number);
  const latestDate = new Date(latestYear, latestMonth - 1);

  let totalInterest = 0;
  let totalMonths = 0;

  for (const item of sorted) {
    const [year, month] = item.endMonth.split('-').map(Number);
    const itemDate = new Date(year, month - 1);

    // Include data within last 12 months
    const monthDiff =
      (latestDate.getFullYear() - itemDate.getFullYear()) * 12 +
      (latestDate.getMonth() - itemDate.getMonth());

    if (monthDiff <= 11) {
      // interest % for this period
      const invested = Number(item.totalValue) - Number(item.returns);
      if (invested > 0) {
        const periodInterest = (item.returns / invested) * 100;
        totalInterest += periodInterest;
      }

      // Estimate how many months this period covers (e.g., quarterly = 3)
      const [sy, sm] = item.startMonth.split('-').map(Number);
      const periodMonths =
        (year - sy) * 12 + (month - sm) + 1; // inclusive of both months
      totalMonths += periodMonths;
    }
  }

  // Adjust if total months < 12
  const yearlyInterest = (totalInterest / totalMonths) * 12;

  return Number(yearlyInterest.toFixed(2));
}






// export const projectFDReturns = (fd) => {
//   const projections = [];
//   const now = new Date();
//   const investedValue = fd.investedValue;

//   for (let year = 1; year <= 15; year++) {
//     const projectionDate = new Date(now);
//     projectionDate.setFullYear(now.getFullYear() + year);

//     // Calculate elapsed months from fd.date to projectionDate
//     const fdDate = new Date(fd.date);
//     const monthsElapsed =
//       (projectionDate.getFullYear() - fdDate.getFullYear()) * 12 +
//       (projectionDate.getMonth() - fdDate.getMonth());

//     // Convert months to years for compounding
//     const yearsElapsed = monthsElapsed / 12;

//     // Determine rate based on monthsElapsed
//     const rate = getFdRate(monthsElapsed);

//     // Calculate total value
//     const totalValue = investedValue * Math.pow(1 + rate / 100, yearsElapsed);

//     projections.push({
//       date: projectionDate.toISOString().split("T")[0], // YYYY-MM-DD
//       totalValue: parseFloat(totalValue.toFixed(2)),
//     });
//   }

//   return projections;
// };

// Same getFdRate function as before

export const projectFDReturns = (fd) => {
  const projections = [];
  const investedValue = fd.investedValue;
  const fdDate = new Date(fd.date);

  for (let year = 1; year <= 15; year++) {
    // Projection date = fd.date + year
    const projectionDate = new Date(fdDate);
    projectionDate.setFullYear(fdDate.getFullYear() + year);

    // Months elapsed from start to this projection date
    const monthsElapsed = year * 12;

    // Convert months to years for compounding
    const yearsElapsed = monthsElapsed / 12;

    // Determine applicable FD rate
    // const rate = getFdRate(monthsElapsed);
    const rate=18;

    // Calculate compounded total value
    const totalValue = investedValue * Math.pow(1 + rate / 100, yearsElapsed);

    projections.push({
      date: projectionDate.toISOString().split("T")[0], // YYYY-MM-DD
      totalValue: parseFloat(totalValue.toFixed(2)),
    });
  }

  return projections;
};




// function getFdRate(months) {
//   if (months <= 6) return 12;
//   if (months <= 9) return 14;
//   if (months <= 12) return 16;
//   return 18;
// }



function getFdRate(months) {
  if (months <= 6) return 12;
  if (months <= 9) return 14;
  if (months <= 12) return 16;
  return 18;
}



export const calculateFDValue = (principal, startDate, endDate)=> {
  const e=normalizeDate(endDate);
  const s=normalizeDate(startDate);
  const diffMs = e-s;
  const days = diffMs / (1000 * 60 * 60 * 24);
  const years = days / 365;
  const months = days / 30;

  const rate = getFdRate(months);
  const value = principal * Math.pow(1 + rate / 100, years);

  return { value, rate };
}

function normalizeDate(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

