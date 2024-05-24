"use client";

import { useState } from "react";

import { SimpleSimulation } from "@/app/simple-simulation/simple-simulation";
import { TaxSimulationResult } from "@/app/simple-simulation/tax-simulation-result";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
      <Dialog>
        <SimpleSimulation
          setSalaryIncome={setSalaryIncome}
          setCryptoProfit={setCryptoProfit}
          triggerButton={
            <DialogTrigger asChild>
              <Button
                className="w-[200px] rounded-lg bg-blue-400 p-2 hover:bg-blue-700 active:bg-blue-700"
                onClick={calculate}
              >
                計算する
              </Button>
            </DialogTrigger>
          }
        />
        <DialogContent className="max-h-[80%] overflow-scroll">
          <TaxSimulationResult
            taxAmount={taxDetails.taxAmount}
            totalIncome={state.salaryIncome + state.cryptoProfit}
            basicDeduction={basicDeduction}
            salaryDeduction={salaryDeduction}
            taxableIncome={taxDetails.taxableIncome}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
