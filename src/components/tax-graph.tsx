import {
  TAX_BRACKETS,
  TaxBracket,
  TaxDetails,
  TaxedBracket
} from "@/lib/tax-calculation-helper";
import { cn, numberToMan } from "@/lib/utils";

export const TaxGraph = ({
  taxDetails: { taxBrackets }
}: {
  taxDetails: TaxDetails;
}) => {
  if (taxBrackets.length === 0) return null;
  return (
    <div className="w-full">
      <div className="grid h-56 grid-cols-7 divide-x overflow-hidden rounded-lg border md:h-40">
        {TAX_BRACKETS.map(({ rate, upperLimit }, index) => (
          <div
            key={index}
            className="flex h-56 flex-col text-center text-sm md:h-40"
          >
            <div className="size-full">
              <TaxGraphBracket
                usersTaxbracket={taxBrackets[index]}
                applicableTaxBracket={TAX_BRACKETS[index]}
                previousTaxBracket={TAX_BRACKETS[index - 1]}
              />
            </div>
            <div className="w-full border-t py-2">
              <div className="text-xs sm:text-sm">{rate * 100}%</div>
              <div className="h-12 text-xs text-slate-400 md:h-5">
                {numberToMan(upperLimit) !== "∞円"
                  ? numberToMan(upperLimit)
                  : `${numberToMan(40_000_000)}以上`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TOTAL_AREA = 0.45;

const TaxGraphBracket = ({
  applicableTaxBracket,
  previousTaxBracket,
  usersTaxbracket
}: {
  applicableTaxBracket: TaxBracket;
  previousTaxBracket: TaxBracket | undefined;
  usersTaxbracket: TaxedBracket | undefined;
}) => {
  const userTaxBracketExists = !!usersTaxbracket;

  const taxedAmount = userTaxBracketExists ? usersTaxbracket.taxedAmount : 0;

  const applicableTaxBracketHeight =
    Math.round(applicableTaxBracket.rate * TOTAL_AREA * 100) * 5;

  const previousTaxBracketUpperLimit = previousTaxBracket
    ? previousTaxBracket.upperLimit
    : 0;

  const taxPaidPercentage = Math.round(
    (taxedAmount /
      (applicableTaxBracket.upperLimit - previousTaxBracketUpperLimit)) *
      100
  );
  return (
    <div className="relative flex h-full flex-col justify-center pb-2">
      <div className="z-20 text-xs sm:text-sm">
        {userTaxBracketExists && numberToMan(usersTaxbracket.taxAmount)}
      </div>
      <div
        style={{ height: `${applicableTaxBracketHeight}%` }}
        className={cn([
          "absolute bottom-0 left-0 right-0 z-0 w-full bg-slate-100"
        ])}
      >
        <div className="relative size-full">
          <div
            style={{ height: `${taxPaidPercentage}%` }}
            className={cn([
              "absolute bottom-0 left-0 right-0 z-0 w-full bg-blue-200"
            ])}
          ></div>
        </div>
      </div>
    </div>
  );
};
