import { useState } from "react";

export default function useDeepState<T>(initialState: T | (() => T)) {
  const [state, setState] = useState(initialState);

  const updateData = (updater: (draft: T) => void) => {
    const draft = { ...state };
    updater(draft);
    setState(draft);
  };

  return [state, updateData] as const;
}
