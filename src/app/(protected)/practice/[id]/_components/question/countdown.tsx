import { MINS_PER_QUESTION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { QBankSession } from "@/types";
import { useState, useEffect } from "react";

type CountdownProps = {
  session: QBankSession;
  onEnd: () => void;
  className?: string;
};

export default function Countdown({
  session,
  onEnd,
  className,
}: CountdownProps) {
  const [now, setNow] = useState(Date.now());
  const [lowTime, setLowTime] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const createdAt = new Date(session.createdAt).getTime();
  const totalTime = session.questionIds.length * MINS_PER_QUESTION * 60 * 1000;
  const endTime = createdAt + totalTime;

  const timeLeft = Math.max(0, endTime - now);
  const secondsLeft = Math.floor(timeLeft / 1000);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  useEffect(() => {
    if (secondsLeft <= 0 && !isOver) {
      setIsOver(true);
      onEnd();
    }
    if (minutes < 1 && !lowTime) {
      setLowTime(true);
    }
  }, [secondsLeft, minutes, isOver, lowTime, onEnd]);

  useEffect(() => {
    if (!isOver) {
      const interval = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(interval);
    }
  }, [isOver]);

  return (
    <p className={cn(className, lowTime && "text-destructive")}>
      {`${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`}
    </p>
  );
}
