export function stripAndParse<T>(output: string): T {
  return JSON.parse(
    output.replace("```json", "").replace("```", "").trim()
  ) as T;
}
