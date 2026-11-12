import { BlobPreconditionFailedError, get, list, put } from "@vercel/blob";
import { assertSafePath, PreconditionError, type JsonDriver, type StoredDocument } from "@/lib/storage/store";

const isPrecondition = (error: unknown): boolean =>
  error instanceof BlobPreconditionFailedError ||
  (error instanceof Error && error.name === "BlobPreconditionFailedError");

export class BlobDriver implements JsonDriver {
  async read(pathname: string): Promise<StoredDocument | null> {
    assertSafePath(pathname);
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await new Response(result.stream).text();
    try {
      return { value: JSON.parse(text) as unknown, tag: result.blob.etag };
    } catch {
      throw new Error("Stored document is unreadable");
    }
  }

  async write(pathname: string, value: unknown, tag?: string): Promise<void> {
    assertSafePath(pathname);
    try {
      await put(pathname, JSON.stringify(value), {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        cacheControlMaxAge: 60,
        ...(tag ? { ifMatch: tag } : {}),
      });
    } catch (error) {
      if (isPrecondition(error)) throw new PreconditionError();
      throw error;
    }
  }

  async list(prefix: string): Promise<string[]> {
    const paths: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix, cursor, limit: 1000 });
      for (const blob of page.blobs) paths.push(blob.pathname);
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return paths;
  }
}
