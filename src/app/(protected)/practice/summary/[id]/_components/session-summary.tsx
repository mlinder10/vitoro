import ProgressCircle from "@/components/progress-circle";
import { QBankSession, Question } from "@/types";

type SessionSummaryProps = {
  session: QBankSession;
  questions: Question[];
};

function splitQuestions(session: QBankSession, questions: Question[]) {
  const correct: Question[] = [];
  const incorrect: Question[] = [];
  for (let i = 0; i < questions.length; i++) {
    if (session.answers[i] === questions[i].answer) correct.push(questions[i]);
    else incorrect.push(questions[i]);
  }
  return { correct, incorrect };
}

function scoreToHex(score: number): string {
  const clamped = Math.max(0, Math.min(1, score));

  let hue: number;
  if (clamped <= 0.5) {
    hue = 0; // stay red
  } else {
    // interpolate from red (0°) to green (120°) from 0.5 to 1.0
    hue = ((clamped - 0.5) / 0.5) * 120;
  }

  const saturation = 80;
  const lightness = 50;

  return hslToHex(hue, saturation, lightness);
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function SessionSummary({
  session,
  questions,
}: SessionSummaryProps) {
  const { correct } = splitQuestions(session, questions);
  const percentage = 90 / 100;

  return (
    <div className="flex flex-col items-center">
      <ProgressCircle
        percentage={percentage}
        size={256}
        startColor={scoreToHex(percentage)}
      >
        <span className="font-bold text-4xl">{percentage * 100}%</span>
      </ProgressCircle>
      <p>
        You answered {correct.length} out of {questions.length} question
        {questions.length === 1 ? "" : "s"} correctly
      </p>
    </div>
  );
}
