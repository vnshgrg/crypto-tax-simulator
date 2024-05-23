import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Header = () => (
  <CardHeader className="flex space-y-0 md:flex-row md:space-x-6">
    <div className="order-2 space-y-3 md:order-1 md:space-y-4">
      <CardTitle className="text-xl font-bold text-slate-700">
        仮想通貨の税金計算シミュレーションツール
      </CardTitle>
      <CardDescription className="text-base">
        簡単な質問に答えるだけで、仮想通貨取引の税金を簡単に概算します。さっそく始めましょう！
      </CardDescription>
    </div>
    <div className="order-1 flex h-auto w-full items-center justify-center pb-4 text-center md:relative md:order-2 md:w-24 md:pb-0 md:text-left">
      <img
        src="/tax-accountant.svg"
        alt="Crypto Tax Accountant"
        className="w-40 md:absolute md:-top-2 md:right-0 md:w-28"
      />
    </div>
  </CardHeader>
);
