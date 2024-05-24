import { Metadata } from "next";

import { SimpleSimulation } from "@/app/simple-simulation/simple-simulation";
import { TaxSimulationResult } from "@/app/simple-simulation/tax-simulation-result";

export const metadata: Metadata = {
  title: "簡単シミュレーション",
  description: "簡単シミュレーション"
};

export default function Page() {
  return (
    <main className="">
      <SimpleSimulation />
      <TaxSimulationResult />
    </main>
  );
}
