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

export default function Home() {
  const calculatedResult: Record<string, number | null | undefined> = {
    給与所得控除: 1880000,
    基礎控除: null,
    "配偶者控除/配偶者特別控除": null,
    扶養控除: null
  };

  const calculatedTaxResult: Record<string, number> = {
    税金の概算は: 100000,
    給与に対する税金は: 50000,
    仮想通貨の税金は: 50000,
    ふるさと納税の上限は: 50386
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
        <Footer
          calculatedResult={calculatedResult}
          calculatedTaxResult={calculatedTaxResult}
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

const SectionOne = () => {
  return (
    <div className={styles.sectionContainer}>
      <Question title="給与収入" help="あなたの職業を選択してください。">
        <Input type="number" suffix="円" placeholder="給与収入" />
      </Question>
      <Question title="仮想通貨の利益" help="あなたの職業を選択してください。">
        <Input type="number" suffix="円" placeholder="仮想通貨の利益" />
      </Question>
    </div>
  );
};

const SectionTwo = () => {
  return (
    <div className={styles.sectionContainer}>
      <Question title="配偶者の有無" help="あなたの職業を選択してください。">
        <YesNo name="001" value={false} onChange={() => {}} />
      </Question>
      <Question
        title="配偶者の給与収入"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="円" placeholder="配偶者の給与収入" />
      </Question>
      <Question
        title="寡婦に該当しますか？"
        help="あなたの職業を選択してください。"
      >
        <YesNo name="002" value={false} onChange={() => {}} />
      </Question>
      <Question
        title="ひとり親に該当しますか？"
        help="あなたの職業を選択してください。"
      >
        <YesNo name="003" value={false} onChange={() => {}} />
      </Question>
      <Question title="一般の障害者" help="あなたの職業を選択してください。">
        <Input type="number" suffix="人" placeholder="一般の障害者" />
      </Question>
      <Question
        title="本人・別居の特別障害者"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="人" placeholder="本人・別居の特別障害者" />
      </Question>
      <Question
        title="同居の特別障害者"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="人" placeholder="同居の特別障害者" />
      </Question>
      <Question
        title="扶養家族の人数: 15歳以下"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="人" placeholder="0" />
      </Question>
      <Question
        title="扶養家族の人数: 16-18歳"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="人" placeholder="0" />
      </Question>
      <Question
        title="扶養家族の人数: 19-22歳"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="人" placeholder="0" />
      </Question>
      <Question
        title="扶養家族の人数: 23-69歳"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="人" placeholder="0" />
      </Question>
      <Question
        title="扶養家族の人数: 70歳+(同居の親等)"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="人" placeholder="0" />
      </Question>
      <Question
        title="扶養家族の人数: 70歳+(上記以外)"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="人" placeholder="0" />
      </Question>
    </div>
  );
};

const SectionThree = () => {
  return (
    <div className={styles.sectionContainer}>
      <Question
        title="社会保険料の金額"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="円" placeholder="0" />
      </Question>
      <Question
        title="生命保険料の金額"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="円" placeholder="0" />
      </Question>
      <Question title="医療費の金額" help="あなたの職業を選択してください。">
        <Input type="number" suffix="円" placeholder="0" />
      </Question>
      <Question
        title="小規模企業共済等掛金の金額"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="円" placeholder="0" />
      </Question>
      <Question
        title="地震保険料の金額"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="円" placeholder="0" />
      </Question>
      <Question
        title="住宅借入金等特別控除"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="円" placeholder="0" />
      </Question>
      <Question
        title="寄付金控除(ふるさと納税額)"
        help="あなたの職業を選択してください。"
      >
        <Input type="number" suffix="円" placeholder="0" />
      </Question>
    </div>
  );
};
