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

export interface DetailedInsight {
  title: string;
  type: "success" | "warning" | "danger" | "info";
  explanation: string;
  impact: string;
  tag?: string;
  actions: string[];
}

export interface Insight {
  type: "success" | "warning" | "danger" | "info";
  text: string;
  tag?: string;
}

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
  detailedInsights: DetailedInsight[];
  redFlags: string[];
  topActions: string[];
  bestMove: string;
  worstMistake: string;
  summaryLine: string;
  heroHeadline: string;
  heroSubtext: string;
}

export function analyzeFinancials(f: UserFinancials): FinancialHealth {
  const savingsRate = f.monthlyIncome > 0 ? ((f.monthlyIncome - f.monthlyExpenses) / f.monthlyIncome) * 100 : 0;
  const emergencyMonths = f.monthlyExpenses > 0 ? f.totalSavings / f.monthlyExpenses : 0;
  const debtRatio = f.monthlyIncome > 0 ? (f.monthlyEMI / f.monthlyIncome) * 100 : 0;
  const investmentRate = f.monthlyIncome > 0 ? (f.monthlySIP / f.monthlyIncome) * 100 : 0;
  const netWorth = f.totalSavings + f.totalInvestments - f.totalDebt;
  const burnRate = f.monthlyExpenses;
  const monthlySurplus = f.monthlyIncome - f.monthlyExpenses;

  const insights: Insight[] = [];
  const detailedInsights: DetailedInsight[] = [];
  const redFlags: string[] = [];
  const topActions: string[] = [];

  // 1. Emergency Fund Analysis
  const emergencyTarget = f.monthlyExpenses * 6;
  const emergencyGap = Math.max(0, emergencyTarget - f.totalSavings);
  if (emergencyMonths < 3) {
    detailedInsights.push({
      title: "Emergency Fund Risk",
      type: "danger",
      explanation: `You only have ${emergencyMonths.toFixed(1)} months of expenses saved (${formatINR(f.totalSavings)}). Financial experts recommend at least 6 months. A single job loss or medical emergency could force you into high-interest debt.`,
      impact: `Short-term: Any unexpected expense could wipe out your savings. Long-term: Without a safety net, you may be forced to break investments at a loss or take personal loans at 14-18% interest.`,
      tag: "Urgent",
      actions: [
        `Set up a recurring deposit of ${formatINR(Math.ceil(emergencyGap / 6))} per month into a liquid fund`,
        `Target total emergency fund: ${formatINR(emergencyTarget)} (6 months × ${formatINR(f.monthlyExpenses)})`,
        `Timeline: Complete in 6 months by automating transfers on salary day`,
      ],
    });
    insights.push({ type: "danger", text: `Only ${emergencyMonths.toFixed(1)} months of emergency fund. Need 6+ months.`, tag: "Urgent" });
    redFlags.push("Insufficient emergency fund");
    topActions.push(`Build emergency fund to ${formatINR(emergencyTarget)}`);
  } else if (emergencyMonths < 6) {
    detailedInsights.push({
      title: "Emergency Fund Incomplete",
      type: "warning",
      explanation: `You have ${emergencyMonths.toFixed(1)} months covered — better than most, but still below the recommended 6 months. You're vulnerable to extended income disruptions.`,
      impact: `Short-term: Moderate protection for small emergencies. Long-term: A prolonged job search (avg 3-6 months in India) could still deplete your reserves.`,
      tag: "Needs Attention",
      actions: [
        `Add ${formatINR(Math.ceil(emergencyGap / 3))} per month to your savings for the next 3 months`,
        `Park emergency funds in a liquid mutual fund (not savings account) for 5-6% returns`,
        `Timeline: Complete 6-month buffer within 3 months`,
      ],
    });
    insights.push({ type: "warning", text: `Emergency fund at ${emergencyMonths.toFixed(1)} months — aim for 6 months.`, tag: "Needs Attention" });
  } else {
    detailedInsights.push({
      title: "Emergency Fund Secured",
      type: "success",
      explanation: `Excellent — you have ${emergencyMonths.toFixed(1)} months of expenses covered. This puts you in the top 10% of Indian earners in terms of financial preparedness.`,
      impact: `Short-term: You can handle any surprise expense without stress. Long-term: Financial stability enables better investment decisions without panic selling.`,
      tag: "Secure",
      actions: [
        `Keep emergency fund in a liquid fund earning 5-6% instead of a savings account (3.5%)`,
        `Review and adjust the target amount every 6 months as expenses change`,
        `Consider a separate medical emergency corpus of ${formatINR(f.monthlyExpenses * 3)} in a separate account`,
      ],
    });
    insights.push({ type: "success", text: `Strong emergency fund: ${emergencyMonths.toFixed(1)} months covered.`, tag: "Secure" });
  }

  // 2. Savings Rate Analysis
  if (savingsRate < 10) {
    detailedInsights.push({
      title: "Critical Savings Deficit",
      type: "danger",
      explanation: `Your savings rate is ${savingsRate.toFixed(1)}% — you're saving almost nothing from your income of ${formatINR(f.monthlyIncome)}. At this rate, retirement will be impossible without a drastic lifestyle change.`,
      impact: `Short-term: Zero financial progress; you're living paycheck to paycheck. Long-term: No retirement corpus, complete dependence on others in old age.`,
      tag: "High Risk",
      actions: [
        `Audit your expenses and cut ${formatINR(Math.round(f.monthlyIncome * 0.2))} from non-essential spending immediately`,
        `Target 30% savings rate: Save ${formatINR(Math.round(f.monthlyIncome * 0.3))} per month`,
        `Start with the 50-30-20 rule: 50% needs, 30% wants, 20% savings — then gradually shift to 50-20-30`,
      ],
    });
    insights.push({ type: "danger", text: `Savings rate critically low at ${savingsRate.toFixed(1)}%. Target at least 30%.`, tag: "High Risk" });
    redFlags.push("Dangerously low savings rate");
    topActions.push("Cut discretionary spending by ₹15,000/month immediately");
  } else if (savingsRate < 20) {
    detailedInsights.push({
      title: "Below-Average Savings Rate",
      type: "warning",
      explanation: `At ${savingsRate.toFixed(1)}%, you're saving less than the recommended 30%. While not critical, this pace won't build meaningful wealth over time.`,
      impact: `Short-term: Slow wealth accumulation. Long-term: Retirement could be delayed by 5-8 years compared to a 30% saver.`,
      tag: "Needs Attention",
      actions: [
        `Increase savings by ${formatINR(Math.round(f.monthlyIncome * 0.3 - (f.monthlyIncome - f.monthlyExpenses)))} per month`,
        `Automate savings: set up auto-debit to a mutual fund on salary day`,
        `Review subscriptions and recurring expenses — most people find ₹3,000-5,000 in waste`,
      ],
    });
    insights.push({ type: "warning", text: `Savings rate at ${savingsRate.toFixed(1)}% — below the recommended 30%.`, tag: "Needs Attention" });
    topActions.push("Increase savings rate to 30% by reducing non-essentials");
  } else if (savingsRate >= 40) {
    insights.push({ type: "success", text: `Excellent savings rate of ${savingsRate.toFixed(1)}%!`, tag: "Strong Saver" });
  } else {
    insights.push({ type: "info", text: `Savings rate at ${savingsRate.toFixed(1)}% — good, aim for 40%+.` });
  }

  // 3. Debt Analysis
  if (debtRatio > 40) {
    detailedInsights.push({
      title: "Dangerous Debt Burden",
      type: "danger",
      explanation: `${debtRatio.toFixed(1)}% of your income goes to EMIs (${formatINR(f.monthlyEMI)}/month). Banks consider anything above 40% as a debt trap. You're at serious risk of default if income drops even slightly.`,
      impact: `Short-term: Almost no disposable income for savings or emergencies. Long-term: Compounding interest on debt grows faster than your ability to pay — risk of a debt spiral.`,
      tag: "Debt Trap",
      actions: [
        `List all loans by interest rate. Attack the highest rate first (avalanche method)`,
        `Consider balance transfer: Move high-interest loans (>12%) to a lower-rate option, saving ${formatINR(Math.round(f.totalDebt * 0.03))} per year`,
        `Avoid any new loans or EMI purchases until debt ratio drops below 30%`,
      ],
    });
    insights.push({ type: "danger", text: `EMI-to-income ratio at ${debtRatio.toFixed(1)}% — dangerously high!`, tag: "Debt Trap" });
    redFlags.push("Excessive debt burden");
    topActions.push("Prioritize debt repayment — consider balance transfer at lower rate");
  } else if (debtRatio > 25) {
    detailedInsights.push({
      title: "Elevated Debt Ratio",
      type: "warning",
      explanation: `Your EMI payments are ${debtRatio.toFixed(1)}% of income. While manageable, this leaves limited room for savings and investments. Any income disruption would be stressful.`,
      impact: `Short-term: Reduced ability to save and invest. Long-term: Slower wealth creation; may delay financial goals by 3-5 years.`,
      tag: "Monitor",
      actions: [
        `Make one extra EMI payment per quarter to reduce loan tenure by 15-20%`,
        `Target bringing EMI ratio below 25% within 12 months`,
        `Avoid new loans — focus on clearing existing debt first`,
      ],
    });
    insights.push({ type: "warning", text: `Debt ratio at ${debtRatio.toFixed(1)}%. Try to bring below 25%.` });
  }

  // 4. Investment Rate Analysis
  if (investmentRate < 10) {
    const idealSIP = Math.round(f.monthlyIncome * 0.2);
    const sipGap = idealSIP - f.monthlySIP;
    const projectedGain = Math.round(sipGap * 12 * 15 * 1.12); // rough 15yr compounding
    detailedInsights.push({
      title: "Severely Under-Investing",
      type: "warning",
      explanation: `You're investing only ${investmentRate.toFixed(1)}% of your income (${formatINR(f.monthlySIP)}/month). The recommended minimum is 20%. Inflation alone erodes 6% of your purchasing power yearly — you're falling behind.`,
      impact: `Short-term: Missing out on market growth during your prime earning years. Long-term: At this rate, you'll need to work 8-10 years longer than someone investing 20%.`,
      tag: "Under-Invested",
      actions: [
        `Increase SIP by ${formatINR(sipGap)} per month to reach 20% of income (${formatINR(idealSIP)}/month)`,
        `Start with a diversified index fund (Nifty 50 or Nifty Next 50) to minimize risk`,
        `This extra investment could grow to approximately ${formatINR(projectedGain)} over 15 years at 12% returns`,
      ],
    });
    insights.push({ type: "warning", text: `Only investing ${investmentRate.toFixed(1)}% of income. Increase SIP contributions.`, tag: "Under-Invested" });
    topActions.push("Increase SIP to at least 20% of income for wealth creation");
  } else if (investmentRate >= 25) {
    insights.push({ type: "success", text: `Great investment discipline — ${investmentRate.toFixed(1)}% of income in SIPs.`, tag: "Well Diversified" });
  }

  // 5. Negative Cash Flow
  if (monthlySurplus <= 0) {
    detailedInsights.push({
      title: "Negative Cash Flow — Financial Emergency",
      type: "danger",
      explanation: `You're spending ${formatINR(Math.abs(monthlySurplus))} more than you earn every month. Your savings of ${formatINR(f.totalSavings)} will be completely exhausted in ${f.totalSavings > 0 ? Math.round(f.totalSavings / Math.abs(monthlySurplus)) : 0} months.`,
      impact: `Short-term: Savings depleting every month. Long-term: Debt accumulation, credit score damage, and potential financial crisis.`,
      tag: "Critical",
      actions: [
        `Immediately cut expenses by at least ${formatINR(Math.abs(monthlySurplus) + Math.round(f.monthlyIncome * 0.1))} to create a positive surplus`,
        `Identify and eliminate the top 3 non-essential expenses this week`,
        `Consider additional income sources — freelancing, part-time work, or monetizing skills`,
      ],
    });
    insights.push({ type: "danger", text: `Negative cash flow! Savings will deplete in ${f.totalSavings > 0 ? (f.totalSavings / Math.abs(monthlySurplus)).toFixed(0) : 0} months.` });
    redFlags.push("Spending more than earning");
  }

  // Ensure minimum 3 detailed insights
  if (detailedInsights.length < 3) {
    // Add investment diversification insight
    if (!detailedInsights.find(i => i.title.includes("Invest"))) {
      const investRatio = f.totalInvestments > 0 ? f.totalInvestments / (f.totalSavings + f.totalInvestments) : 0;
      detailedInsights.push({
        title: "Investment Allocation Review",
        type: investRatio > 0.6 ? "success" : "info",
        explanation: `${(investRatio * 100).toFixed(0)}% of your liquid assets are invested. A healthy split is 60-70% investments, 30-40% liquid savings. Your current allocation ${investRatio > 0.6 ? "is well-balanced" : "is too conservative — keeping too much in savings loses to inflation"}.`,
        impact: `Short-term: ${investRatio > 0.6 ? "Good growth potential with adequate liquidity" : "Money sitting idle is losing 6% to inflation annually"}. Long-term: ${investRatio > 0.6 ? "Compounding will work strongly in your favor" : "Could mean ₹15-20 lakh less wealth over 10 years"}.`,
        tag: investRatio > 0.6 ? "Optimized" : "Review Needed",
        actions: [
          investRatio > 0.6 ? "Maintain current allocation and rebalance quarterly" : `Move ${formatINR(Math.round((f.totalSavings * 0.3)))} from savings to equity mutual funds`,
          "Split investments: 60% equity (SIP), 20% debt funds, 20% gold/alternatives",
          "Review allocation every 6 months and rebalance if drift exceeds 10%",
        ],
      });
    }
    // Add age-based wealth insight
    if (detailedInsights.length < 3) {
      const expectedNetWorth = f.monthlyIncome * 12 * (f.age - 22) * 0.15;
      const netWorthRatio = expectedNetWorth > 0 ? netWorth / expectedNetWorth : 1;
      detailedInsights.push({
        title: "Age-Based Wealth Benchmark",
        type: netWorthRatio >= 1 ? "success" : netWorthRatio >= 0.6 ? "info" : "warning",
        explanation: `Your net worth of ${formatINR(netWorth)} is ${netWorthRatio >= 1 ? "above" : "below"} the benchmark for a ${f.age}-year-old earning ${formatINR(f.monthlyIncome)}/month. By this age, ideally you should have ${formatINR(Math.round(expectedNetWorth))}.`,
        impact: `Short-term: ${netWorthRatio >= 1 ? "You're ahead of your peers financially" : "You have catching up to do"}. Long-term: ${netWorthRatio >= 1 ? "On track for a comfortable retirement" : "May need to extend working years or increase savings dramatically"}.`,
        tag: netWorthRatio >= 1 ? "On Track" : "Behind",
        actions: [
          netWorthRatio >= 1 ? "Stay the course — consider increasing SIP by 10% annually with salary hikes" : `Increase monthly investments by ${formatINR(Math.round((expectedNetWorth - netWorth) / ((f.retirementAge - f.age) * 12)))} to catch up`,
          "Step up SIP by 10% every year (matches typical salary increments)",
          `Target net worth: ${formatINR(Math.round(f.monthlyIncome * 12 * 3))} by age ${f.age + 5}`,
        ],
      });
    }
    // Add rent-to-income ratio insight
    if (detailedInsights.length < 3 && f.monthlyRent > 0) {
      const rentRatio = (f.monthlyRent / f.monthlyIncome) * 100;
      detailedInsights.push({
        title: "Housing Cost Analysis",
        type: rentRatio > 30 ? "warning" : "success",
        explanation: `You spend ${rentRatio.toFixed(0)}% of income on rent (${formatINR(f.monthlyRent)}/month). The recommended maximum is 30%. ${rentRatio > 30 ? "This is squeezing your ability to save and invest." : "This is within healthy limits."}`,
        impact: `Short-term: ${rentRatio > 30 ? "Less money for savings and investments" : "Good balance between housing and other financial goals"}. Long-term: ${rentRatio > 30 ? "May delay home ownership and retirement" : "Enables consistent wealth building"}.`,
        tag: rentRatio > 30 ? "High" : "Optimized",
        actions: [
          rentRatio > 30 ? "Consider relocating to save 20-30% on rent" : "Current rent is well-managed — maintain this ratio",
          rentRatio > 30 ? `Target rent: ${formatINR(Math.round(f.monthlyIncome * 0.25))}/month (25% of income)` : "If lease renews, negotiate or avoid increases above salary growth rate",
          "Evaluate rent vs. buy: A home loan EMI should also stay under 30% of income",
        ],
      });
    }
  }

  // Overspending detection
  const overspend = f.monthlyExpenses - f.monthlyIncome * 0.5;
  if (overspend > 0) {
    insights.push({ type: "danger", text: `You are overspending by ${formatINR(overspend)}/month beyond the 50% benchmark.` });
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

  return { score, savingsRate, emergencyMonths, debtRatio, investmentRate, netWorth, burnRate, riskLevel, insights, detailedInsights, redFlags, topActions, bestMove, worstMistake, summaryLine, heroHeadline, heroSubtext };
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

  // New regime (FY 2024-25)
  const newTaxable = Math.max(0, grossIncome - 75000);
  let newTax = 0;
  if (newTaxable > 400000) newTax += Math.min(newTaxable - 400000, 400000) * 0.05;
  if (newTaxable > 800000) newTax += Math.min(newTaxable - 800000, 400000) * 0.1;
  if (newTaxable > 1200000) newTax += Math.min(newTaxable - 1200000, 400000) * 0.15;
  if (newTaxable > 1600000) newTax += Math.min(newTaxable - 1600000, 400000) * 0.2;
  if (newTaxable > 2000000) newTax += (newTaxable - 2000000) * 0.3;
  newTax += newTax * 0.04;

  const totalDeductions = deductions80C + deductions80D + nps80CCD + hra + 50000; // 50k std deduction
  const taxSaved = Math.round(totalDeductions * 0.3 * 1.04); // approx savings at 30% slab
  const betterRegime = oldTax < newTax ? "Old" : "New";
  const savings = Math.abs(oldTax - newTax);

  const missedDeductions: string[] = [];
  if (nps80CCD === 0) missedDeductions.push(`NPS 80CCD(1B): Save up to ₹46,800/year by investing ₹50,000 in NPS`);
  if (deductions80D < 50000) missedDeductions.push(`Health Insurance 80D: Maximize to ₹50,000 (self + parents) for additional savings`);
  if (hra === 0 && income > 50000) missedDeductions.push(`HRA Exemption: Claim HRA if paying rent — could save ₹20,000-60,000/year`);
  if (deductions80C < 150000) missedDeductions.push(`Section 80C: You can invest ₹${((150000 - deductions80C) / 1000).toFixed(0)}K more in ELSS/PPF/EPF to save tax`);

  const effectiveOldRate = grossIncome > 0 ? (oldTax / grossIncome) * 100 : 0;
  const effectiveNewRate = grossIncome > 0 ? (newTax / grossIncome) * 100 : 0;

  return {
    oldTax: Math.round(oldTax),
    newTax: Math.round(newTax),
    savings: Math.round(savings),
    betterRegime,
    missedDeductions,
    grossIncome,
    totalDeductions,
    taxSaved: Math.round(taxSaved),
    effectiveOldRate,
    effectiveNewRate,
    oldTaxable: Math.round(oldTaxable),
    newTaxable: Math.round(newTaxable),
  };
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
