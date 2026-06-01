import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getSheets } from "../../../services/api";

export default function AddOperation() {
  const { year } = useUser();

  const router = useRouter();
  const { id } = useLocalSearchParams();
  const idNum = Number(id);

  const [sheet, setSheet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  // 🔥 Charger le sheet depuis l’API
  useEffect(() => {
    async function load() {
      try {
        const allSheets = await getSheets(year);
        const found = allSheets.find((s: any) => s.id === idNum);
        setSheet(found || null);
      } catch (err) {
        console.error("Erreur API add.tsx :", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [idNum]);

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

    // ⚠️ Pas encore de persistance API
    // On reviendra ici quand tu voudras ajouter POST /statements
    Alert.alert("Succès", "L'opération a été ajoutée (localement).");

    router.back();
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0A3D62" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: sheet?.label
            ? `Ajouter (${sheet.label})`
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
