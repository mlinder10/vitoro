export const LOGIN_PATH = "/login";
export const REGISTER_PATH = "/register";
export const ADMIN_PATH = "/admin";
export const APP_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://vitado.vercel.app";

export const ACCENT_COLOR = "#3b82f6";
export const ACCENT_COLOR_SECONDARY = "#2563eb";

export const CHECKLIST = {
  "1": "One correct answer with all distractors clearly incorrect",
  "2": "Each distractor tests a plausible misunderstanding",
  "3": "Answer is consistent with vitals, labs, and imaging in the stem",
  "4": "No required data is missing for choosing the correct answer",
  "5": "Clinical presentation is realistic and not contradictory",
  "6": "Question requires clinical reasoning, not fact recall",
  "7": "No direct giveaway or naming of the diagnosis in the stem",
  "8": "Every answer choice is anchored to clues in the vignette",
  "9": "No duplicate correct answers or overly vague distractors",
};
