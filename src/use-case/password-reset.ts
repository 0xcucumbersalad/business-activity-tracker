import { URL } from "@/constant/constant";
import { db } from "@/db";
import { insertHash, reset_hash } from "@/db/schema";
import { generateRandomHash } from "@/util/hashPassword";
import { eq } from "drizzle-orm";

async function createHash(newHash: insertHash) {
  const [hash] = await db.insert(reset_hash).values(newHash).returning();

  return hash;
}

export async function getUserbyHash(hash: string) {
  const result = await db.query.reset_hash.findFirst({
    where: eq(reset_hash.hash, hash),
  });
  return result;
}

export async function updateHash(id: number, active: number) {
  const result = await db
    .update(reset_hash)
    .set({
      id: id,
      active: active,
    })
    .where(eq(reset_hash.id, id));

  return result;
}

async function generateResetHash(id: number) {
  const randomSalt = Math.floor(Math.random() * 100000);
  const randomHash = generateRandomHash(String(randomSalt));

  const data = {
    user_id: id,
    hash: randomHash,
  };

  const passwordHash = await createHash(data);

  return passwordHash;
}

export default async function createPasswordLink(id: number) {
  const hash = await generateResetHash(id);
  return `${URL}/forgot/reset?hash=${hash.hash}`;
}
