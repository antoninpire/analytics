import baseX from "base-x";
import crypto, { randomUUID } from "node:crypto";

function encodeBase58(buf: Buffer): string {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

  return baseX(alphabet).encode(buf);
}
/**
 * Generate ids similar to stripe
 */
export class IdGenerator<TPrefixes extends string> {
  private prefixes: Record<TPrefixes, string>;

  /**
   * Create a new id generator with fully typed prefixes
   * @param prefixes - Relevant prefixes for your domain
   */
  constructor(prefixes: Record<TPrefixes, string>) {
    this.prefixes = prefixes;
  }

  /**
   * Generate a new unique base58 encoded uuid with a defined prefix
   *
   * @returns xxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   */
  public id = (prefix: TPrefixes): string => {
    return [
      this.prefixes[prefix],
      encodeBase58(Buffer.from(randomUUID().replace(/-/g, ""), "hex")),
    ].join("_");
  };
}

const newId = new IdGenerator({
  destination: "dest",
  channel: "chan",
  report: "rep",
  session: "sess",
  event: "evt",
  user: "user",
  tenant: "tenant",
  webhook: "wh",
  api: "api", // internal id
  apiKey: "an",
}).id;

export async function createApiKey() {
  const apiKey = newId("apiKey");
  const hash = crypto.createHash("SHA-256").update(apiKey).digest("base64");

  //   return await db.insert(apiKeysTable).values({
  //     first_characters: apiKey.slice(0, 7),
  //     last_characters: apiKey.slice(-4),
  //     hash,
  //     id: apiKey,
  //     tenantId: "tenant",
  //     created_at: new Date(),
  //   });
}
