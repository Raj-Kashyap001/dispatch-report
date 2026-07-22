import Papa from "papaparse";

self.onmessage = async (e: MessageEvent<{ file: File }>) => {
  const { file } = e.data;

  try {
    const text = await file.text();
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        self.postMessage({ type: "done", data: result.data });
      },
      error: (err: { message: string }) => {
        self.postMessage({ type: "error", error: `CSV parse error: ${err.message}` });
      },
    });
  } catch (err) {
    self.postMessage({
      type: "error",
      error: `Failed to read CSV: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
};
