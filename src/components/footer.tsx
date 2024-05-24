import { TaxGraph } from "@/components/tax-graph";
import { CardFooter } from "@/components/ui/card";
import { TaxDetails } from "@/lib/tax-calculation-helper";
import { numberToJpy } from "@/lib/utils";

type FooterProps = {
  calculatedResult: Record<string, number | null | undefined>;
  calculatedTaxResult: Record<string, number | null | undefined>;
  taxDetails: TaxDetails;
};

export const Footer = ({
  calculatedResult,
  calculatedTaxResult,
  taxDetails
}: FooterProps) => (
  <CardFooter className="flex w-full flex-col space-y-6">
    <div className="flex w-full flex-col space-y-6 pt-6 md:flex-row md:items-end md:space-x-10 md:space-y-0">
      <div className="w-40 shrink-0 md:relative">
        <img
          src="/tax-accountant-2.svg"
          alt="Crypto Tax Accountant"
          className="bottom-2 right-0 w-40 md:absolute"
        />
      </div>
      <div className="w-full space-y-4 divide-y-2">
        <div className="space-y-2 divide-y opacity-70">
          {Object.entries(calculatedResult).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span>{key}</span>
              <span className="mx-2 inline-block font-semibold text-orange-500">
                {value ? (
                  numberToJpy(value)
                ) : (
                  <span className="blur">0000000</span>
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-2 divide-y pt-4">
          {Object.entries(calculatedTaxResult).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span>{key}</span>
              <span className="mx-2 inline-block font-semibold text-orange-500">
                {value ? (
                  numberToJpy(value)
                ) : (
                  <span className="blur">000000</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <TaxGraph taxDetails={taxDetails} />
  </CardFooter>
);
