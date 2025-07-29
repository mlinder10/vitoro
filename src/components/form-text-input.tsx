import { Input } from "./ui/input";
import { Label } from "./ui/label";

type FormTextInputProps = {
  label: string;
  name: string;
  placeholder: string;
  error: undefined | string | string[];
  type?: HTMLInputElement["type"];
};

export default function FormTextInput({
  label,
  name,
  placeholder,
  error,
  type = "text",
}: FormTextInputProps) {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} placeholder={placeholder} />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
