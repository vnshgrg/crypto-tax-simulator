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
  <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
    <div className="flex items-center justify-between md:justify-start">
      <div>
        <h4 className="font-semibold text-slate-700 md:text-base">{title}</h4>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      {help && <Help>{help}</Help>}
    </div>
    <div>{children}</div>
  </div>
);
