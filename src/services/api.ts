const API_BASE = "http://localhost:5000/api"; // ← remplace par ton IP locale

export async function getSheets() {
  const response = await fetch(`${API_BASE}/sheets`);
  if (!response.ok) throw new Error("Erreur API sheets");
  return response.json();
}

export async function getStatements(sheetId: number) {
  const response = await fetch(`${API_BASE}/statements/${sheetId}`);
  if (!response.ok) throw new Error("Erreur API statements");
  return response.json();
}
