import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";

const TONES = [
  {
    label: "",
    value: "Clear and concise",
  },
  {
    label: "",
    value: "Encouraging and empathetic",
  },
  {
    label: "",
    value: "Sarcastic and witty",
  },
] as const;

export type Tone = (typeof TONES)[number]["value"];

type TutorSettingsProps = {
  tone: string;
  setTone: Dispatch<SetStateAction<string>>;
};

export default function TutorSettings({ tone, setTone }: TutorSettingsProps) {
  return (
    <div>
      <div className="space-y-4 bg-tertiary p-2 border rounded-md">
        <div>
          <p className="font-semibold">Tone</p>
        </div>
        <div className="flex gap-2">
          {TONES.map((t) => (
            <Button
              variant={t.value === tone ? "accent" : "outline"}
              key={t.value}
              onClick={() => setTone(t.value)}
            >
              {t.value}
            </Button>
          ))}
        </div>
        <Input
          type="text"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        />
      </div>
    </div>
  );
}
