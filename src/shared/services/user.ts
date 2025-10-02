import { user } from "@/config/db/schema";
import { db } from "@/core/db";
import { desc, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/core/auth";
import { getRemainingCredits } from "./credit";

export interface UserCredits {
  remainingCredits: number;
  expiresAt: Date | null;
}

export type User = typeof user.$inferSelect & {
  credits?: UserCredits;
};

export type NewUser = typeof user.$inferInsert;

export async function getUsers({
  page = 1,
  limit = 30,
}: {
  page?: number;
  limit?: number;
} = {}): Promise<User[]> {
  const result = await db()
    .select()
    .from(user)
    .orderBy(desc(user.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return result;
}

export async function getUserByUserIds(userIds: string[]) {
  const result = await db()
    .select()
    .from(user)
    .where(inArray(user.id, userIds));

  return result;
}

export async function getUserInfo() {
  const signUser = await getSignUser();

  return signUser;
}

export async function getUserCredits(userId: string) {
  const remainingCredits = await getRemainingCredits(userId);

  return { remainingCredits };
}

export async function getSignUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user;
}

export async function appendUserToResult(result: any) {
  if (!result || !result.length) {
    return result;
  }

  const userIds = result.map((item: any) => item.userId);
  const users = await getUserByUserIds(userIds);
  result = result.map((item: any) => {
    const user = users.find((user: any) => user.id === item.userId);
    return { ...item, user };
  });

  return result;
}
