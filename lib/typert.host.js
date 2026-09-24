/* Host-face Typert manifest for dsh-usage-opencode-go (hand-written). */
import z from "zod";

const opencodeUsageSnapshotResult$schema = z.object({
  rolling: z.object({
    percent: z.number().nullable(),
    resetsAt: z.string().nullable()
  }).nullable(),
  weekly: z.object({
    percent: z.number().nullable(),
    resetsAt: z.string().nullable()
  }).nullable(),
  monthly: z.object({
    percent: z.number().nullable(),
    resetsAt: z.string().nullable()
  }).nullable()
});

export const TYPERT = {
  package: "dsh-usage-opencode-go",
  face: "host",
  schemas: [],
  invocations: [
    {
      id: "dsh-usage-opencode-go#opencodeUsage/snapshot",
      service: "opencodeUsage",
      namespace: "opencodeUsage",
      method: "snapshot",
      invocation: { kind: "direct" },
      parameters: [],
      result: {
        mode: "strict",
        typeSymbol: "dsh-usage-opencode-go/types#OpencodeUsageSnapshot",
        schema: opencodeUsageSnapshotResult$schema,
        create: () => opencodeUsageSnapshotResult$schema
      },
      sourceLocation: { file: "lib/index.js", line: 1, column: 1 }
    }
  ],
  model: {
    services: [],
    events: [],
    objects: []
  }
};

export default TYPERT;
