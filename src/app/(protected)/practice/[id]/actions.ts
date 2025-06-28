"use server";

import { wait } from "@/lib/utils";

export async function promptChat(prompt: string) {
  console.log(prompt);
  await wait(2000);
  return "some message";
}
