import { db } from "@/db";
import { InsertUser, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { User } from "@/db/schema";

export const getUsers = async () => {
  const user = await db.select().from(users);
  return user;
};

export const getUsersWithRole = async () => {
  const user = await db
    .select()
    .from(users)
    .where(sql`${users.role} = 'admin' or ${users.role} = 'editor'`);

  return user;
};

export const createUser = async (User: InsertUser) => {
  const [user] = await db.insert(users).values(User).returning();

  return user;
};

export const getUserEmail = async (email: string) => {
  /** const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
    */

  const result = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return result;
};

export const getUserById = async (id: number) => {
  /** const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
    */

  const result = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return result;
};

export const updateUserEmail = async (Account: User) => {
  const result = await db
    .update(users)
    .set(Account)
    .where(eq(users.id, Account.id));

  return result;
};

export const updateUserPasswordById = async (
  id: number,
  newPassword: string,
) => {
  const result = await db
    .update(users)
    .set({ password: newPassword })
    .where(eq(users.id, id));
  return result;
};

export const deleteUserById = async (id: number) => {
  const user = await db.delete(users).where(eq(users.id, id));

  return user;
};
