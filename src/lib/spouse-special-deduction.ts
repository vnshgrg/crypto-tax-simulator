import { FixedLengthArray } from "@/lib/types";

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
