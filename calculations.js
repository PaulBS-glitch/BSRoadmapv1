
export function currency(value) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function signedCurrency(value) {
  const n = Number(value || 0);
  return `${n >= 0 ? "+" : "-"}${currency(Math.abs(n))}`;
}

export function percent(value, digits = 1) {
  return `${(Number(value || 0) * 100).toFixed(digits)}%`;
}

export function shortCurrency(value) {
  const n = Number(value || 0);
  if (Math.abs(n) >= 1000000) {
    const m = n / 1000000;
    return `$${m.toFixed(m % 1 === 0 ? 0 : 2).replace(/\.00$/, "")}m`;
  }
  return currency(n);
}

export function firstName(data) {
  return String(data.customerName || "Customer").trim().split(/\s+/)[0] || "Customer";
}

export function annualMortgagePayment(principal, annualRate, termYears) {
  const p = Number(principal || 0);
  const r = Number(annualRate || 0) / 12;
  const n = Number(termYears || 30) * 12;
  if (!p || !n) return 0;
  if (!r) return p / n * 12;
  const monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return monthly * 12;
}

export function mortgageBalanceAfterYears(principal, annualRate, termYears, years) {
  const p = Number(principal || 0);
  const r = Number(annualRate || 0) / 12;
  const n = Number(termYears || 30) * 12;
  const paid = Number(years || 0) * 12;
  if (!p) return 0;
  if (!r) return Math.max(0, Math.round(p * (1 - paid / n)));
  const monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const balance = p * Math.pow(1 + r, paid) - monthly * ((Math.pow(1 + r, paid) - 1) / r);
  return Math.max(0, Math.round(balance));
}

export function futureValue(value, growthRate, years) {
  return Math.round(Number(value || 0) * Math.pow(1 + Number(growthRate || 0), Number(years || 0)));
}

export function lmiRateForLvr(lvr) {
  if (lvr <= 0.80) return 0;
  if (lvr <= 0.85) return 0.008;
  if (lvr <= 0.90) return 0.022;
  if (lvr <= 0.95) return 0.046;
  return null;
}

export function estimateLmi(propertyValue, depositAmount) {
  const price = Number(propertyValue || 0);
  const deposit = Number(depositAmount || 0);
  const loan = Math.max(0, price - deposit);
  const lvr = price > 0 ? loan / price : 0;
  const rate = lmiRateForLvr(lvr);
  if (rate === null) return null;
  return Math.round(loan * rate);
}

export function buySoonerExitShare(data, exitValue, years) {
  const price = Number(data.targetPurchasePrice || 0);
  const boost = Number(data.buySoonerBoost || 0);
  const contributionRatio = price > 0 ? boost / price : 0;
  const divisor = Number(data.participationDivisor || 5);
  const annualParticipationRate = divisor ? contributionRatio / divisor : 0;
  return Math.round(Number(exitValue || 0) * annualParticipationRate * Number(years || 0));
}

export function getDerived(data) {
  const price = Number(data.targetPurchasePrice || 0);
  const contribution = Number(data.customerContribution || 0);
  const boost = Number(data.buySoonerBoost || 0);
  const totalDeposit = contribution + boost;
  const estimatedMortgage = Number(data.estimatedMortgage || Math.max(0, price - totalDeposit));
  const depositPercent = price > 0 ? totalDeposit / price : 0;
  const targetDeposit = Math.round(price * 0.20);
  const depositGap = Math.max(0, targetDeposit - contribution);

  const growthRate = Number(data.growthRate || 0.05);
  const waitingYears = Number(data.waitingYears || 3);
  const exitYear = Number(data.exitYear || 3);
  const rentMonthly = Number(data.currentRentMonthly || 0);

  const oneYearGrowth = Math.round(price * growthRate);
  const futureAfterWait = futureValue(price, growthRate, waitingYears);
  const priceMovement = futureAfterWait - price;
  const rentDrain = Math.round(rentMonthly * 12 * waitingYears);
  const waitingTax = priceMovement + rentDrain;

  const exitValue = futureValue(price, growthRate, exitYear);
  const growthCaptured = exitValue - price;
  const mortgageBalanceExit = mortgageBalanceAfterYears(
    estimatedMortgage,
    Number(data.mortgageInterestRate || 0.065),
    Number(data.mortgageTermYears || 30),
    exitYear
  );
  const exitShare = buySoonerExitShare(data, exitValue, exitYear);
  const totalBuySoonerPayout = boost + exitShare;
  const refinanceAmount = mortgageBalanceExit + totalBuySoonerPayout;
  const refinanceLvr = exitValue > 0 ? refinanceAmount / exitValue : 0;
  const capitalCostSaved = Math.round(boost * Number(data.mortgageInterestRate || 0.065) * exitYear);

  const lmiBefore = estimateLmi(price, contribution) || 0;
  const lmiAfter = estimateLmi(price, totalDeposit) || 0;
  const lmiAvoided = Math.max(0, lmiBefore - lmiAfter);

  return {
    price,
    contribution,
    boost,
    totalDeposit,
    estimatedMortgage,
    depositPercent,
    targetDeposit,
    depositGap,
    growthRate,
    waitingYears,
    exitYear,
    rentMonthly,
    oneYearGrowth,
    futureAfterWait,
    priceMovement,
    rentDrain,
    waitingTax,
    exitValue,
    growthCaptured,
    mortgageBalanceExit,
    exitShare,
    totalBuySoonerPayout,
    refinanceAmount,
    refinanceLvr,
    capitalCostSaved,
    lmiAvoided
  };
}

export function scenarioForGrowth(data, growthRate) {
  const price = Number(data.targetPurchasePrice || 0);
  const mortgage = Number(data.estimatedMortgage || 0);
  const rate = Number(data.mortgageInterestRate || 0.065);
  const term = Number(data.mortgageTermYears || 30);
  const boost = Number(data.buySoonerBoost || 0);
  const targetLvr = Number(data.refinanceTargetLvr || 0.80);

  const rows = [3, 4, 5].map(year => {
    const value = futureValue(price, growthRate, year);
    const loanBalance = mortgageBalanceAfterYears(mortgage, rate, term, year);
    const exitShare = buySoonerExitShare(data, value, year);
    const payout = boost + exitShare;
    const refinance = loanBalance + payout;
    const lvr = value > 0 ? refinance / value : 0;
    return { year, value, loanBalance, exitShare, payout, refinance, lvr };
  });

  const likely = rows.find(row => row.lvr <= targetLvr) || rows[rows.length - 1];
  return { growthRate, rows, likelyYear: likely.year, likely };
}
