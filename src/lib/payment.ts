"use server";

import { db, subscriptions } from "@/db";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export const SUBSCRIPTIONS = {
  monthly: {
    id: "monthly-subscription",
    name: "Monthly",
    priceInPennies: 899, // $8.99
    isRenewable: true,
    interval: "month",
  },
  yearly: {
    id: "yearly-subscription",
    name: "Yearly",
    priceInPennies: 4999, // $49.99
    isRenewable: true,
    interval: "year",
  },
  lifetime: {
    id: "lifetime-subscription",
    name: "Lifetime",
    priceInPennies: 9999, // $99.99
    isRenewable: false,
    interval: undefined,
  },
} as const;

export type Subscription = (typeof SUBSCRIPTIONS)[keyof typeof SUBSCRIPTIONS];
export type SubscriptionId = Subscription["id"];

// Payment Processing --------------------------------------------------------

const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;
const YEAR_IN_MS = 1000 * 60 * 60 * 24 * 365;

export class Payment {
  // static
  private static shared: Payment | null = null;

  static get() {
    return this.shared || (this.shared = new Payment());
  }

  // instance
  private stripe: Stripe;

  private constructor() {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY!);
  }

  // Webhook Processing --------------------------------------------------------

  async processEvents(payload: string, signature: string) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const charge = event.data.object as Stripe.Checkout.Session;
      const { userId, productId } = charge.metadata ?? {};
      if (!userId || !productId) {
        // Stripe Metadata
        console.error("Missing metadata");
        return 400;
      }

      const customerId = charge.customer as string | null;
      const stripeSubscriptionId = charge.subscription as string | null;
      if (!customerId) return 400;
      if (!Object.values(SUBSCRIPTIONS).some((s) => s.id === productId)) {
        return 400;
      }

      if (!stripeSubscriptionId && productId !== "lifetime-subscription") {
        return 400;
      }

      const result = await this.handlePayment(
        userId,
        customerId,
        stripeSubscriptionId,
        productId as SubscriptionId
      );

      if (result === "error") return 400;
    } else if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;

      const customerId = invoice.customer as string | null;
      if (!customerId) return 400;

      const result = await this.handleSubscriptionRenewal(customerId);

      if (result === "error") return 400;
    } else {
      console.error(`Unhandled event type: ${event.type}`);
      return 400;
    }

    return 200;
  }

  private async handlePayment(
    userId: string,
    customerId: string,
    stripeSubscriptionId: string | null,
    subscriptionId: SubscriptionId
  ) {
    try {
      const [existing] = await db
        .select({ expiresAt: subscriptions.expiresAt })
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId));

      const newExpiresAt = this.getNewExpiresAt(
        subscriptionId,
        existing?.expiresAt
      );

      if (existing) {
        await db
          .update(subscriptions)
          .set({
            subscriptionId,
            expiresAt: newExpiresAt,
            isRenewable: subscriptionId !== "lifetime-subscription",
          })
          .where(eq(subscriptions.userId, userId));
      } else {
        await db.insert(subscriptions).values({
          userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId,
          subscriptionId,
          expiresAt: newExpiresAt,
          isRenewable: subscriptionId !== "lifetime-subscription",
        });
      }
      return "success";
    } catch (error) {
      console.error(error);
      return "error";
    }
  }

  private async handleSubscriptionRenewal(customerId: string) {
    try {
      const [existing] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeCustomerId, customerId));

      if (!existing) return "error";
      if (existing.subscriptionId === "lifetime-subscription") return "success";

      const newExpiresAt = this.getNewExpiresAt(existing.subscriptionId);
      if (!newExpiresAt) return "error";

      await db
        .update(subscriptions)
        .set({ expiresAt: newExpiresAt })
        .where(eq(subscriptions.stripeCustomerId, customerId));

      return "success";
    } catch (error) {
      console.error(error);
      return "error";
    }
  }

  // helpers

  private getNewExpiresAt(subscriptionId: SubscriptionId, prev?: Date) {
    if (subscriptionId === "lifetime-subscription") {
      return new Date(8640000000000000); // max JS Date ≈ year 275760
    }

    const now = Date.now();
    const base = prev && prev.getTime() > now ? prev.getTime() : now;
    const delta =
      subscriptionId === "yearly-subscription" ? YEAR_IN_MS : MONTH_IN_MS;

    return new Date(base + delta);
  }

  // Create Checkout Session ----------------------------------------------------

  async createCheckoutSession(subscription: Subscription, userId: string) {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: subscription.name,
            },
            unit_amount: subscription.priceInPennies,
            recurring: subscription.isRenewable
              ? { interval: subscription.interval }
              : undefined,
          },
          quantity: 1,
        },
      ],
      mode: subscription.isRenewable ? "subscription" : "payment",
      // allow_promotion_codes: true,
      success_url: `${process.env.SERVER_URL!}/pricing`,
      cancel_url: `${process.env.SERVER_URL!}/pricing`,
      payment_method_types: ["card"],
      metadata: {
        // Stripe Metadata
        productId: subscription.id,
        userId,
      },
    });

    return session.url;
  }

  async cancelSubscription(stripeSubscriptionId: string) {
    try {
      await this.stripe.subscriptions.update(stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
      await db
        .update(subscriptions)
        .set({ isRenewable: false })
        .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
    } catch (error) {
      console.error(error);
    }
  }
}
