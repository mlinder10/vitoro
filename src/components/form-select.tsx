import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type FormSelectProps = {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  updateValue?: (value: string) => void;
  options: Readonly<string[]>;
  error: string[] | undefined;
};

export default function FormSelect({
  label,
  name,
  placeholder,
  value,
  updateValue,
  options,
  error,
}: FormSelectProps) {
  if (value && updateValue) {
    return (
      <div className="space-y-2">
        <input type="hidden" name={name} value={value} />
        <Label>{label}</Label>
        <Select required onValueChange={updateValue}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select required name={name} onValueChange={updateValue}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
