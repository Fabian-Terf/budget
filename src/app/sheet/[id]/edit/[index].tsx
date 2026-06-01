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
import { getSheets, getStatements } from "../../../../services/api";

export default function EditOperation() {
  const { year } = useUser();

  const router = useRouter();
  const { id, index } = useLocalSearchParams();

  const idNum = Number(id);
  const indexNum = Number(index);

  const [sheet, setSheet] = useState<any>(null);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  // 🔥 Charger sheet + statements
  useEffect(() => {
    async function load() {
      try {
        const allSheets = await getSheets(year);
        const foundSheet = allSheets.find((s: any) => s.id === idNum);
        setSheet(foundSheet || null);

        const stmts = await getStatements(idNum);
        const selected = stmts[indexNum];

        setItem(selected || null);

        if (selected) {
          setLabel(selected.label);
          setValue(selected.value.toString());
        }
      } catch (err) {
        console.error("Erreur API edit.tsx :", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [idNum, indexNum]);

  function enregistrer() {
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
    Alert.alert("Succès", "L'opération a été modifiée (localement).");

    router.back();
  }

  if (loading || !item) {
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
            ? `Modifier (${sheet.label})`
            : "Modifier une opération",
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

        <TouchableOpacity style={styles.saveButton} onPress={enregistrer}>
          <Ionicons name="checkmark-circle-outline" size={24} color="white" />
          <Text style={styles.saveButtonText}>Enregistrer</Text>
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

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A3D62",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 20,
  },
  saveButtonText: {
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
