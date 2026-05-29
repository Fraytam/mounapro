import { create } from "zustand"
import type {
  RateCalculatorInputs,
  RateCalculatorOutputs,
  FeeCalculatorInputs,
  FeeCalculatorOutputs,
  ROICalculatorInputs,
  ROICalculatorOutputs,
  TaxEstimatorInputs,
  TaxEstimatorOutputs,
} from "@/types"

interface CalculatorState {
  // Rate Calculator
  rateInputs: RateCalculatorInputs
  rateOutputs: RateCalculatorOutputs | null
  setRateInputs: (inputs: Partial<RateCalculatorInputs>) => void
  calculateRate: () => void

  // Fee Calculator
  feeInputs: FeeCalculatorInputs
  feeOutputs: FeeCalculatorOutputs | null
  setFeeInputs: (inputs: Partial<FeeCalculatorInputs>) => void
  calculateFee: () => void

  // ROI Calculator
  roiInputs: ROICalculatorInputs
  roiOutputs: ROICalculatorOutputs | null
  setRoiInputs: (inputs: Partial<ROICalculatorInputs>) => void
  calculateROI: () => void

  // Tax Estimator
  taxInputs: TaxEstimatorInputs
  taxOutputs: TaxEstimatorOutputs | null
  setTaxInputs: (inputs: Partial<TaxEstimatorInputs>) => void
  calculateTax: () => void
}

const defaultRateInputs: RateCalculatorInputs = {
  yearlyIncomeGoal: 100000,
  monthlyExpenses: 2000,
  taxRate: 30,
  billableHoursPerWeek: 25,
  vacationWeeks: 4,
  softwareCosts: 200,
  emergencyBuffer: 10,
}

const defaultFeeInputs: FeeCalculatorInputs = {
  amount: 1000,
  platform: "upwork",
  region: "usa",
  transactionType: "domestic",
  currency: "USD",
  instantWithdrawal: false,
  conversionFee: 2.5,
}

const defaultRoiInputs: ROICalculatorInputs = {
  contractValue: 5000,
  estimatedHours: 40,
  meetingHours: 5,
  revisionHours: 8,
  overheadPercent: 15,
  toolCosts: 100,
  delayRisk: 10,
}

