import { TaxCalculationState } from "@/lib/hooks/use-tax-calculation";

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

// 扶養控除
const GENERAL_DEDUCTION = 380_000;
const SPECIFIC_DEDUCTION = 630_000;
const ELDERLY_DEDUCTION_CORESIDING = 580_000;
const ELDERLY_DEDUCTION_NON_CORESIDING = 480_000;

export type DependentCountsByGroup = {
  under15: number;
  from16to18: number;
  from19to22: number;
  from23to69: number;
  over70Coresiding: number;
  over70Other: number;
};

export function calculateDependentDeduction(
  dependents: DependentCountsByGroup
): number {
  let totalDeduction = 0;

  for (const [key, value] of Object.entries(dependents)) {
    if (key === "under15") {
      totalDeduction += 0;
    } else if (key === "from16to18" || key === "from23to69") {
      totalDeduction += value * GENERAL_DEDUCTION;
    } else if (key === "from19to22") {
      totalDeduction += value * SPECIFIC_DEDUCTION;
    } else if (key === "over70Coresiding") {
      totalDeduction += value * ELDERLY_DEDUCTION_CORESIDING;
    } else if (key === "over70Other") {
      totalDeduction += value * ELDERLY_DEDUCTION_NON_CORESIDING;
    }
  }
  return totalDeduction;
}

// 寄附金控除(ふるさと納税)
export function calculateDeductionLimitForFurusatoTaxPayment(
  taxableIncomeWithoutFurusatoDonation: number
): number {
  const marginalIncomeTaxRate = calculateMarginalIncomeTaxRate(
    taxableIncomeWithoutFurusatoDonation
  );

  const deductionLimitForFurusatoTaxPayment =
    (taxableIncomeWithoutFurusatoDonation * 0.1 * 0.2) /
      (0.9 - marginalIncomeTaxRate * 1.021) +
    2000;

  // Fractions less than one thousand yen are rounded down
  return Math.floor(deductionLimitForFurusatoTaxPayment / 1000) * 1000;
}

