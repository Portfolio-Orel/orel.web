type Bucket = {
  failures: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const LOGIN_MAX_FAILURES = 8;
export const LOGIN_FAILURE_DELAY_MS = 700;

export const rateLimitStatus = (
  key: string,
  now = Date.now(),
): { limited: boolean; retryAfter: number } => {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) return { limited: false, retryAfter: 0 };
  if (bucket.failures < LOGIN_MAX_FAILURES) return { limited: false, retryAfter: 0 };
  return { limited: true, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
};

export const recordFailure = (key: string, now = Date.now()): void => {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { failures: 1, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }
  bucket.failures += 1;
  if (buckets.size > 5000) {
    for (const [entryKey, entry] of buckets) {
      if (entry.resetAt <= now) buckets.delete(entryKey);
    }
  }
};

export const clearFailures = (key: string): void => {
  buckets.delete(key);
};

export const resetRateLimits = (): void => {
  buckets.clear();
};

export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
