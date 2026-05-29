export interface RateCalculatorInputs {
  yearlyIncomeGoal: number
  monthlyExpenses: number
  taxRate: number
  billableHoursPerWeek: number
  vacationWeeks: number
  softwareCosts: number
  emergencyBuffer: number
}

export interface RateCalculatorOutputs {
  minimumHourlyRate: number
  recommendedHourlyRate: number
  idealProjectPrice4h: number
  idealProjectPrice8h: number
  idealProjectPrice40h: number
  monthlyProjection: number
  yearlyProjection: number
  burnoutWarning: boolean
}

export interface FeeCalculatorInputs {
  amount: number
  platform: "upwork" | "fiverr" | "freelancer" | "paypal" | "wise" | "stripe" | "custom"
  region: "usa" | "canada"
  transactionType: "domestic" | "international"
  currency: string
  instantWithdrawal: boolean
  conversionFee: number
}

export interface FeeCalculatorOutputs {
  processingFee: number
  platformFee: number
  hiddenFees: number
  conversionFeeAmount: number
  totalFees: number
  finalAmount: number
  feePercent: number
}

export interface ROICalculatorInputs {
  contractValue: number
  estimatedHours: number
  meetingHours: number
  revisionHours: number
  overheadPercent: number
  toolCosts: number
  delayRisk: number
}

export interface ROICalculatorOutputs {
  effectiveHourlyRate: number
  realProfit: number
  riskScore: number
  riskLevel: "low" | "medium" | "high"
  recommendation: string
}

export interface TaxEstimatorInputs {
  filingStatus: "single" | "married" | "head"
  annualIncome: number
  businessExpenses: number
  retirementContributions: number
  healthInsurance: number
  state: string
}

export interface TaxEstimatorOutputs {
  grossIncome: number
  businessExpenseDeduction: number
  adjustedGrossIncome: number
  standardDeduction: number
  taxableIncome: number
  estimatedFederalTax: number
  selfEmploymentTax: number
  totalTax: number
  effectiveTaxRate: number
  monthlySetAside: number
}

export interface UserProfile {
  id: string
  email: string
  name: string
  avatarUrl?: string
  plan: "free" | "pro" | "enterprise"
  createdAt: string
}
