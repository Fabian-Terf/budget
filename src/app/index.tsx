import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { sheets } from "../../data/sheets";
import { statements } from "../../data/statements";
import { Ionicons } from "@expo/vector-icons";

export default function BudgetIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget — Mois disponibles</Text>

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
          <Link key={sheet.id} href={`/sheet/${sheet.id}`} asChild>
            <TouchableOpacity style={styles.item}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color="#0A3D62"
                style={styles.icon}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{sheet.label}</Text>

                <Text style={styles.resume}>
                  Revenus : <Text style={styles.pos}>{totalRevenus.toFixed(2)} €</Text>
                </Text>

                <Text style={styles.resume}>
                  Dépenses : <Text style={styles.neg}>{totalDepenses.toFixed(2)} €</Text>
                </Text>

                <Text style={styles.resume}>
                  Solde :{" "}
                  <Text style={solde >= 0 ? styles.pos : styles.neg}>
                    {solde.toFixed(2)} €
                  </Text>
                </Text>
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
