import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
import React from "react";
import { useUser } from "@/context/UserContext";
import { useBudget, Statement } from "@/context/BudgetProvider";

export default function SheetDetail() {
  const { user } = useUser();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const idNum = Number(id);

  const { sheets, statementsBySheet } = useBudget();
  const sheet = sheets.find((s) => s.Id === idNum);

  const [items, setItems] = useState<Statement[]>(statementsBySheet[idNum] || []);
  const [sort, setSort] = useState<"asc" | "desc" | "type" | "alpha">("desc");
  const [search, setSearch] = useState("");

  const totalRevenus = items.filter((i) => i.Value > 0).reduce((s, i) => s + i.Value, 0);
  const totalDepenses = items.filter((i) => i.Value < 0).reduce((s, i) => s + i.Value, 0);
  const solde = totalRevenus + totalDepenses;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 10 }}>
          <Image
            source={
              user === "Natacha"
                ? require("../../../assets/images/natacha-dentz.jpg")
                : require("../../../assets/images/fabian-terf.jpg")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, user]);

  function supprimer(index: number) {
    Alert.alert("Supprimer", "Voulez-vous vraiment supprimer cette opération ?", [
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
    ]);
  }

  // 🔍 FILTRE DE RECHERCHE
  const filteredItems = items.filter((i) => {
    const q = search.toLowerCase();
    return (
      i.Label.toLowerCase().includes(q) ||
      i.Value.toString().includes(q)
    );
  });

  // 🔧 TRI
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sort === "asc") return a.Value - b.Value;
    if (sort === "desc") return b.Value - a.Value;
    if (sort === "type") return (a.Value >= 0 ? -1 : 1) - (b.Value >= 0 ? -1 : 1);
    if (sort === "alpha") return a.Label.localeCompare(b.Label);
    return 0;
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: sheet?.Label || "Détail du mois",
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

        {/* Résumé */}
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

        {/* 🔍 BARRE DE RECHERCHE */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#0A3D62" />
          <TextInput
            placeholder="Rechercher une opération..."
            placeholderTextColor="#7A9BBE"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color="#C0392B" />
            </TouchableOpacity>
          )}
        </View>

        {/* TRI */}
        <View style={styles.sortRow}>
          <TouchableOpacity onPress={() => setSort("desc")} style={styles.sortBtn}>
            <Text style={styles.sortText}>Montant ↓</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSort("asc")} style={styles.sortBtn}>
            <Text style={styles.sortText}>Montant ↑</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSort("type")} style={styles.sortBtn}>
            <Text style={styles.sortText}>Type</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSort("alpha")} style={styles.sortBtn}>
            <Text style={styles.sortText}>A → Z</Text>
          </TouchableOpacity>
        </View>

        {/* LISTE */}
        {sortedItems.map((item, index) => (
          <View key={index} style={styles.row}>

            {/* En-tête */}
            <View style={styles.rowHeader}>
              <Text style={styles.label} numberOfLines={5}>
                {item.Label}
              </Text>

              <View
                style={[
                  styles.badge,
                  item.Value >= 0 ? styles.badgePos : styles.badgeNeg,
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.Value >= 0 ? "Entrée" : "Sortie"}
                </Text>
              </View>
            </View>

            {/* Montant */}
            <View style={styles.rowContent}>
              <Text
                style={[
                  styles.value,
                  item.Value >= 0 ? styles.pos : styles.neg,
                ]}
              >
                {item.Value.toFixed(2)} €
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Link href={`/sheet/${id}/edit/${index}`} asChild>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="create-outline" size={22} color="#0A3D62" />
                </TouchableOpacity>
              </Link>

              <TouchableOpacity style={styles.iconBtn} onPress={() => supprimer(index)}>
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

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#0A3D62",
  },

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

  /* 🔍 Recherche */
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D0E2FF",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#0A3D62",
  },

  /* TRI */
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sortBtn: {
    backgroundColor: "#D0E2FF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  sortText: {
    color: "#0A3D62",
    fontWeight: "600",
    fontSize: 12,
  },

  /* Lignes */
  row: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D0E2FF",
  },

  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },

  label: {
    flex: 1,
    fontSize: 16,
    color: "#1B4F72",
    fontWeight: "600",
    paddingRight: 10,
  },

  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgePos: {
    backgroundColor: "#D6F5E3",
  },
  badgeNeg: {
    backgroundColor: "#F8D7DA",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1B4F72",
  },

  rowContent: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },

  value: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "right",
    minWidth: 80,
  },

  pos: {
    color: "#27AE60",
  },
  neg: {
    color: "#C0392B",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  iconBtn: {
    padding: 6,
  },
});
