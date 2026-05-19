import { Stack } from "expo-router";

export default function Layout() {
  return (
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
      {/* Page d'accueil */}
      <Stack.Screen
        name="index"
        options={{
          title: "Budget annuel",
        }}
      />

      {/* Page d'un mois */}
      <Stack.Screen
        name="sheet/[id]"
        options={{
          title: "Détail du mois",
        }}
      />
    </Stack>
  );
}
