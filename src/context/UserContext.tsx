// context/UserContext.tsx
import { createContext, useContext, useState } from "react";

const UserContext = createContext<any>(null);

export function UserProvider({ children }: any) {
  const [user, setUser] = useState<"Natacha" | "Fabian" | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  return (
    <UserContext.Provider value={{ user, setUser, year, setYear }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
