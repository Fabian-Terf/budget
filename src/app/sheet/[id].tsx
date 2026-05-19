import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { sheets } from "../../../data/sheets";
import { statements } from "../../../data/statements";

export default function SheetDetail() {
  const { id } = useLocalSearchParams();
  const idNum = Number(id);

  const sheet = sheets.find((s) => s.id === idNum);

  // Copie locale pour pouvoir supprimer
  const [items, setItems] = useState(statements[idNum] || []);

  const totalRevenus = items
    .filter((i) => i.value > 0)
    .reduce((sum, i) => sum + i.value, 0);

  const totalDepenses = items
    .filter((i) => i.value < 0)
    .reduce((sum, i) => sum + i.value, 0);

  const solde = totalRevenus + totalDepenses;

  function supprimer(index: number) {
    Alert.alert(
      "Supprimer",
      "Voulez-vous vraiment supprimer cette opération ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const copie = [...items];
            copie.splice(index, 1);
            setItems(copie);
          },
        },
      ]
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: sheet?.label || "Détail du mois",
        }}
      />

      <ScrollView style={styles.container}>
        {/* Bouton Ajouter */}
        <Link href={`/sheet/${id}/add`} asChild>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.addButtonText}>Ajouter une opération</Text>
          </TouchableOpacity>
        </Link>

        {/* Récapitulatif */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLine}>
            Entrées : <Text style={styles.pos}>{totalRevenus.toFixed(2)} €</Text>
          </Text>

          <Text style={styles.summaryLine}>
            Sorties : <Text style={styles.neg}>{totalDepenses.toFixed(2)} €</Text>
          </Text>

          <Text style={styles.summaryLine}>
            Solde :{" "}
            <Text style={solde >= 0 ? styles.pos : styles.neg}>
              {solde.toFixed(2)} €
            </Text>
          </Text>
        </View>

        {/* Liste des opérations */}
        {items.map((item, index) => (
          <View key={index} style={styles.row}>

            {/* Description + montant aligné à droite */}
            <View style={styles.leftPart}>
              <Text style={styles.label}>{item.label}</Text>

              <Text
                style={[
                  styles.value,
                  item.value >= 0 ? styles.pos : styles.neg,
                  styles.amountRight
                ]}
              >
                {item.value.toFixed(2)} €
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Link href={`/sheet/${id}/edit/${index}`} asChild>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="create-outline" size={22} color="#0A3D62" />
                </TouchableOpacity>
              </Link>

              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => supprimer(index)}
              >
                <Ionicons name="trash-outline" size={22} color="#C0392B" />
              </TouchableOpacity>
            </View>

          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F1FF",
  },
  monthTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 20,
    textAlign: "center",
  },

  /* Bouton Ajouter */
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A3D62",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  /* Récapitulatif */
  summaryBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#D0E2FF",
  },
  summaryLine: {
    fontSize: 16,
    color: "#1B4F72",
    fontWeight: "600",
    marginBottom: 6,
  },

  /* Liste */
  row: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D0E2FF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  /* Description + montant */
  leftPart: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  amountRight: {
    flex: 1,
    textAlign: "right",
  },

  label: {
    fontSize: 16,
    color: "#1B4F72",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
  },
  pos: {
    color: "#27AE60",
  },
  neg: {
    color: "#C0392B",
  },

  /* Actions */
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  iconBtn: {
    padding: 6,
  },
});
