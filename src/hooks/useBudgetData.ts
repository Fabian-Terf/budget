import { useEffect, useState } from "react";
import { loadBudget } from "@/lib/budgetLoader";

export function useBudgetData() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadBudget().then(setData);
  }, []);

  return data;
}
