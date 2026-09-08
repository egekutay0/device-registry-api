import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

const CSV_PATH = "data/devices.csv";
const JSON_PATH = "data/devices.json";

const ARRAY_COLUMNS = new Set([
  "capabilities.inputs",
  "capabilities.outputs",
  "capabilities.codecs",
  "tags",
]);

const NUMBER_COLUMNS = new Set([
  "network.managementPort",
  "location.rackUnit",
  "display.width",
  "display.height",
  "display.refreshRate",
]);

const BOOLEAN_COLUMNS = new Set([
  "network.dhcp",
  "status.online",
  "enabled",
]);

function convertValue(column: string, raw: string): unknown {
  if (ARRAY_COLUMNS.has(column)) {
    return raw === "" ? [] : raw.split("|");
  }

  if (NUMBER_COLUMNS.has(column)) {
    return Number(raw);
  }

  if (BOOLEAN_COLUMNS.has(column)) {
    return raw === "true";
  }

  if (column === "status.lastSeenAt") {
    return raw === "" ? null : raw;
  }

  return raw;
}

function setNested(
  target: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const parts = path.split(".");
  let current = target;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i] as string;

    if (current[key] === undefined) {
      current[key] = {};
    }

    current = current[key] as Record<string, unknown>;
  }

  current[parts[parts.length - 1] as string] = value;
}

const csvText = readFileSync(CSV_PATH, "utf-8");

const rows: Record<string, string>[] = parse(csvText, {
  columns: true,
  delimiter: ";",
  skip_empty_lines: true,
  trim: true,
});

const devices = rows.map((row) => {
  const device: Record<string, unknown> = {};

  for (const [column, raw] of Object.entries(row)) {
    setNested(device, column, convertValue(column, raw));
  }

  return device;
});

writeFileSync(JSON_PATH, JSON.stringify({ devices }, null, 2), "utf-8");

console.log(`${devices.length} cihaz JSON'a cevrildi -> ${JSON_PATH}`);