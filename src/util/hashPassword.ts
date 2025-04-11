import crypto from "crypto";

export function hashPassword(password: string) {
  const hash = crypto
    .createHash("sha256") // Create a SHA-512 hash
    .update(password) // Update the hash with the password
    .digest("hex"); // Convert the hash to a hexadecimal string
  return hash; // Return the hash
}

export function generateRandomHash(salt: string) {
  const hash = crypto.createHash("sha256").update(salt).digest("hex");
  return hash;
}

export function verifyPassword(password: string, hash: string) {
  const hashToVerify = crypto
    .createHash("sha256") // Create a SHA-512 hash
    .update(password) // Update the hash with the password
    .digest("hex"); // Convert the hash to a hexadecimal string
  console.log(hashToVerify);
  return hash === hashToVerify; // Compare the hashes
}
