import useDeepState from "./use-deep-state";

type ResultState<T extends object, U> =
  | {
      idle: true;
      loading?: false;
      success?: false;
      error?: false;
    }
  | {
      idle?: false;
      loading: true;
      success?: false;
      error?: false;
    }
  | {
      idle?: false;
      loading?: false;
      success: true;
      error?: false;
      data: U;
    }
  | {
      idle?: false;
      loading?: false;
      success?: false;
      error: true;
      errors: Record<keyof T, string | undefined>;
    };

export default function useFormState<T extends object, U>(
  initial: T,
  onSubmit: (state: T) => Promise<U>,
  validator?: (state: T) => Record<keyof T, string | undefined>
) {
  const [state, updateState] = useDeepState(initial);
  const [result, updateResult] = useDeepState<ResultState<T, U>>({
    idle: true,
  });

  function reset() {
    updateState(() => initial);
    updateResult(() => ({ idle: true }));
  }

  function update<K extends keyof T>(key: keyof T, value: T[K]) {
    updateState((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    // check for errors in form entry
    const errors = validator?.(state);
    if (errors) {
      updateResult(() => ({
        idle: false,
        loading: false,
        error: true,
        errors,
      }));
      return;
    }

    updateResult(() => ({ idle: false, loading: true }));
    try {
      const data = await onSubmit(state);
      updateResult(() => ({
        idle: false,
        loading: false,
        success: true,
        data,
      }));
    } catch (error) {
      updateResult(() => ({
        idle: false,
        loading: false,
        error: true,
        errors: error as Record<keyof T, string | undefined>,
      }));
    }
  }

  return { state, result, update, reset, submit };
}
