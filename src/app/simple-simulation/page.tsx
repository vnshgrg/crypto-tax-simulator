"use client";

import { SimpleSimulation } from "@/app/simple-simulation/simple-simulation";
import { TaxSimulationResult } from "@/app/simple-simulation/tax-simulation-result";
import { useTaxCalculation } from "@/lib/hooks/use-tax-calculation";

export default function Page() {
  const {
    state,
    updateState,
    result: { salaryDeduction, basicDeduction, taxDetails }
  } = useTaxCalculation();

  return (
    <main>
      <SimpleSimulation state={state} setState={updateState} />
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
