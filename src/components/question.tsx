import { Help } from "@/components/help";

export const Question = ({
  title,
  description,
  help,
  children
}: {
  title: React.ReactNode | string;
  description?: React.ReactNode | string;
  help?: React.ReactNode | string;
  children: React.ReactNode | string;
}) => (
  <div className="flex shrink-0 items-center justify-between">
    <div className="flex items-center">
      <div>
        <h4 className="text-base font-semibold text-slate-700">{title}</h4>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      {help && <Help>{help}</Help>}
    </div>
    {children}
  </div>
);
