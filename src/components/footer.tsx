import { CardFooter } from "@/components/ui/card";
import { numberToJpy } from "@/lib/utils";

type FooterProps = {
  calculatedResult: Record<string, number>;
  calculatedTaxResult: Record<string, number>;
};

export const Footer = ({
  calculatedResult,
  calculatedTaxResult
}: FooterProps) => (
  <CardFooter className="items-end space-x-6 pt-6 md:space-x-10">
    <div className="relative w-40 shrink-0">
      <img
        src="/tax-accountant-2.svg"
        alt="Crypto Tax Accountant"
        className="absolute bottom-2 right-0 w-40"
      />
    </div>
    <div className="w-full space-y-4 divide-y-2">
      <div className="space-y-2 divide-y opacity-70">
        {Object.entries(calculatedResult).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-2">
            <span>{key}</span>
            <span className="mx-2 inline-block font-semibold text-orange-500">
              {numberToJpy(value)}
            </span>
          </div>
        ))}
      </div>
      <div className="space-y-2 divide-y pt-4">
        {Object.entries(calculatedTaxResult).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-2">
            <span>{key}</span>
            <span className="mx-2 inline-block font-semibold text-orange-500">
              {numberToJpy(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  </CardFooter>
);
