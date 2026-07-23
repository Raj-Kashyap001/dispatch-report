import type { WorkerMessage } from "../types/worker";

export const spawnWorker = (
  WorkerConstructor: new () => Worker,
  file: File
): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const worker = new WorkerConstructor();

    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
      if (e.data.type === "done") {
        resolve(e.data.data);
        worker.terminate();
      }
      if (e.data.type === "error") {
        reject(new Error(e.data.error));
        worker.terminate();
      }
    };

    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };

    worker.postMessage({ file });
  });
