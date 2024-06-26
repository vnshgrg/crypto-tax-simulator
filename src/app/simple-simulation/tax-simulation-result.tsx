import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { numberToJpy } from "@/lib/utils";

export const TaxSimulationResult = ({
  taxAmount,
  totalIncome,
  basicDeduction,
  salaryDeduction,
  taxableIncome
}: {
  taxAmount: number;
  totalIncome: number;
  basicDeduction: number;
  salaryDeduction: number;
  taxableIncome: number;
}) => {
  return (
    <Card className="mx-auto mt-10 w-full max-w-md rounded-md border border-gray-300 p-6 shadow-md">
      <CardHeader className="mb-4 text-center">
        <h2 className="text-lg font-bold">税金かんたんシュミレーション</h2>
      </CardHeader>
      <CardContent>
        <div className="mb-6 text-center">
          <p className="text-lg">あなたの所得税額は</p>
          <p className="text-3xl font-bold text-blue-600">
            {numberToJpy(taxAmount)}
          </p>
        </div>
        <div className="mb-6 rounded border border-gray-300 p-4">
          <div className="mb-2 flex justify-between">
            <span>総収入</span>
            <span>{numberToJpy(totalIncome)}</span>
          </div>
          <div className="mb-4 text-sm text-gray-500">
            仮想通貨取引による雑所得は給与等の所得と合算され税率、税額が決まります。
          </div>
          <div className="mb-2 flex justify-between">
            <span>基礎控除</span>
            <span>{basicDeduction}円</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span>給与所得控除</span>
            <span>{numberToJpy(salaryDeduction)}</span>
          </div>
          <div className="flex justify-between">
            <span>課税所得額</span>
            <span>{numberToJpy(taxableIncome)}</span>
          </div>
        </div>
        <p className="mb-6 text-xs text-gray-500">
          ※上記の計算においては、令和5年度の情報、全国健康保険協会の東京都における保険料率を参考にし、40歳以下の場合を想定して概算にて計算しています。
        </p>
        <div className="mb-6 text-sm text-gray-500">
          上記以外にも家族構成、その他控除等を加味することでより正確な所得税額を求めることができます。
        </div>
        <div className="mb-6 text-center">
          <a href="#" className="text-blue-500">
            詳細版で税額を計算する→
          </a>
        </div>
        <div className="mb-6 text-sm text-gray-500">
          仮想通貨の損益を正確に計算すると、思っていたよりも利益が少なく（課税所得額を圧縮）できる場合があります。
        </div>
      </CardContent>
      <CardFooter className="justify-center text-center">
        <Button className="w-[200px] rounded-lg bg-blue-400 p-2 hover:bg-blue-700 active:bg-blue-700">
          無料アカウント登録
        </Button>
      </CardFooter>
    </Card>
  );
};
