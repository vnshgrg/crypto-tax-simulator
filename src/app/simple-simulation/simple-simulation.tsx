"use client";

import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export const SimpleSimulation = () => {
  return (
    <Card className="mx-auto w-full max-w-sm rounded-md bg-gray-50 shadow-md">
      <CardHeader className="border-b p-4">
        <h2 className="text-lg">税金かんたんシュミレーション</h2>
      </CardHeader>
      <CardContent className="p-4">
        <div className="border-grey rounded-lg border-4 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <label htmlFor="occupation" className="mb-2 block font-semibold">
              職業
            </label>
            <div className="flex">
              <Select>
                <SelectTrigger className="w-[192px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">会社員</SelectItem>
                  <SelectItem value="personal-business">個人事業主</SelectItem>
                </SelectContent>
              </Select>
              <p>　</p>
            </div>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label htmlFor="annualIncome" className="mb-2 block font-semibold">
              年収 (主な勤務先の年収)
            </label>
            <Input
              id="annualIncome"
              min={0}
              type="text"
              className="rounded border p-2"
            />
            <p>円</p>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label
              htmlFor="additionalIncome"
              className="mb-2 block font-semibold"
            >
              仮想通貨等、雑所得収入
            </label>
            <Input
              id="additionalIncome"
              min={0}
              type="text"
              className="rounded border p-2"
            />
            <p>円</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button className="w-[200px] rounded-lg bg-blue-400 p-2 hover:bg-blue-700 active:bg-blue-700">
          計算する
        </Button>
      </CardFooter>
    </Card>
  );
};
