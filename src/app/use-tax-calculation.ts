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
  calculateDeductionLimitForFurusatoTaxPayment,
  calculateIncomeTax
} from "@/lib/tax-calculation";

import type { DependentCountsByGroup } from "@/lib/tax-calculation";

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
  dependents: {},

  socialInsurance: 0,
  lifeInsuranceDeduction: 0,
  medicalExpensesDeduction: 0,
  premiumPension: 0,
  earthquakeInsuranceDeduction: 0,
  housingLoanDeduction: 0,
  donation: 0
};

export type TaxCalculationState = Omit<typeof initialState, "dependents">;

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
  const spouseSpecialDeductionWithoutCrytoProfit =
    calculateSpouseSpecialDeduction(netIncome, state.spouseIncome);
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

  const calculateTaxableIncome = (
    spouseSpecialDeduction: number,
    totalIncome: number
  ) => {
    const totalDeductions =
      state.socialInsurance +
      basicDeduction +
      spouseSpecialDeduction +
      dependentDeduction +
      state.premiumPension +
      state.lifeInsuranceDeduction +
      state.earthquakeInsuranceDeduction +
      state.housingLoanDeduction +
      state.medicalExpensesDeduction +
      state.donation +
      disabilityDeduction +
      widowDeduction +
      singleParentDeduction;

    return Math.max(0, totalIncome - totalDeductions);
  };

  const calculateTaxDetails = (
    spouseSpecialDeduction: number,
    totalIncome: number
  ) => {
    const taxableIncome = calculateTaxableIncome(
      spouseSpecialDeduction,
      totalIncome
    );
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

  const taxDetails = calculateTaxDetails(spouseSpecialDeduction, totalIncome);
  const taxDetailsWithoutCryptoProfit = calculateTaxDetails(
    spouseSpecialDeductionWithoutCrytoProfit,
    netIncome
  );

  const donationDeduction = calculateDeductionLimitForFurusatoTaxPayment(
    taxDetails.taxableIncome - state.donation
  );

  const result = {
    salaryDeduction,
    basicDeduction,
    spouseSpecialDeduction,
    dependentDeduction,
    donationDeduction,
    taxDetails,
    taxDetailsWithoutCryptoProfit
  };

  return {
    state,
    updateState,
    result
  };
};
