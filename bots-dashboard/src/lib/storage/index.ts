import path from "node:path";
import { BlobDriver } from "@/lib/storage/blob-driver";
import { FileDriver } from "@/lib/storage/file-driver";
import { JsonBotStore, type BotStore } from "@/lib/storage/store";

let cached: BotStore | null = null;

export const getStore = (): BotStore => {
  if (cached) return cached;
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (token) {
    cached = new JsonBotStore(new BlobDriver());
    return cached;
  }
  if (process.env.VERCEL === "1") {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }
  const root = process.env.BOTDASH_DATA_DIR?.trim() || path.join(process.cwd(), ".data");
  cached = new JsonBotStore(new FileDriver(root));
  return cached;
};

export type { BotStore } from "@/lib/storage/store";
