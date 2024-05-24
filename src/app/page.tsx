"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { Question } from "@/components/question";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { YesNo } from "@/components/yes-no";
import {
  SetState,
  TaxCalculationState,
  useTaxCalculation
} from "@/lib/hooks/use-tax-calculation";
import { DependentCountsByGroup } from "@/lib/tax-calculation-helper";

export default function Home() {
  const {
    state,
    updateState,
    updateDependents,
    result: {
      salaryDeduction,
      basicDeduction,
      spouseSpecialDeduction,
      dependentDeduction,
      donationDeduction,
      taxDetails,
      taxDetailsWithoutCryptoProfit
    }
  } = useTaxCalculation();

  const taxAmount = taxDetails.taxAmount;
  const taxAmountWithoutCryptoProfit = taxDetailsWithoutCryptoProfit.taxAmount;
  const cryptoProfitTaxAmount = taxAmount - taxAmountWithoutCryptoProfit;

  const calculatedResult: Record<string, number> = {
    給与所得控除: salaryDeduction,
    基礎控除: basicDeduction,
    "配偶者控除/配偶者特別控除": spouseSpecialDeduction,
    扶養控除: dependentDeduction
  };

  const calculatedTaxResult: Record<string, number> = {
    "あなたの税金(概算)は": taxAmount,
    給与所得に係る税金は: taxAmountWithoutCryptoProfit,
    仮想通貨所得に係る税金は: cryptoProfitTaxAmount,
    ふるさと納税の限度額は: donationDeduction
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <Card className="w-full max-w-2xl">
        <Header />
        <CardContent className="border-y border-slate-200 bg-slate-50/40 pt-6">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className={styles.accordionTrigger}>
                <h3>1. 所得金額を入力してください</h3>
              </AccordionTrigger>
              <AccordionContent className={styles.accordionSection}>
                <SectionOne state={state} setState={updateState} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className={styles.accordionTrigger}>
                <h3>2. 家族について教えてください</h3>
              </AccordionTrigger>
              <AccordionContent className={styles.accordionSection}>
                <SectionTwo
                  state={state}
                  setState={updateState}
                  setDependents={updateDependents}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-none">
              <AccordionTrigger className={styles.accordionTrigger}>
                <h3>3. 所得控除を入力してください</h3>
              </AccordionTrigger>
              <AccordionContent className={styles.accordionSection}>
                <SectionThree state={state} setState={updateState} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <Footer
          calculatedResult={calculatedResult}
          calculatedTaxResult={calculatedTaxResult}
          taxDetails={taxDetails}
        />
      </Card>
    </main>
  );
}

const styles: Record<string, string> = {
  accordionTrigger:
    "font-semibold text-gray-500 hover:no-underline hover:text-gray-700 data-[state=open]:text-gray-800",
  accordionSection: "md:pl-4",
  sectionContainer: "space-y-5 md:space-y-4"
};

export type SectionProps = {
  state: TaxCalculationState;
  setState: SetState;
};

export type SetDependents = {
  setDependents: (key: keyof DependentCountsByGroup, value: number) => void;
};

const SectionOne = ({ setState }: SectionProps) => {
  return (
    <div className={styles.sectionContainer}>
      <Question
        title="給与収入"
        help="源泉徴収票の「支払金額」を記入してください。"
      >
        <Input
          type="number"
          min="0"
          suffix="円"
          placeholder="給与収入"
          onChange={(e) => setState("salaryIncome", Number(e.target.value))}
        />
      </Question>
      <Question
        title="仮想通貨の利益"
        help="総平均法で計算した実現損益を入力してください。"
      >
        <Input
          type="number"
          min="0"
          suffix="円"
          placeholder="仮想通貨の利益"
          onChange={(e) => setState("cryptoProfit", Number(e.target.value))}
        />
      </Question>
    </div>
  );
};

