import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { sheets } from "../../../data/sheets";
import { statements } from "../../../data/statements";

export default function SheetPage() {
  const { id } = useLocalSearchParams();
  const sheetId = Number(id);

  const sheet = sheets.find((s) => s.id === sheetId);
  const items = statements[sheetId] || [];

  // Calculs
  const totalRevenus = items
    .filter((i) => i.value > 0)
    .reduce((sum, i) => sum + i.value, 0);

  const totalDepenses = items
    .filter((i) => i.value < 0)
    .reduce((sum, i) => sum + i.value, 0);

  const solde = totalRevenus + totalDepenses;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sheet?.label}</Text>

      {/* Totaux */}
      <View style={styles.totalsBox}>
        <Text style={styles.totalLabel}>Revenus :</Text>
        <Text style={styles.totalValuePos}>{totalRevenus.toFixed(2)} €</Text>

        <Text style={styles.totalLabel}>Dépenses :</Text>
        <Text style={styles.totalValueNeg}>{totalDepenses.toFixed(2)} €</Text>

        <Text style={styles.totalLabel}>Solde :</Text>
        <Text
          style={[
            styles.totalValue,
            solde >= 0 ? styles.totalValuePos : styles.totalValueNeg,
          ]}
        >
          {solde.toFixed(2)} €
        </Text>
      </View>

      {/* Liste des statements */}
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.label}>{item.label}</Text>
          <Text
            style={[
              styles.value,
              item.value < 0 && styles.negative
            ]}
          >
            {item.value} €
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#E8F1FF" },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#0A3D62",
  },

  totalsBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B4F72",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  totalValuePos: {
    color: "#27AE60",
  },
  totalValueNeg: {
    color: "#C0392B",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: { fontSize: 16, color: "#1B4F72" },
  value: { fontSize: 16, fontWeight: "600", color: "#0A3D62" },
  negative: { color: "#C0392B" },
});
