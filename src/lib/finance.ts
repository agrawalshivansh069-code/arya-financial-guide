// Indian number formatting
export const formatINR = (n: number): string => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
};

export const formatPercent = (n: number): string => `${n.toFixed(1)}%`;

export interface UserFinancials {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  totalDebt: number;
  monthlyEMI: number;
  monthlyRent: number;
  monthlySIP: number;
  age: number;
  retirementAge: number;
  expectedReturn: number;
  inflationRate: number;
}

export const defaultFinancials: UserFinancials = {
  monthlyIncome: 120000,
  monthlyExpenses: 65000,
  totalSavings: 500000,
  totalInvestments: 1800000,
  totalDebt: 400000,
  monthlyEMI: 15000,
  monthlyRent: 20000,
  monthlySIP: 25000,
  age: 28,
  retirementAge: 45,
  expectedReturn: 12,
  inflationRate: 6,
};

export interface FinancialHealth {
  score: number;
  savingsRate: number;
  emergencyMonths: number;
  debtRatio: number;
  investmentRate: number;
  netWorth: number;
  burnRate: number;
  riskLevel: "Low" | "Medium" | "High";
  insights: Insight[];
  redFlags: string[];
  topActions: string[];
  bestMove: string;
  worstMistake: string;
  summaryLine: string;
  heroHeadline: string;
  heroSubtext: string;
}

export interface Insight {
  type: "success" | "warning" | "danger" | "info";
  text: string;
  tag?: string;
}

