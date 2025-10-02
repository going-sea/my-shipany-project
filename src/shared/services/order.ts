import { credit, order, subscription } from "@/config/db/schema";
import { db } from "@/core/db";
import { and, count, desc, eq } from "drizzle-orm";
import { NewSubscription } from "./subscription";
import { NewCredit } from "./credit";
import { appendUserToResult, User } from "./user";
import { PaymentType } from "@/extensions/payment";

export type Order = typeof order.$inferSelect & {
  user?: User;
};
export type NewOrder = typeof order.$inferInsert;
export type UpdateOrder = Partial<
  Omit<NewOrder, "id" | "orderNo" | "createdAt">
>;

export enum OrderStatus {
  // processing status
  PENDING = "pending", // order saved, waiting for checkout
  CREATED = "created", // checkout success
  // final status
  COMPLETED = "completed", // checkout completed, but failed
  PAID = "paid", // order paid success
  FAILED = "failed", // order paid, but failed
}

/**
 * create order
 */
export async function createOrder(newOrder: NewOrder) {
  const [result] = await db().insert(order).values(newOrder).returning();

  return result;
}

/**
 * get orders
 */
export async function getOrders({
  userId,
  status,
  getUser,
  paymentType,
  page = 1,
  limit = 30,
}: {
  userId?: string;
  status?: string;
  getUser?: boolean;
  paymentType?: PaymentType;
  page?: number;
  limit?: number;
} = {}): Promise<Order[]> {
  const result = await db()
    .select()
    .from(order)
    .where(
      and(
        userId ? eq(order.userId, userId) : undefined,
        status ? eq(order.status, status) : undefined,
        paymentType ? eq(order.paymentType, paymentType) : undefined
      )
    )
    .orderBy(desc(order.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  if (getUser) {
    return appendUserToResult(result);
  }

  return result;
}

/**
 * get orders count
 */
export async function getOrdersCount({
  userId,
  paymentType,
  status,
}: {
  userId?: string;
  paymentType?: PaymentType;
  status?: string;
} = {}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(order)
    .where(
      and(
        userId ? eq(order.userId, userId) : undefined,
        status ? eq(order.status, status) : undefined,
        paymentType ? eq(order.paymentType, paymentType) : undefined
      )
    );

  return result?.count || 0;
}

/**
 * find order by id
 */
export async function findOrderById(id: string) {
  const [result] = await db().select().from(order).where(eq(order.id, id));

  return result;
}

/**
 * find order by order no
 */
export async function findOrderByOrderNo(orderNo: string) {
  const [result] = await db()
    .select()
    .from(order)
    .where(eq(order.orderNo, orderNo));

  return result;
}

/**
 * update order
 */
export async function updateOrderByOrderNo(
  orderNo: string,
  updateOrder: UpdateOrder
) {
  const [result] = await db()
    .update(order)
    .set(updateOrder)
    .where(eq(order.orderNo, orderNo))
    .returning();

  return result;
}

export async function updateOrderInTransaction({
  orderNo,
  updateOrder,
  newSubscription,
  newCredit,
}: {
  orderNo: string;
  updateOrder: UpdateOrder;
  newSubscription?: NewSubscription;
  newCredit?: NewCredit;
}) {
  if (!orderNo || !updateOrder) {
    throw new Error("orderNo and updateOrder are required");
  }

  // only update order, no need transaction
  if (!newSubscription && !newCredit) {
    return updateOrderByOrderNo(orderNo, updateOrder);
  }

  // need transaction
  const result = await db().transaction(async (tx) => {
    let result: any = {
      order: null,
      subscription: null,
      credit: null,
    };

    // deal with subscription
    if (newSubscription) {
      // not create subscription with same subscription id and payment provider
      let [existingSubscription] = await tx
        .select()
        .from(subscription)
        .where(
          and(
            eq(subscription.subscriptionId, newSubscription.subscriptionId),
            eq(subscription.paymentProvider, newSubscription.paymentProvider)
          )
        );

      if (!existingSubscription) {
        // create subscription
        const [subscriptionResult] = await tx
          .insert(subscription)
          .values(newSubscription)
          .returning();

        existingSubscription = subscriptionResult;
      }

      result.subscription = existingSubscription;
    }

    // deal with credit
    if (newCredit) {
      // not create credit with same order no
      let [existingCredit] = await tx
        .select()
        .from(credit)
        .where(eq(credit.orderNo, orderNo));

      if (!existingCredit) {
        // create credit
        const [creditResult] = await tx
          .insert(credit)
          .values(newCredit)
          .returning();

        existingCredit = creditResult;
      }

      result.credit = existingCredit;
    }

    // update order
    const [orderResult] = await tx
      .update(order)
      .set(updateOrder)
      .where(eq(order.orderNo, orderNo))
      .returning();

    return result;
  });

  return result;
}
