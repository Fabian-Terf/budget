const API_BASE = "http://localhost:5000/api"; // ← remplace par ton IP locale si besoin

// ----------------------
// SHEETS
// ----------------------
export async function getSheets() {
  const response = await fetch(`${API_BASE}/sheets`);
  if (!response.ok) throw new Error("Erreur API sheets");
  return response.json();
}

// ----------------------
// STATEMENTS
// ----------------------
export async function getStatements(sheetId: number) {
  const response = await fetch(`${API_BASE}/statements/${sheetId}`);
  if (!response.ok) throw new Error("Erreur API statements");
  return response.json();
}

// 🔹 GET ONE
export async function getStatementById(id: number) {
  const response = await fetch(`${API_BASE}/statements/one/${id}`);
  if (!response.ok) throw new Error("Erreur API get statement by id");
  return response.json();
}

// 🔹 CREATE (POST)
export async function createStatement(statement: any) {
  const response = await fetch(`${API_BASE}/statements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(statement),
  });

  if (!response.ok) throw new Error("Erreur API create statement");
  return response.json();
}

// 🔹 UPDATE (PUT)
export async function updateStatement(id: number, statement: any) {
  const response = await fetch(`${API_BASE}/statements/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(statement),
  });

  if (!response.ok) throw new Error("Erreur API update statement");
  return response.json();
}

// 🔹 DELETE
export async function deleteStatement(id: number) {
  const response = await fetch(`${API_BASE}/statements/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Erreur API delete statement");
  return true;
}
