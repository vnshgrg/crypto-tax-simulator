import { useEffect, useState } from "react";

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
  calculateTaxDetails
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
  dependents: {
    under15: 0,
    from16to18: 0,
    from19to22: 0,
    from23to69: 0,
    over70Coresiding: 0,
    over70Other: 0
  },
  socialInsurance: 0,
  lifeInsuranceDeduction: 0,
  medicalExpensesDeduction: 0,
  premiumPension: 0,
  earthquakeInsuranceDeduction: 0,
  housingLoanDeduction: 0,
  donation: 0
};

export type TaxCalculationState = Omit<typeof initialState, "dependents"> & {
  dependents: DependentCountsByGroup;
};

export type SetState = (
  key: keyof TaxCalculationState,
  value: number | boolean | DependentCountsByGroup
) => void;

export const useTaxCalculation = () => {
  const [state, setState] = useState<TaxCalculationState>(initialState);

  // If no spouse, set spouseIncome to 0
  useEffect(() => {
    if (!state.hasSpouse) {
      updateState("spouseIncome", 0);
    }
  }, [state.hasSpouse]);

  const updateState: SetState = (key, value) => {
    setState((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const updateDependents = (
    key: keyof DependentCountsByGroup,
    value: number
  ) => {
    setState((prev) => ({
      ...prev,
      dependents: {
        ...prev.dependents,
        [key]: value
      }
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

  const deductions = {
    spouseSpecialDeduction,
    basicDeduction,
    dependentDeduction,
    disabilityDeduction,
    widowDeduction,
    singleParentDeduction
  };

  const taxDetails = calculateTaxDetails({
    state,
    income: totalIncome,
    deductions
  });

  const taxDetailsWithoutCryptoProfit = calculateTaxDetails({
    state,
    income: netIncome,
    deductions: {
      ...deductions,
      spouseSpecialDeduction: spouseSpecialDeductionWithoutCrytoProfit
    }
  });

  const donationDeduction = calculateDeductionLimitForFurusatoTaxPayment(
    taxDetails.taxableIncome - state.donation
  );

  // Deduction is applicable only when salary income is provided
  // So, we only show deductions if taxedAmount is greater than 0
  const IS_DEDUCTION_APPLICABLE = taxDetails.taxedAmount > 0;

  const result = {
    salaryDeduction: IS_DEDUCTION_APPLICABLE ? salaryDeduction : 0,
    basicDeduction: IS_DEDUCTION_APPLICABLE ? basicDeduction : 0,
    donationDeduction: IS_DEDUCTION_APPLICABLE ? donationDeduction : 0,
    spouseSpecialDeduction,
    dependentDeduction,
    taxDetails,
    taxDetailsWithoutCryptoProfit
  };

  return {
    state,
    updateState,
    updateDependents,
    result
  };
};
