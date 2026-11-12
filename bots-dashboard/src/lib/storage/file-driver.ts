import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { assertSafePath, type JsonDriver, type StoredDocument } from "@/lib/storage/store";

const isEnoent = (error: unknown): boolean =>
  Boolean(error && typeof error === "object" && "code" in error && error.code === "ENOENT");

const fullPath = (root: string, pathname: string): string => {
  assertSafePath(pathname);
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, pathname);
  const relative = path.relative(resolvedRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Unsafe path");
  return resolved;
};

export class FileDriver implements JsonDriver {
  constructor(private readonly root: string) {}

  async read(pathname: string): Promise<StoredDocument | null> {
    try {
      const text = await readFile(fullPath(this.root, pathname), "utf8");
      return { value: JSON.parse(text) as unknown };
    } catch (error) {
      if (isEnoent(error)) return null;
      throw error;
    }
  }

  async write(pathname: string, value: unknown): Promise<void> {
    const file = fullPath(this.root, pathname);
    await mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(value), "utf8");
    await rename(tmp, file);
  }

  async list(prefix: string): Promise<string[]> {
    const folder = prefix.replace(/\/$/, "");
    if (folder.includes("/") || folder.includes("..")) return [];
    try {
      const names = await readdir(path.join(this.root, folder));
      return names.filter((name) => name.endsWith(".json")).map((name) => `${folder}/${name}`);
    } catch (error) {
      if (isEnoent(error)) return [];
      throw error;
    }
  }
}
