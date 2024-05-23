import { cn } from "@/lib/utils";

export const Input = ({
  className,
  suffix,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  suffix?: React.ReactNode | string;
}) => (
  <div className="relative">
    <input
      className={cn(
        "w-48 rounded-md border px-4 py-2.5 font-mono text-base",
        suffix ? "pr-8" : "pr-4",
        className
      )}
      {...props}
    />
    {suffix && (
      <span className="absolute right-3 top-2.5 text-base text-slate-500">
        {suffix}
      </span>
    )}
  </div>
);
