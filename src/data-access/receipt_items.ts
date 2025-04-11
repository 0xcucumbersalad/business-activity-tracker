import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { receipt_items } from "@/db/schema";
import { InsertItem, Item } from "@/db/schema";

export const getItems = async () => {
  const items = await db.select().from(receipt_items);

  return items;
};

export const getItemsById = async (receipt_id: number) => {
  const items = await db
    .select()
    .from(receipt_items)
    .where(eq(receipt_items.receipt, receipt_id));

  return items;
};

export const createItem = async (item: InsertItem) => {
  const [items] = await db.insert(receipt_items).values(item).returning();

  return items;
};

export const updateItem = async (updatedReceipt: Item, id: number) => {
  const items = await db
    .update(receipt_items)
    .set(updatedReceipt)
    .where(
      and(
        eq(receipt_items.receipt, id),
        eq(receipt_items.id, updatedReceipt.id),
      ),
    )
    .returning();

  return items;
};
