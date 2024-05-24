import { useState } from "react";

import { calculateSpouseSpecialDeduction } from "@/lib/spouse-special-deduction";
import {
  calculateSalaryDeduction,
  calculateNetIncome,
  calculateTotalIncome,
  calculateBasicDeduction,
  calculateDependentDeduction,
  calculateDisabilityDeduction,
  calculateWidowDeduction,
  calculateSingleParentDeduction,
  calculateDonationDeduction,
  calculateIncomeTax
} from "@/lib/tax-calculation";

import type { Dependent } from "@/lib/tax-calculation";

const initialState = {
  salaryIncome: 0,
  cryptoProfit: 0,

  hasSpouse: false,
  spouseIncome: 0,
  hasWidow: false,
  isSingleParent: false,
  generalDisabilityCount: 0,
  specialDisabilityCount: 0,
  cohabitingSpecialDisabilityCount: 0,
  dependents: [],

  socialInsurance: 0,
  lifeInsuranceDeduction: 0,
  medicalExpensesDeduction: 0,
  premiumPension: 0,
  earthquakeInsuranceDeduction: 0,
  housingLoanDeduction: 0,
  donation: 0
};

export type TaxCalculationState = Omit<typeof initialState, "dependents"> & {
  dependents: Dependent[];
};

export type SetState = (
  key: keyof TaxCalculationState,
  value: number | boolean
) => void;

export const useTaxCalculation = () => {
  const [state, setState] = useState<TaxCalculationState>(initialState);

  const updateState: SetState = (key, value) => {
    setState((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const salaryDeduction = calculateSalaryDeduction(state.salaryIncome);
  const netIncome = calculateNetIncome(state.salaryIncome);
  const totalIncome = calculateTotalIncome(netIncome, state.cryptoProfit);
  const basicDeduction = calculateBasicDeduction(netIncome);
  const spouseSpecialDeduction = calculateSpouseSpecialDeduction(
    totalIncome,
    state.spouseIncome
  );
  const dependentDeduction = calculateDependentDeduction(state.dependents);
  const disabilityDeduction = calculateDisabilityDeduction(
    state.generalDisabilityCount,
    state.specialDisabilityCount,
    state.cohabitingSpecialDisabilityCount
  );
  const widowDeduction = calculateWidowDeduction(state.hasWidow);
  const singleParentDeduction = calculateSingleParentDeduction(
    state.isSingleParent
  );
  const donationDeduction = calculateDonationDeduction(state.donation);

  const calculateTaxableIncome = () => {
    const totalDeductions =
      state.socialInsurance +
      basicDeduction +
      spouseSpecialDeduction +
      dependentDeduction +
      // socialInsuranceDeduction +
      state.premiumPension +
      state.lifeInsuranceDeduction +
      state.earthquakeInsuranceDeduction +
      state.housingLoanDeduction +
      state.medicalExpensesDeduction +
      donationDeduction +
      disabilityDeduction +
      widowDeduction +
      singleParentDeduction;

    return Math.max(0, totalIncome - totalDeductions);
  };

  const taxableIncome = calculateTaxableIncome();
  const taxBrackets = calculateIncomeTax(taxableIncome);
  const [taxedAmount, taxAmount] = taxBrackets.reduce(
    ([taxedAmount, taxAmount], bracket) => [
      taxedAmount + bracket.taxedAmount,
      taxAmount + bracket.taxAmount
    ],
    [0, 0]
  );

  const result = {
    salaryDeduction,
    basicDeduction,
    spouseSpecialDeduction,
    dependentDeduction,
    taxBrackets,
    taxedAmount,
    taxAmount
  };

  return {
    state,
    updateState,
    result
  };
};