export function analyzeFinancials(f: UserFinancials): FinancialHealth {
  const savingsRate = ((f.monthlyIncome - f.monthlyExpenses) / f.monthlyIncome) * 100;
  const emergencyMonths = f.totalSavings / f.monthlyExpenses;
  const debtRatio = (f.monthlyEMI / f.monthlyIncome) * 100;
  const investmentRate = (f.monthlySIP / f.monthlyIncome) * 100;
  const netWorth = f.totalSavings + f.totalInvestments - f.totalDebt;
  const burnRate = f.monthlyExpenses;

  const insights: Insight[] = [];
  const redFlags: string[] = [];
  const topActions: string[] = [];

  // Savings rate
  if (savingsRate < 10) {
    insights.push({ type: "danger", text: `Your savings rate is critically low at ${savingsRate.toFixed(1)}%. Target at least 30%.`, tag: "High Risk" });
    redFlags.push("Dangerously low savings rate");
    topActions.push("Cut discretionary spending by ₹15,000/month immediately");
  } else if (savingsRate < 20) {
    insights.push({ type: "warning", text: `Savings rate at ${savingsRate.toFixed(1)}% — below the recommended 30%.`, tag: "Needs Attention" });
    topActions.push("Increase savings rate to 30% by reducing non-essentials");
  } else if (savingsRate >= 40) {
    insights.push({ type: "success", text: `Excellent savings rate of ${savingsRate.toFixed(1)}%!`, tag: "Strong Saver" });
  } else {
    insights.push({ type: "info", text: `Savings rate at ${savingsRate.toFixed(1)}% — good, aim for 40%+.` });
  }

  // Emergency fund
  if (emergencyMonths < 3) {
    insights.push({ type: "danger", text: `Only ${emergencyMonths.toFixed(1)} months of emergency fund. Need 6+ months.`, tag: "Urgent" });
    redFlags.push("Insufficient emergency fund");
    topActions.push(`Build emergency fund to ${formatINR(f.monthlyExpenses * 6)}`);
  } else if (emergencyMonths >= 6) {
    insights.push({ type: "success", text: `Strong emergency fund: ${emergencyMonths.toFixed(1)} months covered.`, tag: "Secure" });
  }

  // Debt
  if (debtRatio > 40) {
    insights.push({ type: "danger", text: `EMI-to-income ratio at ${debtRatio.toFixed(1)}% — dangerously high!`, tag: "Debt Trap" });
    redFlags.push("Excessive debt burden");
    topActions.push("Prioritize debt repayment — consider balance transfer at lower rate");
  } else if (debtRatio > 25) {
    insights.push({ type: "warning", text: `Debt ratio at ${debtRatio.toFixed(1)}%. Try to bring below 25%.` });
  }

  // Investment rate
  if (investmentRate < 10) {
    insights.push({ type: "warning", text: `Only investing ${investmentRate.toFixed(1)}% of income. Increase SIP contributions.`, tag: "Tax Inefficient" });
    topActions.push("Increase SIP to at least 20% of income for wealth creation");
  } else if (investmentRate >= 25) {
    insights.push({ type: "success", text: `Great investment discipline — ${investmentRate.toFixed(1)}% of income in SIPs.`, tag: "Well Diversified" });
  }

  // Overspending detection
  const overspend = f.monthlyExpenses - f.monthlyIncome * 0.5;
  if (overspend > 0) {
    insights.push({ type: "danger", text: `You are overspending by ${formatINR(overspend)}/month beyond the 50% benchmark.` });
  }

  // Runway
  const monthlySurplus = f.monthlyIncome - f.monthlyExpenses;
  if (monthlySurplus <= 0) {
    insights.push({ type: "danger", text: `Negative cash flow! You will deplete savings in ${(f.totalSavings / Math.abs(monthlySurplus)).toFixed(0)} months.` });
    redFlags.push("Spending more than earning");
  }

  // Score calculation
  let score = 50;
  score += Math.min(savingsRate, 50) * 0.4;
  score += Math.min(emergencyMonths, 12) * 1.5;
  score -= Math.max(debtRatio - 20, 0) * 0.5;
  score += Math.min(investmentRate, 30) * 0.3;
  if (netWorth > 0) score += 5;
  score = Math.max(0, Math.min(100, score));

  const riskLevel = score >= 70 ? "Low" : score >= 45 ? "Medium" : "High";

  if (topActions.length === 0) topActions.push("Stay the course — your finances are in great shape!");

  // Best Move & Worst Mistake
  let bestMove: string;
  let worstMistake: string;

  if (savingsRate < 20) {
    bestMove = `Cut ₹${Math.round((f.monthlyIncome * 0.3 - (f.monthlyIncome - f.monthlyExpenses)) / 1000) * 1000} from monthly expenses — this alone could make you financially free 5 years sooner.`;
  } else if (investmentRate < 20) {
    bestMove = `Move ${formatINR(Math.round(f.monthlyIncome * 0.2 - f.monthlySIP))} more into SIPs each month — at 12% returns, this becomes ${formatINR(Math.round((f.monthlyIncome * 0.2 - f.monthlySIP) * 12 * 15))} in 15 years.`;
  } else if (emergencyMonths < 6) {
    bestMove = `Park ${formatINR(Math.round(f.monthlyExpenses * 6 - f.totalSavings))} in a liquid fund to complete your 6-month emergency buffer. Sleep better at night.`;
  } else {
    bestMove = "You're doing remarkably well. Consider diversifying into index funds or REITs for the next level of wealth building.";
  }

  if (debtRatio > 40) {
    worstMistake = `Taking on more debt. Your EMIs already eat ${debtRatio.toFixed(0)}% of income — one missed payment could trigger a debt spiral.`;
  } else if (emergencyMonths < 3) {
    worstMistake = `Not having an emergency fund. A single medical bill or job gap could force you into high-interest debt within weeks.`;
  } else if (savingsRate < 10) {
    worstMistake = `Continuing to spend ${formatINR(f.monthlyExpenses)}/month without a budget. At this rate, you'll have nothing saved for retirement.`;
  } else if (monthlySurplus > 0 && f.monthlySIP === 0) {
    worstMistake = `Keeping ${formatINR(monthlySurplus)}/month surplus in a savings account. Inflation is silently eating 6% of it every year.`;
  } else {
    worstMistake = "Withdrawing investments early for lifestyle upgrades — the compounding loss is much larger than you think.";
  }

  // Summary line
  let summaryLine: string;
  if (score >= 75) {
    summaryLine = "Your financial health is strong — you're building wealth consistently and your risk exposure is well managed.";
  } else if (score >= 55) {
    summaryLine = "Your finances are stable, but you're under-investing for long-term growth. Small changes now will compound massively.";
  } else if (score >= 35) {
    summaryLine = "Your financial health needs attention — high expenses and low investments are putting your future at risk.";
  } else {
    summaryLine = "Your finances are in critical condition. Immediate action on debt and spending is essential to avoid a crisis.";
  }

  // Hero headline & subtext
  let heroHeadline: string;
  let heroSubtext: string;
  if (monthlySurplus <= 0) {
    const runwayMonths = f.totalSavings > 0 ? Math.round(f.totalSavings / Math.abs(monthlySurplus)) : 0;
    heroHeadline = `🚨 At this pace, you'll run out of money in ${runwayMonths} months`;
    heroSubtext = "You're spending more than you earn. Cut expenses or increase income before it's too late.";
  } else if (score >= 70) {
    heroHeadline = "Your finances are in great shape — keep building!";
    heroSubtext = "Strong savings rate, healthy emergency fund, and disciplined investing. You're ahead of 90% of Indians your age.";
  } else if (investmentRate < 15) {
    const delayYears = Math.max(1, Math.round((20 - investmentRate) / 3));
    heroHeadline = `⚠ Under-investing could delay your retirement by ${delayYears}+ years`;
    heroSubtext = `Increasing your SIP by just ${formatINR(Math.round(f.monthlyIncome * 0.05))}/month could change everything.`;
  } else if (debtRatio > 30) {
    heroHeadline = `⚠ ${debtRatio.toFixed(0)}% of your income goes to EMIs — that's a warning sign`;
    heroSubtext = "Focus on clearing high-interest debt first. Every rupee saved on interest is a rupee earned.";
  } else {
    heroHeadline = `⚠ Your financial health score is ${Math.round(score)}/100 — room for improvement`;
    heroSubtext = "A few targeted changes to your savings and investment habits can significantly improve your outlook.";
  }

  return { score, savingsRate, emergencyMonths, debtRatio, investmentRate, netWorth, burnRate, riskLevel, insights, redFlags, topActions, bestMove, worstMistake, summaryLine, heroHeadline, heroSubtext };
}

