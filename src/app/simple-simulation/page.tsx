"use client";

import { useState } from "react";

import { SimpleSimulation } from "@/app/simple-simulation/simple-simulation";
import { TaxSimulationResult } from "@/app/simple-simulation/tax-simulation-result";
import { useTaxCalculation } from "@/lib/hooks/use-tax-calculation";

export default function Page() {
  const {
    state,
    updateState,
    result: { salaryDeduction, basicDeduction, taxDetails }
  } = useTaxCalculation();
  const [salaryIncome, setSalaryIncome] = useState(0);
  const [cryptoProfit, setCryptoProfit] = useState(0);
  const calculate = () => {
    updateState("salaryIncome", salaryIncome);
    updateState("cryptoProfit", cryptoProfit);
  };

  return (
    <main>
      <SimpleSimulation
        setSalaryIncome={setSalaryIncome}
        setCryptoProfit={setCryptoProfit}
        onClick={calculate}
      />
      <TaxSimulationResult
        taxAmount={taxDetails.taxAmount}
        totalIncome={state.salaryIncome + state.cryptoProfit}
        basicDeduction={basicDeduction}
        salaryDeduction={salaryDeduction}
        taxableIncome={taxDetails.taxableIncome}
      />
    </main>
  );
}
