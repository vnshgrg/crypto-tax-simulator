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

const eligibleThreshold: Record<
  "taxpayerTotalIncome" | "spouseIncome",
  IncomeSlab
> = {
  taxpayerTotalIncome: {
    min: 0,
    max: 1_000_0000
  },
  spouseIncome: {
    min: 103_0000,
    max: 201_0000
  }
};

const spouseIncomeSlab: SpouseIncomeSlabData<IncomeSlab> = [
  {
    min: 103_0000,
    max: 105_0000
  },
  {
    min: 105_0000,
    max: 110_0000
  },
  {
    min: 110_0000,
    max: 115_0000
  },
  {
    min: 115_0000,
    max: 120_0000
  },
  {
    min: 120_0000,
    max: 125_0000
  },
  {
    min: 125_0000,
    max: 130_0000
  },
  {
    min: 130_0000,
    max: 135_0000
  },
  {
    min: 135_0000,
    max: 140_0000
  },
  {
    min: 140_0000,
    max: 150_0000
  },
  {
    min: 150_0000,
    max: 201_0000
  }
];

// prettier-ignore
const firstSlabDeduction: SpouseIncomeSlabData<number> = [380_000, 360_000, 310_000, 260_000, 210_000, 160_000, 110_000, 60_000, 30_000, 0];
// prettier-ignore
const secondSlabDeduction: SpouseIncomeSlabData<number> = [260_000, 240_000, 210_000, 180_000, 140_000, 110_000, 80_000, 40_000, 20_000, 0];
// prettier-ignore
const thirdSlabDeduction: SpouseIncomeSlabData<number> = [130_000, 120_000, 100_000, 80_000, 60_000, 40_000, 20_000, 10_000, 0, 0];

const spouseSpecialDeduction: SpouseSpecialDeduction[] = [
  {
    taxpayerTotalIncomeSlab: {
      min: 0,
      max: 900_0000
    },
    spouseDeduction: spouseIncomeSlab.map((slab, index) => ({
      spouseIncomeSlab: slab,
      deduction: firstSlabDeduction[index]
    }))
  },
  {
    taxpayerTotalIncomeSlab: {
      min: 900_0000,
      max: 950_0000
    },
    spouseDeduction: spouseIncomeSlab.map((slab, index) => ({
      spouseIncomeSlab: slab,
      deduction: secondSlabDeduction[index]
    }))
  },
  {
    taxpayerTotalIncomeSlab: {
      min: 950_0000,
      max: 1_000_0000
    },
    spouseDeduction: spouseIncomeSlab.map((slab, index) => ({
      spouseIncomeSlab: slab,
      deduction: thirdSlabDeduction[index]
    }))
  }
];

function isBetweenSlab(value: number, slab: IncomeSlab): boolean {
  return value > slab.min && value <= slab.max;
}

export function calculateSpouseSpecialDeduction(
  taxpayerTotalIncome: number,
  spouseIncome: number
): number {
  // Both conditions should be true
  // prettier-ignore
  if (!isBetweenSlab(taxpayerTotalIncome, eligibleThreshold.taxpayerTotalIncome)) return 0;
  if (!isBetweenSlab(spouseIncome, eligibleThreshold.spouseIncome)) return 0;

  const spouseIncomeSlab = spouseSpecialDeduction.find(
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
