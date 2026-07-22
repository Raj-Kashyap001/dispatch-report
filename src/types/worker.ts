export interface WorkerMessage {
  type: "progress" | "done" | "error";
  progress?: number;
  data?: unknown;
  error?: string;
}
