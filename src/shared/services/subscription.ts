import { subscription } from "@/config/db/schema";
import { db } from "@/core/db";
import { and, count, desc, eq } from "drizzle-orm";
import { appendUserToResult, User } from "./user";

export type Subscription = typeof subscription.$inferSelect & {
  user?: User;
};
export type NewSubscription = typeof subscription.$inferInsert;
export type UpdateSubscription = Partial<
  Omit<NewSubscription, "id" | "subscriptionNo" | "createdAt">
>;

export enum SubscriptionStatus {
  PENDING = "pending",
  ACTIVE = "active",
  CANCELLED = "cancelled",
}

/**
 * create subscription
 */
export async function createSubscription(newSubscription: NewSubscription) {
  const [result] = await db()
    .insert(subscription)
    .values(newSubscription)
    .returning();
  return result;
}

/**
 * find subscription by id
 */
export async function findSubscriptionById(id: string) {
  const [result] = await db()
    .select()
    .from(subscription)
    .where(eq(subscription.id, id));

  return result;
}

/**
 * find subscription by subscription no
 */
export async function findSubscriptionBySubscriptionNo(subscriptionNo: string) {
  const [result] = await db()
    .select()
    .from(subscription)
    .where(eq(subscription.subscriptionNo, subscriptionNo));

  return result;
}

/**
 * get subscriptions
 */
export async function getSubscriptions({
  userId,
  status,
  interval,
  getUser,
  page = 1,
  limit = 30,
}: {
  userId?: string;
  status?: string;
  getUser?: boolean;
  interval?: string;
  page?: number;
  limit?: number;
}): Promise<Subscription[]> {
  const result = await db()
    .select()
    .from(subscription)
    .where(
      and(
        userId ? eq(subscription.userId, userId) : undefined,
        status ? eq(subscription.status, status) : undefined,
        interval ? eq(subscription.interval, interval) : undefined
      )
    )
    .orderBy(desc(subscription.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  if (getUser) {
    return appendUserToResult(result);
  }

  return result;
}

/**
 * get subscriptions count
 */
export async function getSubscriptionsCount({
  userId,
  status,
  interval,
}: {
  userId?: string;
  status?: string;
  interval?: string;
} = {}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(subscription)
    .where(
      and(
        userId ? eq(subscription.userId, userId) : undefined,
        status ? eq(subscription.status, status) : undefined,
        interval ? eq(subscription.interval, interval) : undefined
      )
    );

  return result?.count || 0;
}
