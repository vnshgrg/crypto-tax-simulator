import { describe, it, expect } from "@jest/globals";

import {
  calculateSpouseSpecialDeduction,
  isBetweenSlab
} from "@/lib/spouse-special-deduction";

describe("isBetween function to check between slabs", () => {
  const slab = { min: 100, max: 200 };

  it("should return true if number is between min and max", () => {
    const result = isBetweenSlab(150, slab);
    expect(result).toBe(true);
  });

  it("should return false for number less than min", () => {
    expect(isBetweenSlab(99, slab)).toBe(false);
  });

  it("should return false for number greater than max", () => {
    expect(isBetweenSlab(201, slab)).toBe(false);
  });

  it("should return true for number equal to min", () => {
    expect(isBetweenSlab(100, slab)).toBe(true);
  });

  it("should return false for number equal to max", () => {
    expect(isBetweenSlab(200, slab)).toBe(false);
  });
});

describe("Spouse special deduction for fixed taxpayer income of 6_000_000", () => {
  it("No spouse income", () => {
    const taxpayerIncome = 6_000_000;
    const spouseIncome = 0;
    const result = calculateSpouseSpecialDeduction(
      taxpayerIncome,
      spouseIncome
    );
    expect(result).toBe(0);
  });

  it("Spouse income less than 1_030_000", () => {
    const taxpayerIncome = 6_000_000;
    const spouseIncome = 0;
    const result = calculateSpouseSpecialDeduction(
      taxpayerIncome,
      spouseIncome
    );
    expect(result).toBe(0);
  });

  it("Spouse income 1_030_000", () => {
    const taxpayerIncome = 6_000_000;
    const spouseIncome = 1_030_000;
    const result = calculateSpouseSpecialDeduction(
      taxpayerIncome,
      spouseIncome
    );
    expect(result).toBe(380_000);
  });

  it("Spouse income 1_260_000", () => {
    const taxpayerIncome = 6_000_000;
    const spouseIncome = 1_260_000;
    const result = calculateSpouseSpecialDeduction(
      taxpayerIncome,
      spouseIncome
    );
    expect(result).toBe(160_000);
  });

  it("Spouse income is 1_500_000", () => {
    const taxpayerIncome = 6_000_000;
    const spouseIncome = 1_500_000;
    const result = calculateSpouseSpecialDeduction(
      taxpayerIncome,
      spouseIncome
    );
    expect(result).toBe(0);
  });

  it("Spouse income more than 1_500_000", () => {
    const taxpayerIncome = 6_000_000;
    const spouseIncome = 1_500_001;
    const result = calculateSpouseSpecialDeduction(
      taxpayerIncome,
      spouseIncome
    );
    expect(result).toBe(0);
  });
});

describe("Spouse special deduction for fixed spouse income of 1_300_000", () => {
  it("Taxpayer income less than 9_000_000", () => {
    const taxpayerIncome = 8_000_000;
    const spouseIncome = 1_300_000;
    const result = calculateSpouseSpecialDeduction(
      taxpayerIncome,
      spouseIncome
    );
    expect(result).toBe(110_000);
  });

  it("Taxpayer income equal 9_000_000", () => {
    const taxpayerIncome = 9_000_000;
    const spouseIncome = 1_300_000;
    const result = calculateSpouseSpecialDeduction(
      taxpayerIncome,
      spouseIncome
    );
    expect(result).toBe(80_000);
  });

  it("Taxpayer income more than 9_000_000 but less than 9_500_000", () => {
    const taxpayerIncome = 9_250_000;
    const spouseIncome = 1_300_000;
    const result = calculateSpouseSpecialDeduction(
      taxpayerIncome,
      spouseIncome
    );
    expect(result).toBe(80_000);
  });

  it("Taxpayer income equal to 9_500_000", () => {
    const taxpayerIncome = 9_500_000;
    const spouseIncome = 1_300_000;
    const result = calculateSpouseSpecialDeduction(
      taxpayerIncome,
      spouseIncome
    );
    expect(result).toBe(20000);
  });

  it("Taxpayer income more than 9_500_000 but less than 10_000_000", () => {
    const taxpayerIncome = 9_750_000;
    const spouseIncome = 1_300_000;
    const result = calculateSpouseSpecialDeduction(
      taxpayerIncome,
      spouseIncome
    );
    expect(result).toBe(20_000);
  });

  it("Taxpayer income equal to 10_000_000", () => {
    const taxpayerIncome = 10_000_000;
    const spouseIncome = 1_300_000;
    const result = calculateSpouseSpecialDeduction(
      taxpayerIncome,
      spouseIncome
    );
    expect(result).toBe(0);
  });

  it("Taxpayer income more than 10_000_000", () => {
    const taxpayerIncome = 10_000_001;
    const spouseIncome = 1_300_000;
    const result = calculateSpouseSpecialDeduction(
      taxpayerIncome,
      spouseIncome
    );
    expect(result).toBe(0);
  });
});
