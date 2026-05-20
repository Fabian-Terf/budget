import React, { createContext, useContext, ReactNode } from "react";
import { useBudgetData } from "@/hooks/useBudgetData";

/* -----------------------------
   TYPES
------------------------------ */

export type Sheet = {
  Id: number;
  Label: string;
};

export type Statement = {
  Id: number;
  SheetId: number;
  Label: string;
  Value: number;
};

export type BudgetData = {
  sheets: Sheet[];
  statementsBySheet: Record<number, Statement[]>;
};

/* -----------------------------
   CONTEXTE
------------------------------ */

const BudgetContext = createContext<BudgetData | null>(null);

type BudgetProviderProps = {
  children: ReactNode;
};

/* -----------------------------
   PROVIDER
------------------------------ */

export function BudgetProvider({ children }: BudgetProviderProps) {
  const data = useBudgetData();

  // Pendant le chargement des CSV
  if (!data) return null;

  return (
    <BudgetContext.Provider value={data}>
      {children}
    </BudgetContext.Provider>
  );
}

/* -----------------------------
   HOOK D’ACCÈS
------------------------------ */

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error("useBudget must be used inside a BudgetProvider");
  }
  return ctx;
}
