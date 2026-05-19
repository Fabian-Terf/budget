import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { sheets } from "../../data/sheets";
import { statements } from "../../data/statements";

export default function BudgetIndex() {
  const [mode, setMode] = useState<"simple" | "compact" | "detail">("simple");

  return (
    <View style={styles.container}>
      {/* Toggle simple / compact / détaillé */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === "simple" && styles.toggleActive]}
          onPress={() => setMode("simple")}
        >
          <Text style={styles.toggleText}>Simple</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, mode === "compact" && styles.toggleActive]}
          onPress={() => setMode("compact")}
        >
          <Text style={styles.toggleText}>Compact</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, mode === "detail" && styles.toggleActive]}
          onPress={() => setMode("detail")}
        >
          <Text style={styles.toggleText}>Détaillé</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des mois */}
      {sheets.map((sheet) => {
        const items = statements[sheet.id] || [];

        const totalRevenus = items
          .filter((i) => i.value > 0)
          .reduce((sum, i) => sum + i.value, 0);

        const totalDepenses = items
          .filter((i) => i.value < 0)
          .reduce((sum, i) => sum + i.value, 0);

        const solde = totalRevenus + totalDepenses;

        return (
          <Link
            key={sheet.id}
            href={{ pathname: "/sheet/[id]", params: { id: sheet.id.toString() } }}
            asChild
          >
            <TouchableOpacity style={styles.item}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color="#0A3D62"
                style={styles.icon}
              />

              <View style={{ flex: 1 }}>
                {/* Toujours afficher le mois */}
                <Text style={styles.label}>{sheet.label}</Text>

                {/* Mode compact → solde uniquement */}
                {mode === "compact" && (
                  <Text style={styles.compactSolde}>
                    <Text style={solde >= 0 ? styles.pos : styles.neg}>
                      {solde.toFixed(2)} €
                    </Text>
                  </Text>
                )}

                {/* Mode détaillé → tout */}
                {mode === "detail" && (
                  <>
                    <Text style={styles.resume}>
                      Revenus :{" "}
                      <Text style={styles.pos}>
                        {totalRevenus.toFixed(2)} €
                      </Text>
                    </Text>

                    <Text style={styles.resume}>
                      Dépenses :{" "}
                      <Text style={styles.neg}>
                        {totalDepenses.toFixed(2)} €
                      </Text>
                    </Text>

                    <Text style={styles.resume}>
                      Solde :{" "}
                      <Text style={solde >= 0 ? styles.pos : styles.neg}>
                        {solde.toFixed(2)} €
                      </Text>
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F1FF",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#0A3D62",
  },

  /* Toggle */
  toggleRow: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "center",
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#D0E2FF",
    marginHorizontal: 6,
  },
  toggleActive: {
    backgroundColor: "#0A3D62",
  },
  toggleText: {
    color: "white",
    fontWeight: "600",
  },

  /* Items */
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D0E2FF",
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  label: {
    fontSize: 18,
    color: "#1B4F72",
    fontWeight: "700",
    marginBottom: 6,
  },

  /* Compact */
  compactSolde: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B4F72",
  },

  /* Détail */
  resume: {
    fontSize: 14,
    color: "#1B4F72",
  },
  pos: {
    color: "#27AE60",
    fontWeight: "700",
  },
  neg: {
    color: "#C0392B",
    fontWeight: "700",
  },
});
