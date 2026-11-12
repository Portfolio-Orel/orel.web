export const BOT_STATUSES = ["working", "idle", "waiting_on_orel", "blocked", "error"] as const;

export type BotStatus = (typeof BOT_STATUSES)[number];

export const NEED_KINDS = ["approval", "question", "fyi"] as const;

export type NeedKind = (typeof NEED_KINDS)[number];

export const ACTION_TYPES = ["approve", "reject", "message", "refresh"] as const;

export type ActionType = (typeof ACTION_TYPES)[number];

export const ACTION_STATUSES = ["pending", "delivered", "handled"] as const;

export type ActionStatus = (typeof ACTION_STATUSES)[number];

export type NeedsOrelItem = {
  id: string;
  title: string;
  detail?: string;
  link?: string;
  kind: NeedKind;
};

export type BotLink = {
  label: string;
  url: string;
};

export type BotRecord = {
  botId: string;
  name: string;
  title?: string;
  status: BotStatus;
  summary: string;
  lastDone?: string;
  nextUp?: string;
  needsOrel: NeedsOrelItem[];
  links: BotLink[];
  updatedAt: string;
};

export type HistoryEvent = {
  id: string;
  botId: string;
  name: string;
  status: BotStatus;
  summary: string;
  at: string;
};

export type ActionRecord = {
  id: string;
  botId: string;
  type: ActionType;
  itemId?: string;
  text?: string;
  status: ActionStatus;
  createdAt: string;
  deliveredAt?: string;
  handledAt?: string;
  resultNote?: string;
  deliveryError?: string;
};

export type ActionPatch = Partial<
  Pick<ActionRecord, "status" | "deliveredAt" | "handledAt" | "resultNote" | "deliveryError">
>;

export type FloorSnapshot = {
  bots: BotRecord[];
  events: HistoryEvent[];
  actions: ActionRecord[];
  serverTime: string;
};
