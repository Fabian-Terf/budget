import { Stack } from "expo-router";
import { UserProvider } from "../context/UserContext";

export default function Layout() {
  return (
    <UserProvider>
       <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#E8F1FF",
            },
            headerTintColor: "#0A3D62",
            headerTitleStyle: {
              fontWeight: "700",
              fontSize: 20,
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{ title: "Choix utilisateur" }}
          />

          <Stack.Screen
            name="budget/index"
            options={{ title: "Budget annuel" }}
          />

          <Stack.Screen
            name="sheet/[id]"
            options={{ title: "Détail du mois" }}
          />
        </Stack>
    </UserProvider>
  );
}
