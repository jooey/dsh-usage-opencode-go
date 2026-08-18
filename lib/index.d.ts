/**
 * dsh-usage-opencode-go host face type declaration.
 *
 * The loader consumes the Cordis plugin contract ({ name, inject, apply }).
 * Core logic re-exports are safe to import in tooling; the dependency-free
 * sources also live in ./logic (see lib/logic.js for exact behavior).
 */

import type { Context } from "@deepseek-ai/cordis";
import type { CredentialRef } from "@deepseek-ai/dsh-credentials";

export const name: string;
export const inject: string[];
export const API_KEY_REF: string;
export const REFERRAL_URL: string;
export const USAGE_URL: string;

export interface FetchUsageResult {
  ok: boolean;
  usage?: Record<string, {
    status?: string;
    percent?: number;
    resetsAt?: string;
  }>;
  error?: string;
}

export interface OpencodeUsageWindow {
  percent: number | null;
  resetsAt: string | null;
}

export interface OpencodeUsageSnapshot {
  rolling: OpencodeUsageWindow | null;
  weekly: OpencodeUsageWindow | null;
  monthly: OpencodeUsageWindow | null;
}

export declare function apply(ctx: Context): Promise<void>;
export declare function fetchUsage(ctx: Context): Promise<FetchUsageResult>;
export declare function formatPercent(value: unknown): string;
export declare function formatUsages(usage: unknown): string;
export declare function fetchUsageSnapshot(credentials: {
  resolve(ref: CredentialRef): Promise<{ value: string; source?: string } | undefined>;
}): Promise<OpencodeUsageSnapshot>;

export declare class OpencodeUsageGateway {
  static inject: string[];
  constructor(ctx: Context);
  snapshot(): Promise<OpencodeUsageSnapshot>;
}