// FIRE calculation
export function calculateFIRE(f: UserFinancials) {
  const annualExpenses = f.monthlyExpenses * 12;
  const fireNumber = annualExpenses * 25;
  const currentCorpus = f.totalSavings + f.totalInvestments;
  const gap = Math.max(0, fireNumber - currentCorpus);
  const realReturn = (f.expectedReturn - f.inflationRate) / 100;
  const monthlySurplus = f.monthlySIP;

  let years = 0;
  let corpus = currentCorpus;
  const projections: { year: number; corpus: number; target: number }[] = [];

  for (let y = 0; y <= 40; y++) {
    projections.push({ year: f.age + y, corpus, target: fireNumber });
    if (corpus >= fireNumber && years === 0 && y > 0) years = y;
    corpus = corpus * (1 + realReturn) + monthlySurplus * 12;
  }

  if (years === 0) years = 40;

  return { fireNumber, currentCorpus, gap, yearsToFIRE: years, projections };
}

// Tax calculation (Indian)
export function calculateTax(income: number, deductions80C: number = 150000, deductions80D: number = 25000, nps80CCD: number = 0, hra: number = 0) {
  const grossIncome = income * 12;

  // Old regime
  const oldTaxable = Math.max(0, grossIncome - 50000 - deductions80C - deductions80D - nps80CCD - hra);
  let oldTax = 0;
  if (oldTaxable > 250000) oldTax += Math.min(oldTaxable - 250000, 250000) * 0.05;
  if (oldTaxable > 500000) oldTax += Math.min(oldTaxable - 500000, 500000) * 0.2;
  if (oldTaxable > 1000000) oldTax += (oldTaxable - 1000000) * 0.3;
  oldTax += oldTax * 0.04; // cess

  // New regime
  const newTaxable = Math.max(0, grossIncome - 75000);
  let newTax = 0;
  if (newTaxable > 400000) newTax += Math.min(newTaxable - 400000, 400000) * 0.05;
  if (newTaxable > 800000) newTax += Math.min(newTaxable - 800000, 400000) * 0.1;
  if (newTaxable > 1200000) newTax += Math.min(newTaxable - 1200000, 400000) * 0.15;
  if (newTaxable > 1600000) newTax += Math.min(newTaxable - 1600000, 400000) * 0.2;
  if (newTaxable > 2000000) newTax += (newTaxable - 2000000) * 0.3;
  newTax += newTax * 0.04;

  const missedDeductions: string[] = [];
  if (nps80CCD === 0) missedDeductions.push(`NPS 80CCD(1B): Save up to ₹46,800/year by investing ₹50,000 in NPS`);
  if (deductions80D < 50000) missedDeductions.push(`Health Insurance 80D: Maximize to ₹50,000 (self + parents) for additional savings`);
  if (hra === 0 && income > 50000) missedDeductions.push(`HRA Exemption: Claim HRA if paying rent — could save ₹20,000-60,000/year`);

  return { oldTax, newTax, savings: Math.abs(oldTax - newTax), betterRegime: oldTax < newTax ? "Old" : "New", missedDeductions, grossIncome };
}

// Life events
export interface LifeEvent {
  name: string;
  icon: string;
  cost: number;
  monthlyImpact: number;
  taxImpact: number;
  description: string;
}

export const lifeEvents: LifeEvent[] = [
  { name: "Marriage", icon: "💑", cost: 1500000, monthlyImpact: 15000, taxImpact: -20000, description: "Wedding + setup costs, increased household expenses" },
  { name: "First Child", icon: "👶", cost: 300000, monthlyImpact: 20000, taxImpact: 0, description: "Hospital, baby essentials, ongoing childcare" },
  { name: "Home Purchase", icon: "🏠", cost: 5000000, monthlyImpact: 35000, taxImpact: -200000, description: "Down payment + EMI, tax benefits on home loan" },
  { name: "Car Purchase", icon: "🚗", cost: 1000000, monthlyImpact: 12000, taxImpact: 0, description: "EMI + insurance + fuel + maintenance" },
  { name: "Job Loss", icon: "⚠️", cost: 0, monthlyImpact: -80000, taxImpact: 0, description: "Loss of primary income, dip into savings" },
  { name: "Child Education", icon: "🎓", cost: 2500000, monthlyImpact: 10000, taxImpact: -20000, description: "College fees + hostel, education loan benefits" },
  { name: "Health Emergency", icon: "🏥", cost: 800000, monthlyImpact: 5000, taxImpact: -50000, description: "Major medical expense, ongoing treatment" },
  { name: "Startup", icon: "🚀", cost: 2000000, monthlyImpact: -50000, taxImpact: 0, description: "Capital investment, no salary for 12-18 months" },
];
