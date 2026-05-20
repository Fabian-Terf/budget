import { createContext, useContext, useState } from 'react';

type User = 'Natacha' | 'Fabian' | null;

const UserContext = createContext({
  user: null as User,
  setUser: (u: User) => {},
});

export function UserProvider({ children }: any) {
  const [user, setUser] = useState<User>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
