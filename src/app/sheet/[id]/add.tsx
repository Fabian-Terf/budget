import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useBudget } from "@/context/BudgetProvider";

export default function AddOperation() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const idNum = Number(id);

  const { sheets, statementsBySheet } = useBudget();

  const sheet = sheets.find((s) => s.Id === idNum);

  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  function ajouter() {
    if (!label.trim() || !value.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    const montant = Number(value.replace(",", "."));
    if (isNaN(montant)) {
      Alert.alert("Erreur", "Le montant n'est pas valide.");
      return;
    }

    // ⚠️ On ne modifie pas le provider ici (pas de persistance)
    // On revient simplement à la page du mois
    router.back();
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: sheet?.Label
            ? `Ajouter (${sheet.Label})`
            : "Ajouter une opération",
        }}
      />

      <View style={styles.container}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Salaire, Courses..."
          value={label}
          onChangeText={setLabel}
        />

        <Text style={styles.label}>Montant (€)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 1200 ou -45.90"
          keyboardType="numeric"
          value={value}
          onChangeText={setValue}
        />

        <TouchableOpacity style={styles.addButton} onPress={ajouter}>
          <Ionicons name="checkmark-circle-outline" size={24} color="white" />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F1FF",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B4F72",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0E2FF",
    marginBottom: 20,
    fontSize: 16,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A3D62",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  cancelButton: {
    alignItems: "center",
    padding: 10,
  },
  cancelText: {
    color: "#C0392B",
    fontSize: 16,
    fontWeight: "600",
  },
});
