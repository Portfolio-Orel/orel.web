import { randomBytes } from "node:crypto";

export const createId = (prefix: "evt" | "act"): string => {
  const time = Date.now().toString(36);
  const rand = randomBytes(4).toString("hex");
  return `${prefix}-${time}-${rand}`;
};
