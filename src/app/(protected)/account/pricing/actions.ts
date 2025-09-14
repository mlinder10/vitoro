"use server";

import { SubscriptionId } from "@/lib/payment";

export async function createCheckoutSession(subscriptionId: SubscriptionId) {
  switch (subscriptionId) {
    case "lifetime-subscription":
      return;
    case "monthly-subscription":
      return;
    case "yearly-subscription":
      return;
  }
}
