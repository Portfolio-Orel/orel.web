import { describe, expect, it } from "vitest";
import { actionSchema, batchSchema, statusSchema } from "@/lib/schemas";

const validStatus = {
  botId: "jarvis",
  name: "Jarvis",
  title: "Head of Growth",
  status: "working",
  summary: "Drafting the Tuesday memo.",
  lastDone: "Shipped the Monday digest.",
  nextUp: "Wait for approval.",
  needsOrel: [
    {
      id: "memo",
      title: "Send the Tuesday memo?",
      detail: "It is ready in the draft folder.",
      link: "https://example.com/memo",
      kind: "approval",
    },
  ],
  links: [{ label: "Draft", url: "https://example.com/draft" }],
  updatedAt: "2026-11-12T08:00:00.000Z",
};

describe("ingest validation", () => {
  it("accepts a status payload", () => {
    const parsed = statusSchema.safeParse(validStatus);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.needsOrel?.[0]?.kind).toBe("approval");
  });

  it("rejects an unknown status, a bad id, and a non-http link", () => {
    expect(statusSchema.safeParse({ ...validStatus, status: "online" }).success).toBe(false);
    expect(statusSchema.safeParse({ ...validStatus, botId: "../etc" }).success).toBe(false);
    expect(statusSchema.safeParse({ ...validStatus, summary: "  " }).success).toBe(false);
    expect(
      statusSchema.safeParse({
        ...validStatus,
        links: [{ label: "Bad", url: "javascript:alert(1)" }],
      }).success,
    ).toBe(false);
  });

  it("rejects duplicate attention ids", () => {
    const parsed = statusSchema.safeParse({
      ...validStatus,
      needsOrel: [
        { id: "memo", title: "One", kind: "approval" },
        { id: "memo", title: "Two", kind: "fyi" },
      ],
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts a batch and rejects an empty one", () => {
    expect(batchSchema.safeParse({ bots: [validStatus, { ...validStatus, botId: "notes-bob", name: "Notes Bob" }] }).success).toBe(
      true,
    );
    expect(batchSchema.safeParse({ bots: [] }).success).toBe(false);
    expect(batchSchema.safeParse({ bots: Array.from({ length: 51 }, () => validStatus) }).success).toBe(false);
  });

  it("requires a note for messages and an item for decisions", () => {
    expect(actionSchema.safeParse({ botId: "all", type: "refresh" }).success).toBe(true);
    expect(actionSchema.safeParse({ botId: "jarvis", type: "message", text: "Hold the memo." }).success).toBe(true);
    expect(actionSchema.safeParse({ botId: "jarvis", type: "message" }).success).toBe(false);
    expect(actionSchema.safeParse({ botId: "jarvis", type: "approve" }).success).toBe(false);
    expect(actionSchema.safeParse({ botId: "jarvis", type: "approve", itemId: "memo" }).success).toBe(true);
    expect(actionSchema.safeParse({ botId: "../jarvis", type: "refresh" }).success).toBe(false);
  });
});