const SectionTwo = ({
  state,
  setState,
  setDependents
}: SectionProps & SetDependents) => {
  return (
    <div className={styles.sectionContainer}>
      <Question title="配偶者の有無" help="配偶者の有無を選択してください。">
        <YesNo
          name="001"
          value={state.hasSpouse}
          onChange={(value) => setState("hasSpouse", value)}
        />
      </Question>
      {state.hasSpouse && (
        <Question
          title="配偶者の給与収入"
          help="配偶者の給与収入に基づき、配偶者控除の判定をします。配偶者の給与収入がない方は「0」と記載するか空欄のままにしてください。"
        >
          <Input
            type="number"
            min="0"
            suffix="円"
            placeholder="配偶者の給与収入"
            onChange={(e) => setState("spouseIncome", Number(e.target.value))}
          />
        </Question>
      )}
      <Question
        title="寡婦に該当しますか？"
        help="寡婦控除の対象となる人の範囲はこちらで確認ください。"
      >
        <YesNo
          name="002"
          value={state.hasWidow}
          onChange={(value) => setState("hasWidow", value)}
        />
      </Question>
      <Question
        title="ひとり親に該当しますか？"
        help="ひとり親控除の対象となる人の範囲はこちらで確認ください。"
      >
        <YesNo
          name="003"
          value={state.isSingleParent}
          onChange={(value) => setState("isSingleParent", value)}
        />
      </Question>
      <Question title="一般の障害者">
        <Input
          type="number"
          min="0"
          suffix="人"
          placeholder="一般の障害者"
          onChange={(e) =>
            setState("generalDisabilityCount", Number(e.target.value))
          }
        />
      </Question>
      <Question title="本人・別居の特別障害者">
        <Input
          type="number"
          min="0"
          suffix="人"
          placeholder="本人・別居の特別障害者"
          onChange={(e) =>
            setState("specialDisabilityCount", Number(e.target.value))
          }
        />
      </Question>
      <Question title="同居の特別障害者">
        <Input
          type="number"
          min="0"
          suffix="人"
          placeholder="同居の特別障害者"
          onChange={(e) =>
            setState("cohabitingSpecialDisabilityCount", Number(e.target.value))
          }
        />
      </Question>
      <Question title="扶養家族の人数: 15歳以下">
        <Input
          type="number"
          min="0"
          suffix="人"
          placeholder="0"
          onChange={(e) => setDependents("under15", Number(e.target.value))}
        />
      </Question>
      <Question title="扶養家族の人数: 16-18歳">
        <Input
          type="number"
          min="0"
          suffix="人"
          placeholder="0"
          onChange={(e) => setDependents("from16to18", Number(e.target.value))}
        />
      </Question>
      <Question title="扶養家族の人数: 19-22歳">
        <Input
          type="number"
          min="0"
          suffix="人"
          placeholder="0"
          onChange={(e) => setDependents("from19to22", Number(e.target.value))}
        />
      </Question>
      <Question title="扶養家族の人数: 23-69歳">
        <Input
          type="number"
          min="0"
          suffix="人"
          placeholder="0"
          onChange={(e) => setDependents("from23to69", Number(e.target.value))}
        />
      </Question>
      <Question title="扶養家族の人数: 70歳+(同居の親・祖父母)">
        <Input
          type="number"
          min="0"
          suffix="人"
          placeholder="0"
          onChange={(e) =>
            setDependents("over70Coresiding", Number(e.target.value))
          }
        />
      </Question>
      <Question title="扶養家族の人数: 70歳+(上記以外)">
        <Input
          type="number"
          min="0"
          suffix="人"
          placeholder="0"
          onChange={(e) => setDependents("over70Other", Number(e.target.value))}
        />
      </Question>
    </div>
  );
};

const SectionThree = ({ setState }: SectionProps) => {
  return (
    <div className={styles.sectionContainer}>
      <Question title="社会保険料の金額">
        <Input
          type="number"
          min="0"
          suffix="円"
          placeholder="0"
          onChange={(e) => setState("socialInsurance", Number(e.target.value))}
        />
      </Question>
      <Question title="生命保険料の控除額">
        <Input
          type="number"
          min="0"
          suffix="円"
          placeholder="0"
          onChange={(e) =>
            setState("lifeInsuranceDeduction", Number(e.target.value))
          }
        />
      </Question>
      <Question title="医療費の控除額">
        <Input
          type="number"
          min="0"
          suffix="円"
          placeholder="0"
          onChange={(e) =>
            setState("medicalExpensesDeduction", Number(e.target.value))
          }
        />
      </Question>
      <Question title="小規模企業共済等掛金の金額">
        <Input
          type="number"
          min="0"
          suffix="円"
          placeholder="0"
          onChange={(e) => setState("premiumPension", Number(e.target.value))}
        />
      </Question>
      <Question title="地震保険料の控除額">
        <Input
          type="number"
          min="0"
          suffix="円"
          placeholder="0"
          onChange={(e) =>
            setState("earthquakeInsuranceDeduction", Number(e.target.value))
          }
        />
      </Question>
      <Question title="住宅借入金等特別控除">
        <Input
          type="number"
          min="0"
          suffix="円"
          placeholder="0"
          onChange={(e) =>
            setState("housingLoanDeduction", Number(e.target.value))
          }
        />
      </Question>
      <Question title="寄付金控除(ふるさと納税額)">
        <Input
          type="number"
          min="0"
          suffix="円"
          placeholder="0"
          onChange={(e) => setState("donation", Number(e.target.value))}
        />
      </Question>
    </div>
  );
};
