import { useState, useEffect } from "react";

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

import type { Dependent, TaxedBracket } from "@/lib/tax-calculation";

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

  // results during the process
  const [salaryDeduction, setSalaryDeduction] = useState(0);
  const [netIncome, setNetIncome] = useState(0);
  const [basicDeduction, setBasicDeduction] = useState(0);
  const [spouseSpecialDeduction, setSpouseSpecialDeduction] = useState(0);
  const [dependentDeduction, setDependentDeduction] = useState(0);

  useEffect(() => {
    setSalaryDeduction(calculateSalaryDeduction(state.salaryIncome));
  }, [state.salaryIncome]);

  useEffect(() => {
    setNetIncome(calculateNetIncome(state.salaryIncome));
  }, [state.salaryIncome]);

  useEffect(() => {
    setBasicDeduction(calculateBasicDeduction(netIncome));
  }, [netIncome]);

  useEffect(() => {
    const totalIncome = calculateTotalIncome(netIncome, state.cryptoProfit);
    setBasicDeduction(calculateBasicDeduction(totalIncome));
    setSpouseSpecialDeduction(
      calculateSpouseSpecialDeduction(totalIncome, state.spouseIncome)
    );
  }, [netIncome, state.cryptoProfit, state.spouseIncome]);

  useEffect(() => {
    setDependentDeduction(calculateDependentDeduction(state.dependents));
  }, [state.dependents]);

  // calculation

  const [taxBrackets, setTaxBrackets] = useState<TaxedBracket[]>([]);

  useEffect(() => {
    const calculateTaxableIncome = () => {
      const netIncome = calculateNetIncome(state.salaryIncome);
      const totalIncome = calculateTotalIncome(netIncome, state.cryptoProfit);

      const basicDeduction = calculateBasicDeduction(totalIncome);
      const dependentDeduction = calculateDependentDeduction(state.dependents);
      const spouseSpecialDeduction = calculateSpouseSpecialDeduction(
        totalIncome,
        state.spouseIncome
      );
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

      const totalDeductions =
        state.socialInsurance +
        basicDeduction +
        spouseSpecialDeduction +
        dependentDeduction +
        // socialInsuranceDeduction +
        // premiumPension +
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
    setTaxBrackets(taxBrackets);
  }, [
    state.cohabitingSpecialDisabilityCount,
    state.cryptoProfit,
    state.dependents,
    state.donation,
    state.earthquakeInsuranceDeduction,
    state.generalDisabilityCount,
    state.hasWidow,
    state.housingLoanDeduction,
    state.isSingleParent,
    state.lifeInsuranceDeduction,
    state.salaryIncome,
    state.socialInsurance,
    state.specialDisabilityCount,
    state.spouseIncome,
    state.medicalExpensesDeduction
  ]);

  return {
    state,
    updateState,
    salaryDeduction,
    basicDeduction,
    spouseSpecialDeduction,
    dependentDeduction,
    taxBrackets
  };
};
