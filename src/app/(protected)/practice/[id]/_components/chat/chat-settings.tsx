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
  {
    label: "",
    value: "Matthew McConaughey",
  },
] as const;

export type Tone = (typeof TONES)[number]["value"];

type ChatSettingsProps = {
  tone: string;
  setTone: Dispatch<SetStateAction<string>>;
};

export default function ChatSettings({ tone, setTone }: ChatSettingsProps) {
  return (
    <div>
      <div className="space-y-4 bg-tertiary p-2 border rounded-md">
        <div>
          <p className="font-semibold">AI Tone</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <Button
              variant={t.value === tone ? "accent" : "outline"}
              key={t.value}
              onClick={() => setTone(t.value)}
              size="sm"
            >
              {t.value}
            </Button>
          ))}
        </div>
        <Input
          type="text"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="Or enter custom tone..."
        />
      </div>
    </div>
  );
}
