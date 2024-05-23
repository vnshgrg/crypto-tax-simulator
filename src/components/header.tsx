import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Header = () => (
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
);
