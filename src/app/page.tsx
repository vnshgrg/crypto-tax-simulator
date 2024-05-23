"use client";

import { Input } from "@/components/input";
import { Question } from "@/components/question";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { YesNo } from "@/components/yes-no";
import { numberToJpy } from "@/lib/utils";

export default function Home() {
  const calculatedResult: Record<string, number> = {
    給与所得控除: 1880000,
    基礎控除: 480000,
    "配偶者控除/配偶者特別控除": 380000,
    扶養控除: 630000
  };

  const calculatedTaxResult: Record<string, number> = {
    税金の概算は: 100000,
    給与に対する税金は: 50000,
    仮想通貨の税金は: 50000,
    ふるさと納税の上限は: 50386
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row space-x-6">
          <div className="space-y-4">
            <CardTitle className="text-xl font-bold text-slate-700">
              仮想通貨の税金計算シミュレーションツール
            </CardTitle>
            <CardDescription className="text-base">
              簡単な質問に答えるだけで、仮想通貨取引の税金を簡単に概算します。さっそく始めましょう！
            </CardDescription>
          </div>
          <div className="relative w-24 shrink-0">
            <img
              src="/tax-accountant.svg"
              alt="Crypto Tax Accountant"
              className="right -0 absolute -top-2 w-28"
            />
          </div>
        </CardHeader>
        <CardContent className="border-y border-slate-200 bg-slate-50/40 pt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className={styles.accordionTrigger}>
                <h3>1. 所得金額を入力してください</h3>
              </AccordionTrigger>
              <AccordionContent className={styles.accordionSection}>
                <SectionOne />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className={styles.accordionTrigger}>
                <h3>2. 家族について教えてください</h3>
              </AccordionTrigger>
              <AccordionContent className={styles.accordionSection}>
                <SectionTwo />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-none">
              <AccordionTrigger className={styles.accordionTrigger}>
                <h3>3. 所得控除を入力してください</h3>
              </AccordionTrigger>
              <AccordionContent className={styles.accordionSection}>
                <SectionThree />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
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
                <div
                  key={key}
                  className="flex items-center justify-between py-2"
                >
                  <span>{key}</span>
                  <span className={styles.resultHighlight}>
                    {numberToJpy(value)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2 divide-y pt-4">
              {Object.entries(calculatedTaxResult).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2"
                >
                  <span>{key}</span>
                  <span className={styles.resultHighlight}>
                    {numberToJpy(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}

const styles: Record<string, string> = {
  accordionTrigger:
    "font-semibold text-gray-500 hover:no-underline hover:text-gray-700 data-[state=open]:text-gray-800",
  accordionSection: "pl-4",
  resultHighlight: "mx-2 inline-block font-semibold text-orange-500"
};

const SectionOne = () => {
  return (
    <div className="space-y-4">
      <Question title="給与収入" help="あなたの職業を選択してください。">
        <Input type="text" placeholder="給与収入" />
      </Question>
      <Question title="仮想通貨の利益" help="あなたの職業を選択してください。">
        <Input type="text" placeholder="仮想通貨の利益" />
      </Question>
    </div>
  );
};

const SectionTwo = () => {
  return (
    <div className="space-y-4">
      <Question title="配偶者の有無" help="あなたの職業を選択してください。">
        <YesNo name="001" value={false} onChange={() => {}} />
      </Question>
      <Question
        title="配偶者の給与収入"
        help="あなたの職業を選択してください。"
      >
        <Input type="text" placeholder="配偶者の給与収入" />
      </Question>
      <Question
        title="寡婦に該当しますか？"
        help="あなたの職業を選択してください。"
      >
        <YesNo name="002" value={false} onChange={() => {}} />
      </Question>
      <Question title="一般の障害者" help="あなたの職業を選択してください。">
        <Input suffix="人" type="text" placeholder="一般の障害者" />
      </Question>
      <Question
        title="本人・別居の特別障害者"
        help="あなたの職業を選択してください。"
      >
        <Input suffix="人" type="text" placeholder="本人・別居の特別障害者" />
      </Question>
      <Question
        title="同居の特別障害者"
        help="あなたの職業を選択してください。"
      >
        <Input suffix="人" type="text" placeholder="同居の特別障害者" />
      </Question>
      <Question
        title="扶養家族の人数: 15歳以下"
        help="あなたの職業を選択してください。"
      >
        <Input suffix="人" type="text" placeholder="0" />
      </Question>
      <Question
        title="扶養家族の人数: 16-18歳"
        help="あなたの職業を選択してください。"
      >
        <Input suffix="人" type="text" placeholder="0" />
      </Question>
      <Question
        title="扶養家族の人数: 19-22歳"
        help="あなたの職業を選択してください。"
      >
        <Input suffix="人" type="text" placeholder="0" />
      </Question>
      <Question
        title="扶養家族の人数: 23-69歳"
        help="あなたの職業を選択してください。"
      >
        <Input suffix="人" type="text" placeholder="0" />
      </Question>
      <Question
        title="扶養家族の人数: 70歳+(同居の親等)"
        help="あなたの職業を選択してください。"
      >
        <Input suffix="人" type="text" placeholder="0" />
      </Question>
      <Question
        title="扶養家族の人数: 70歳+(上記以外)"
        help="あなたの職業を選択してください。"
      >
        <Input suffix="人" type="text" placeholder="0" />
      </Question>
    </div>
  );
};

const SectionThree = () => {
  return (
    <div className="space-y-4">
      <Question
        title="社会保険料の金額"
        help="あなたの職業を選択してください。"
      >
        <Input type="text" placeholder="0" />
      </Question>
      <Question
        title="生命保険料の金額"
        help="あなたの職業を選択してください。"
      >
        <Input type="text" placeholder="0" />
      </Question>
      <Question title="医療費の金額" help="あなたの職業を選択してください。">
        <Input type="text" placeholder="0" />
      </Question>
      <Question
        title="小規模企業共済等掛金の金額"
        help="あなたの職業を選択してください。"
      >
        <Input type="text" placeholder="0" />
      </Question>
      <Question
        title="地震保険料の金額"
        help="あなたの職業を選択してください。"
      >
        <Input type="text" placeholder="0" />
      </Question>
      <Question
        title="住宅借入金等特別控除"
        help="あなたの職業を選択してください。"
      >
        <Input type="text" placeholder="0" />
      </Question>
      <Question
        title="寄付金控除(ふるさと納税額)"
        help="あなたの職業を選択してください。"
      >
        <Input type="text" placeholder="0" />
      </Question>
    </div>
  );
};
