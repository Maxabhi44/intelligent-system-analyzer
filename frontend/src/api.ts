// Backend ka base URL
const BASE_URL = (import.meta.env?.VITE_API_URL as string) || "http://127.0.0.1:8000";

// Scan shuru karo
export async function startScan(path: string) {
  const res = await fetch(`${BASE_URL}/api/scan/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, max_depth: 5 }),
  });
  return res.json();
}

// Insights lo — junk, large, unused files
export async function getSummary(path: string) {
  const res = await fetch(`${BASE_URL}/api/insights/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  return res.json();
}

// File trash mein bhejo
export async function trashFile(file_path: string) {
  const res = await fetch(`${BASE_URL}/api/cleanup/trash`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_path }),
  });
  return res.json();
}

// File wapas lao
export async function undoTrash(trash_id: string) {
  const res = await fetch(`${BASE_URL}/api/cleanup/undo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trash_id }),
  });
  return res.json();
}

// Trash list dekho
export async function getTrashItems() {
  const res = await fetch(`${BASE_URL}/api/cleanup/trash`);
  return res.json();
}

// Saari junk files ek saath trash mein bhejo
export async function trashAllFiles(file_paths: string[]) {
  const results = await Promise.all(
    file_paths.map(path => trashFile(path))
  );
  return results;
}