import { loadCsv } from "./csvLoader";

import sheetsCsv from "../../assets/data/sheets.csv";
import statementsCsv from "../../assets/data/statements.csv";


export async function loadBudget() {
  const sheets = await loadCsv(sheetsCsv);
  const statements = await loadCsv(statementsCsv);

  const statementsBySheet: Record<number, any[]> = {};

  statements.forEach((s: any) => {
    if (!statementsBySheet[s.SheetId]) {
      statementsBySheet[s.SheetId] = [];
    }
    statementsBySheet[s.SheetId].push(s);
  });

  return { sheets, statementsBySheet };
}