// 所得税の限界税率
function calculateMarginalIncomeTaxRate(taxableIncome: number): number {
  for (let i = 1; i < TAX_BRACKETS.length; i++) {
    if (taxableIncome < TAX_BRACKETS[i - 1].upperLimit) {
      return TAX_BRACKETS[i - 1].rate;
    }
    if (taxableIncome <= TAX_BRACKETS[i].upperLimit) {
      return TAX_BRACKETS[i].rate;
    }
  }
  return 0;
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

export type TaxedBracket = {
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

const calculateTaxableIncome = ({
  state,
  income,
  deductions: {
    spouseSpecialDeduction,
    basicDeduction,
    dependentDeduction,
    disabilityDeduction,
    widowDeduction,
    singleParentDeduction
  }
}: CalculateTaxDetails) => {
  const totalDeductions =
    state.socialInsurance +
    state.premiumPension +
    state.lifeInsuranceDeduction +
    state.earthquakeInsuranceDeduction +
    state.housingLoanDeduction +
    state.medicalExpensesDeduction +
    state.donation +
    spouseSpecialDeduction +
    basicDeduction +
    dependentDeduction +
    disabilityDeduction +
    widowDeduction +
    singleParentDeduction;

  return Math.max(0, income - totalDeductions);
};

type CalculateTaxDetails = {
  state: TaxCalculationState;
  income: number;
  deductions: {
    spouseSpecialDeduction: number;
    basicDeduction: number;
    dependentDeduction: number;
    disabilityDeduction: number;
    widowDeduction: number;
    singleParentDeduction: number;
  };
};

export const calculateTaxDetails = ({
  state,
  income,
  deductions
}: CalculateTaxDetails) => {
  const taxableIncome = calculateTaxableIncome({ state, deductions, income });
  const taxBrackets = calculateIncomeTax(taxableIncome);
  const [taxedAmount, taxAmount] = taxBrackets.reduce(
    ([taxedAmount, taxAmount], bracket) => [
      taxedAmount + bracket.taxedAmount,
      taxAmount + bracket.taxAmount
    ],
    [0, 0]
  );

  return { taxableIncome, taxBrackets, taxedAmount, taxAmount };
};

type FixedLengthArray<T, L extends number> = {
  0: T;
  length: L;
} & ReadonlyArray<T>;

export type IncomeSlab = {
  min: number;
  max: number;
};

type SpouseIncomeSlabData<K> = FixedLengthArray<K, 10>;

type SpouseSpecialDeduction = {
  taxpayerTotalIncomeSlab: IncomeSlab;
  spouseDeduction: Array<{ spouseIncomeSlab: IncomeSlab; deduction: number }>;
};

const ELIGIBLE_INCOME_THRESHOLD: Record<
  "taxpayerTotalIncome" | "spouseIncome",
  IncomeSlab
> = {
  taxpayerTotalIncome: {
    min: 0,
    max: 10_000_000
  },
  spouseIncome: {
    min: 1_030_000,
    max: 2_010_000
  }
};

const SPOUSE_INCOME_SLAB: SpouseIncomeSlabData<IncomeSlab> = [
  {
    min: 1_030_000,
    max: 1_050_000
  },
  {
    min: 1_050_000,
    max: 1_100_000
  },
  {
    min: 1_100_000,
    max: 1_150_000
  },
  {
    min: 1_150_000,
    max: 1_200_000
  },
  {
    min: 1_200_000,
    max: 1_250_000
  },
  {
    min: 1_250_000,
    max: 1_300_000
  },
  {
    min: 1_300_000,
    max: 1_350_000
  },
  {
    min: 1_350_000,
    max: 1_400_000
  },
  {
    min: 1_400_000,
    max: 1_500_000
  },
  {
    min: 1_500_000,
    max: 2_010_000
  }
];

// prettier-ignore
const FIRST_SLAB_DEDUCTION = [380_000, 360_000, 310_000, 260_000, 210_000, 160_000, 110_000, 60_000, 30_000, 0].map((deduction, index) => ({spouseIncomeSlab: SPOUSE_INCOME_SLAB[index], deduction}));
// prettier-ignore
const SECOND_SLAB_DEDUCTION = [260_000, 240_000, 210_000, 180_000, 140_000, 110_000, 80_000, 40_000, 20_000, 0].map((deduction, index) => ({spouseIncomeSlab: SPOUSE_INCOME_SLAB[index], deduction}));
// prettier-ignore
const THIRD_SLAB_DEDUCTION = [130_000, 120_000, 100_000, 80_000, 60_000, 40_000, 20_000, 10_000, 0, 0].map((deduction, index) => ({spouseIncomeSlab: SPOUSE_INCOME_SLAB[index], deduction}));

const SPOUSE_SPECIAL_DEDUCTION: SpouseSpecialDeduction[] = [
  {
    taxpayerTotalIncomeSlab: {
      min: 0,
      max: 9_000_000
    },
    spouseDeduction: FIRST_SLAB_DEDUCTION
  },
  {
    taxpayerTotalIncomeSlab: {
      min: 9_000_000,
      max: 9_500_000
    },
    spouseDeduction: SECOND_SLAB_DEDUCTION
  },
  {
    taxpayerTotalIncomeSlab: {
      min: 9_500_000,
      max: 10_000_000
    },
    spouseDeduction: THIRD_SLAB_DEDUCTION
  }
];

export function isBetweenSlab(value: number, slab: IncomeSlab): boolean {
  return value >= slab.min && value < slab.max;
}

export function calculateSpouseSpecialDeduction(
  taxpayerTotalIncome: number,
  spouseIncome: number
): number {
  // Both conditions should be true
  // prettier-ignore
  if (!isBetweenSlab(taxpayerTotalIncome, ELIGIBLE_INCOME_THRESHOLD.taxpayerTotalIncome)) return 0;
  // prettier-ignore
  if (!isBetweenSlab(spouseIncome, ELIGIBLE_INCOME_THRESHOLD.spouseIncome)) return 0;

  const spouseIncomeSlab = SPOUSE_SPECIAL_DEDUCTION.find(
    ({ taxpayerTotalIncomeSlab }) =>
      isBetweenSlab(taxpayerTotalIncome, taxpayerTotalIncomeSlab)
  );

  if (!spouseIncomeSlab) {
    throw new Error("Taxpayer income slab not found");
  }

  const deductionSlab = spouseIncomeSlab.spouseDeduction.find(
    ({ spouseIncomeSlab }) => isBetweenSlab(spouseIncome, spouseIncomeSlab)
  );

  if (!deductionSlab) {
    throw new Error("Spouse deduction slab not found");
  }

  return deductionSlab.deduction;
}
