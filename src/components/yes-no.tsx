import { useState } from "react";

import { Label } from "@/components/ui/label";

export const YesNo = ({
  name,
  value: _value,
  onChange
}: {
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) => {
  const [value, setValue] = useState(_value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "yes";
    setValue(value);
    onChange(value);
  };

  return (
    <div className="flex h-9 items-center space-x-5">
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id={`${name}-yes`}
          name={name}
          value="yes"
          onChange={handleChange}
          checked={value === true}
        />
        <Label htmlFor={`${name}-yes`} className="cursor-pointer">
          はい
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id={`${name}-no`}
          name={name}
          value="no"
          onChange={handleChange}
          checked={value === false}
        />
        <Label htmlFor={`${name}-no`} className="cursor-pointer">
          いいえ
        </Label>
      </div>
    </div>
  );
};