const defaultTaxInputs: TaxEstimatorInputs = {
  filingStatus: "single",
  annualIncome: 80000,
  businessExpenses: 5000,
  retirementContributions: 6000,
  healthInsurance: 4800,
  state: "California",
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  // Rate Calculator
  rateInputs: defaultRateInputs,
  rateOutputs: null,
  setRateInputs: (inputs) =>
    set((state) => ({ rateInputs: { ...state.rateInputs, ...inputs } })),
  calculateRate: () => {
    const i = get().rateInputs
    const totalYearlyExpenses =
      i.yearlyIncomeGoal + i.monthlyExpenses * 12 + i.softwareCosts * 12
    const withBuffer = totalYearlyExpenses * (1 + i.emergencyBuffer / 100)
    const billableWeeks = 52 - i.vacationWeeks
    const totalBillableHours = billableWeeks * i.billableHoursPerWeek
    const taxMultiplier = 1 / (1 - i.taxRate / 100)
    const minimumRate = (withBuffer / totalBillableHours) * taxMultiplier
    const recommendedRate = minimumRate * 1.3
    const monthlyProjection = recommendedRate * i.billableHoursPerWeek * 4.33
    const yearlyProjection = monthlyProjection * 12
    const burnoutWarning = i.billableHoursPerWeek > 35 || i.vacationWeeks < 2

    set({
      rateOutputs: {
        minimumHourlyRate: Math.round(minimumRate * 100) / 100,
        recommendedHourlyRate: Math.round(recommendedRate * 100) / 100,
        idealProjectPrice4h: Math.round(recommendedRate * 4 * 100) / 100,
        idealProjectPrice8h: Math.round(recommendedRate * 8 * 100) / 100,
        idealProjectPrice40h: Math.round(recommendedRate * 40 * 100) / 100,
        monthlyProjection: Math.round(monthlyProjection * 100) / 100,
        yearlyProjection: Math.round(yearlyProjection * 100) / 100,
        burnoutWarning,
      },
    })
  },

  // Fee Calculator
  feeInputs: defaultFeeInputs,
  feeOutputs: null,
  setFeeInputs: (inputs) =>
    set((state) => ({ feeInputs: { ...state.feeInputs, ...inputs } })),
  calculateFee: () => {
    const i = get().feeInputs
    const platformFees: Record<string, number> = {
      upwork: 0.1,
      fiverr: 0.2,
      freelancer: 0.1,
      paypal: 0.049,
      wise: 0.006,
      stripe: 0.029,
      custom: 0.05,
    }
    const platformFee = platformFees[i.platform] || 0.05
    const processingFee = i.amount * platformFee
    const fixedFee = i.region === "usa" ? 0.49 : 0.99
    const conversionFeeAmount =
      i.transactionType === "international" ? i.amount * (i.conversionFee / 100) : 0
    const instantFee = i.instantWithdrawal ? i.amount * 0.01 : 0
    const totalFees = processingFee + fixedFee + conversionFeeAmount + instantFee
    const finalAmount = i.amount - totalFees

    set({
      feeOutputs: {
        processingFee: Math.round(processingFee * 100) / 100,
        platformFee: Math.round(fixedFee * 100) / 100,
        hiddenFees: Math.round((conversionFeeAmount + instantFee) * 100) / 100,
        conversionFeeAmount: Math.round(conversionFeeAmount * 100) / 100,
        totalFees: Math.round(totalFees * 100) / 100,
        finalAmount: Math.max(0, Math.round(finalAmount * 100) / 100),
        feePercent: Math.round((totalFees / i.amount) * 10000) / 100,
      },
    })
  },

  // ROI Calculator
  roiInputs: defaultRoiInputs,
  roiOutputs: null,
  setRoiInputs: (inputs) =>
    set((state) => ({ roiInputs: { ...state.roiInputs, ...inputs } })),
  calculateROI: () => {
    const i = get().roiInputs
    const totalHours = i.estimatedHours + i.meetingHours + i.revisionHours
    const overheadAmount = i.contractValue * (i.overheadPercent / 100)
    const totalCosts = overheadAmount + i.toolCosts
    const realProfit = i.contractValue - totalCosts
    const riskAdjustedHours = totalHours * (1 + i.delayRisk / 100)
    const effectiveHourlyRate = realProfit / riskAdjustedHours
    const riskScore = Math.min(100, i.delayRisk * 2 + (i.revisionHours / i.estimatedHours) * 50)
    const riskLevel: "low" | "medium" | "high" =
      riskScore < 30 ? "low" : riskScore < 60 ? "medium" : "high"

    let recommendation = ""
    if (effectiveHourlyRate < 25) {
      recommendation = "This contract pays below a living wage. Consider negotiating or passing."
    } else if (effectiveHourlyRate < 50) {
      recommendation = "Decent rate but account for all hours. Try to minimize revisions."
    } else if (effectiveHourlyRate < 100) {
      recommendation = "Good contract value. Ensure scope is well-defined."
    } else {
      recommendation = "Excellent ROI! This contract is highly profitable."
    }

    set({
      roiOutputs: {
        effectiveHourlyRate: Math.round(effectiveHourlyRate * 100) / 100,
        realProfit: Math.round(realProfit * 100) / 100,
        riskScore: Math.round(riskScore * 100) / 100,
        riskLevel,
        recommendation,
      },
    })
  },

  // Tax Estimator
  taxInputs: defaultTaxInputs,
  taxOutputs: null,
  setTaxInputs: (inputs) =>
    set((state) => ({ taxInputs: { ...state.taxInputs, ...inputs } })),
  calculateTax: () => {
    const i = get().taxInputs
    const grossIncome = i.annualIncome
    const businessExpenseDeduction = i.businessExpenses
    const adjustedGrossIncome = grossIncome - businessExpenseDeduction
    const standardDeduction = i.filingStatus === "single" ? 14600 : i.filingStatus === "married" ? 29200 : 21900
    const retirementDeduction = Math.min(i.retirementContributions, 23000)
    const healthDeduction = i.healthInsurance
    const totalDeductions = standardDeduction + retirementDeduction + healthDeduction
    const taxableIncome = Math.max(0, adjustedGrossIncome - totalDeductions)

    // 2024-2025 US federal tax brackets (simplified)
    let federalTax = 0
    if (i.filingStatus === "single") {
      if (taxableIncome > 578125) federalTax = 174238.75 + (taxableIncome - 578125) * 0.37
      else if (taxableIncome > 231250) federalTax = 52832 + (taxableIncome - 231250) * 0.35
      else if (taxableIncome > 182100) federalTax = 37104 + (taxableIncome - 182100) * 0.32
      else if (taxableIncome > 95375) federalTax = 16290 + (taxableIncome - 95375) * 0.24
      else if (taxableIncome > 44725) federalTax = 5147 + (taxableIncome - 44725) * 0.22
      else if (taxableIncome > 11600) federalTax = 1160 + (taxableIncome - 11600) * 0.12
      else federalTax = taxableIncome * 0.10
    } else if (i.filingStatus === "married") {
      if (taxableIncome > 693750) federalTax = 209096.25 + (taxableIncome - 693750) * 0.37
      else if (taxableIncome > 462500) federalTax = 106952 + (taxableIncome - 462500) * 0.35
      else if (taxableIncome > 364200) federalTax = 74208 + (taxableIncome - 364200) * 0.32
      else if (taxableIncome > 190750) federalTax = 32580 + (taxableIncome - 190750) * 0.24
      else if (taxableIncome > 89450) federalTax = 10294 + (taxableIncome - 89450) * 0.22
      else if (taxableIncome > 23200) federalTax = 2320 + (taxableIncome - 23200) * 0.12
      else federalTax = taxableIncome * 0.10
    } else {
      if (taxableIncome > 578100) federalTax = 174228.75 + (taxableIncome - 578100) * 0.37
      else if (taxableIncome > 231250) federalTax = 52832 + (taxableIncome - 231250) * 0.35
      else if (taxableIncome > 182100) federalTax = 37104 + (taxableIncome - 182100) * 0.32
      else if (taxableIncome > 95375) federalTax = 16290 + (taxableIncome - 95375) * 0.24
      else if (taxableIncome > 44725) federalTax = 5147 + (taxableIncome - 44725) * 0.22
      else if (taxableIncome > 11600) federalTax = 1160 + (taxableIncome - 11600) * 0.12
      else federalTax = taxableIncome * 0.10
    }

    const selfEmploymentTax = grossIncome * 0.153 * 0.9235
    const totalTax = federalTax + selfEmploymentTax
    const effectiveTaxRate = totalTax / grossIncome
    const monthlySetAside = totalTax / 12

    set({
      taxOutputs: {
        grossIncome: Math.round(grossIncome * 100) / 100,
        businessExpenseDeduction: Math.round(businessExpenseDeduction * 100) / 100,
        adjustedGrossIncome: Math.round(adjustedGrossIncome * 100) / 100,
        standardDeduction,
        taxableIncome: Math.round(taxableIncome * 100) / 100,
        estimatedFederalTax: Math.round(federalTax * 100) / 100,
        selfEmploymentTax: Math.round(selfEmploymentTax * 100) / 100,
        totalTax: Math.round(totalTax * 100) / 100,
        effectiveTaxRate: Math.round(effectiveTaxRate * 10000) / 100,
        monthlySetAside: Math.round(monthlySetAside * 100) / 100,
      },
    })
  },
}))
