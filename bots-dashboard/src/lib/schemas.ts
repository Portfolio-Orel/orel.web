import { z } from "zod";

const idPattern = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;

export const botIdSchema = z.string().regex(idPattern, "Invalid id");

const httpUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Must be an http(s) URL");

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined));

const timestamp = z.string().trim().refine((value) => {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) return false;
  return !Number.isNaN(Date.parse(value));
}, "Must be an ISO timestamp");

export const needsItemSchema = z.object({
  id: botIdSchema,
  title: z.string().trim().min(1).max(200),
  detail: optionalText(2000),
  link: httpUrl.optional(),
  kind: z.enum(["approval", "question", "fyi"]),
});

export const linkSchema = z.object({
  label: z.string().trim().min(1).max(80),
  url: httpUrl,
});

export const statusSchema = z
  .object({
    botId: botIdSchema,
    name: z.string().trim().min(1).max(80),
    title: optionalText(120),
    status: z.enum(["working", "idle", "waiting_on_orel", "blocked", "error"]),
    summary: z.string().trim().min(1).max(280),
    lastDone: optionalText(500),
    nextUp: optionalText(500),
    needsOrel: z.array(needsItemSchema).max(20).optional(),
    links: z.array(linkSchema).max(10).optional(),
    updatedAt: timestamp.optional(),
  })
  .superRefine((value, ctx) => {
    const ids = (value.needsOrel ?? []).map((item) => item.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({ code: "custom", message: "needsOrel ids must be unique", path: ["needsOrel"] });
    }
  });

export const batchSchema = z.object({
  bots: z.array(statusSchema).min(1).max(50),
});

export const loginSchema = z.object({
  username: z.string().min(1).max(80),
  password: z.string().min(1).max(200),
});

export const actionSchema = z
  .object({
    botId: z.string().regex(/^(all|[a-zA-Z0-9][a-zA-Z0-9_-]{0,63})$/, "Invalid bot id"),
    type: z.enum(["approve", "reject", "message", "refresh"]),
    itemId: botIdSchema.optional(),
    text: optionalText(2000),
  })
  .superRefine((value, ctx) => {
    if (value.type === "message" && !value.text) {
      ctx.addIssue({ code: "custom", message: "Message text is required", path: ["text"] });
    }
    if ((value.type === "approve" || value.type === "reject") && !value.itemId) {
      ctx.addIssue({ code: "custom", message: "itemId is required", path: ["itemId"] });
    }
  });

export const ackSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,80}$/, "Invalid id"),
  result: optionalText(2000),
});

export const storedBotSchema = z.object({
  botId: botIdSchema,
  name: z.string().min(1).max(80),
  title: z.string().max(120).optional(),
  status: z.enum(["working", "idle", "waiting_on_orel", "blocked", "error"]),
  summary: z.string().min(1).max(280),
  lastDone: z.string().max(500).optional(),
  nextUp: z.string().max(500).optional(),
  needsOrel: z.array(needsItemSchema).max(20).default([]),
  links: z.array(linkSchema).max(10).default([]),
  updatedAt: timestamp,
});

export const storedEventSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,80}$/),
  botId: botIdSchema,
  name: z.string(),
  status: z.enum(["working", "idle", "waiting_on_orel", "blocked", "error"]),
  summary: z.string(),
  at: timestamp,
});

export const storedActionSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,80}$/),
  botId: z.string().regex(/^(all|[a-zA-Z0-9][a-zA-Z0-9_-]{0,63})$/),
  type: z.enum(["approve", "reject", "message", "refresh"]),
  itemId: botIdSchema.optional(),
  text: z.string().max(2000).optional(),
  status: z.enum(["pending", "delivered", "handled"]),
  createdAt: timestamp,
  deliveredAt: timestamp.optional(),
  handledAt: timestamp.optional(),
  resultNote: z.string().max(2000).optional(),
  deliveryError: z.string().max(200).optional(),
});

export type StatusInput = z.infer<typeof statusSchema>;
export type ActionInput = z.infer<typeof actionSchema>;

export const formatIssues = (error: z.ZodError): { path: string; message: string }[] =>
  error.issues.slice(0, 20).map((issue) => ({
    path: issue.path.map(String).join("."),
    message: issue.message,
  }));

export const toBotRecord = (input: StatusInput, now = new Date().toISOString()) => ({
  botId: input.botId,
  name: input.name,
  title: input.title,
  status: input.status,
  summary: input.summary,
  lastDone: input.lastDone,
  nextUp: input.nextUp,
  needsOrel: input.needsOrel ?? [],
  links: input.links ?? [],
  updatedAt: input.updatedAt ?? now,
});
