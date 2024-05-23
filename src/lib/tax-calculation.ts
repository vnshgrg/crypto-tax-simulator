// 給与所得控除
export function calculateSalaryDeduction(income: number): number {
  if (income <= 1_625_000) {
    return 550_000;
  } else if (income <= 1_800_000) {
    return income * 0.4 - 100_000;
  } else if (income <= 3_600_000) {
    return income * 0.3 + 80_000;
  } else if (income <= 6_600_000) {
    return income * 0.2 + 440_000;
  } else if (income <= 8_500_000) {
    return income * 0.1 + 1_100_000;
  } else {
    return 1950000;
  }
}

// 給与所得
export function calculateNetIncome(income: number): number {
  // Fractions less than one thousand yen are rounded down
  const adjustedIncome = Math.floor(income / 4 / 1000) * 1000 * 4;
  const netIncome = adjustedIncome - calculateSalaryDeduction(adjustedIncome);
  return Math.floor(netIncome);
}

// 合計所得
export function calculateTotalIncome(
  salaryIncome: number,
  cryptoProfit: number
): number {
  return salaryIncome + cryptoProfit;
}

// 基本控除
export function calculateBasicDeduction(income: number): number {
  if (income <= 24_000_000) {
    return 480000;
  } else if (income <= 24_500_000) {
    return 320000;
  } else if (income <= 25_000_000) {
    return 160000;
  } else {
    return 0;
  }
}

// TODO: 配偶者控除
export function calculateSpouseDeduction(): number {
  return 0;
}

// 扶養控除
const GENERAL_DEDUCTION = 380_000;
const SPECIFIC_DEDUCTION = 630_000;
const ELDERLY_DEDUCTION_CORESIDING = 580_000;
const ELDERLY_DEDUCTION_NON_CORESIDING = 480_000;

interface Dependent {
  age: number;
  coresiding?: boolean;
  spouseIncome?: number;
}

export function calculateDependentDeduction(dependents: Dependent[]): number {
  let totalDeduction = 0;

  dependents.forEach((dependent) => {
    if (dependent.age <= 15) {
      // 15歳以下の扶養親族
      totalDeduction += 0;
    } else if (
      (dependent.age >= 16 && dependent.age <= 18) ||
      (dependent.age >= 23 &&
        dependent.age <= 69 &&
        (dependent.spouseIncome === undefined ||
          dependent.spouseIncome < 1_040_000))
    ) {
      // 一般の扶養控除対象 (16-18歳、23-69歳)
      totalDeduction += GENERAL_DEDUCTION;
    } else if (dependent.age >= 19 && dependent.age <= 22) {
      // 特定扶養控除対象 (19-22歳)
      totalDeduction += SPECIFIC_DEDUCTION;
    } else if (dependent.age >= 70) {
      // 老人扶養控除対象 (70歳以上)
      if (dependent.coresiding) {
        totalDeduction += ELDERLY_DEDUCTION_CORESIDING;
      } else {
        totalDeduction += ELDERLY_DEDUCTION_NON_CORESIDING;
      }
    }
  });

  return totalDeduction;
}

// TODO: 寄附金控除(ふるさと納税)
export function calculateDonationDeduction(donation: number): number {
  return donation;
}

// 障害者控除
const GENERAL_DISABILITY_DEDUCTION = 270_000;
const SPECIAL_DISABILITY_DEDUCTION = 400_000;
const COHABITING_SPECIAL_DISABILITY_DEDUCTION = 750_000;

export function calculateDisabilityDeduction(
  generalDisabilityCount: number,
  specialDisabilityCount: number,
  cohabitingSpecialDisabilityCount: number
): number {
  const generalDeduction =
    generalDisabilityCount * GENERAL_DISABILITY_DEDUCTION;
  const specialDeduction =
    specialDisabilityCount * SPECIAL_DISABILITY_DEDUCTION;
  const cohabitingSpecialDeduction =
    cohabitingSpecialDisabilityCount * COHABITING_SPECIAL_DISABILITY_DEDUCTION;

  return generalDeduction + specialDeduction + cohabitingSpecialDeduction;
}

// 寡婦控除
export function calculateWidowDeduction(isWidow: boolean): number {
  return isWidow ? 270_000 : 0;
}

// ひとり親控除
export function calculateSingleParentDeduction(
  isSingleParent: boolean
): number {
  return isSingleParent ? 350_000 : 0;
}

// TODO: 課税所得
export function calculateTaxableIncome(): number {
  return 0;
}

// 所得税の計算
const TAX_BRACKETS = [
  { upperLimit: 1_950_000, rate: 0.05 },
  { upperLimit: 3_300_000, rate: 0.1 },
  { upperLimit: 6_950_000, rate: 0.2 },
  { upperLimit: 9_000_000, rate: 0.23 },
  { upperLimit: 18_000_000, rate: 0.33 },
  { upperLimit: 40_000_000, rate: 0.4 },
  { upperLimit: Infinity, rate: 0.45 }
];

type TaxedBracket = {
  upperLimit: number;
  rate: number;
  taxedAmount: number;
  taxAmount: number;
};

export function calculateIncomeTax(taxableIncome: number): TaxedBracket[] {
  let remainingIncome = taxableIncome;
  let previousLimit = 0;
  const taxedBrackets: TaxedBracket[] = [];

  for (const bracket of TAX_BRACKETS) {
    if (remainingIncome <= 0) break;

    const incomeInThisBracket = Math.min(
      remainingIncome,
      bracket.upperLimit - previousLimit
    );
    const taxAmount = incomeInThisBracket * bracket.rate;

    taxedBrackets.push({
      upperLimit: bracket.upperLimit,
      rate: bracket.rate,
      taxedAmount: incomeInThisBracket,
      taxAmount: taxAmount
    });

    remainingIncome -= incomeInThisBracket;
    previousLimit = bracket.upperLimit;
  }

  return taxedBrackets;
}
