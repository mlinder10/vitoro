import { ComponentType } from "react";

type PageTitleProps = {
  text: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
};

export default function PageTitle({ text, icon: Icon }: PageTitleProps) {
  return (
    <h1 className="flex items-center gap-2 p-8 font-bold text-2xl">
      {Icon && <Icon size={32} />}
      {text}
    </h1>
  );
}
