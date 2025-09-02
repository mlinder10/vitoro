"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

type EditableTextProps = {
  value: string;
  onChange: (value: string) => Promise<void>;
};

export default function EditableText({ value, onChange }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(true);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsValid(e.target.value !== "");
    setInputValue(e.target.value);
  }

  async function handleSave() {
    if (inputValue === "") revertChanges();
    else await onChange(inputValue);
    setIsEditing(false);
  }

  function revertChanges() {
    setInputValue(value);
    setIsEditing(false);
  }

  return (
    <div className="">
      {isEditing ? (
        <input
          type="text"
          className={cn("border", !isValid && "border-destructive")}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <p className="" onClick={() => setIsEditing(true)}>
          {value}
        </p>
      )}
    </div>
  );
}
