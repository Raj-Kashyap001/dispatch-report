import * as XLSX from "xlsx";

self.onmessage = async (e: MessageEvent<{ file: File }>) => {
  const { file } = e.data;

  try {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "array" });

    if (wb.SheetNames.length === 0) {
      self.postMessage({ type: "error", error: "Excel file contains no sheets" });
      return;
    }

    const ws = wb.Sheets[wb.SheetNames[0]];
    const raw: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    let headerIdx = -1;
    for (let i = 0; i < Math.min(10, raw.length); i++) {
      const cells = raw[i].map((c) => String(c ?? "").toLowerCase().trim());
      if (cells.includes("alert") || cells.includes("trip no")) {
        headerIdx = i;
        break;
      }
    }

    if (headerIdx === -1) {
      self.postMessage({ type: "error", error: "Could not find header row in Excel" });
      return;
    }

    const headers = raw[headerIdx] as string[];
    const rows = raw.slice(headerIdx + 1)
      .filter((row) => row.some((c) => String(c ?? "").trim() !== ""))
      .map((row) => {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[String(h)] = String((row as unknown[])[i] ?? "");
        });
        return obj;
      });

    self.postMessage({ type: "done", data: rows });
  } catch (err) {
    self.postMessage({
      type: "error",
      error: `Failed to read Excel: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
};
