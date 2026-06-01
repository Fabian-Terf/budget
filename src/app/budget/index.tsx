import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getSheets, getStatements } from "../../services/api";

export type ApiSheet = {
  id: number;
  label: string;
  year: number;
  userId: number;
  deleted: number;
  creationTime: string;
};

export type ApiStatement = {
  id: number;
  sheetId: number;
  label: string;
  value: number;
  userId: number;
  deleted: number;
  creationTime: string;
};

export default function BudgetIndex() {
  const { user } = useUser();
  const { year } = useUser();

  const [sheets, setSheets] = useState<ApiSheet[]>([]);
  const [statements, setStatements] = useState<Record<number, ApiStatement[]>>({});

  const [loadingSheets, setLoadingSheets] = useState(true);
  const [loadingStatements, setLoadingStatements] = useState(true);

  const [mode, setMode] = useState<"simple" | "compact" | "detail">("simple");
  const [sort, setSort] = useState<"asc" | "desc" | "alpha">("desc");

  const navigation = useNavigation();

  // 🔥 Charger les sheets depuis l’API
  useEffect(() => {
    async function load() {
      try {
        const data = await getSheets(year);
        setSheets(data);
      } catch (err) {
        console.error("Erreur API sheets :", err);
      } finally {
        setLoadingSheets(false);
      }
    }
    load();
  }, []);

  // 🔥 Charger les statements pour chaque sheet
  useEffect(() => {
    if (sheets.length === 0) return;

    async function loadStatements() {
      const result: any = {};

      for (const s of sheets) {
        try {
          result[s.id] = await getStatements(s.id);
        } catch (err) {
          console.error("Erreur API statements :", err);
        }
      }

      setStatements(result);
      setLoadingStatements(false);
    }

    loadStatements();
  }, [sheets]);

  // Avatar dans le header
  useEffect(() => {
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

  // TRI DES MOIS
  const sortedSheets = [...sheets].sort((a, b) => {
    if (sort === "alpha") return a.label.localeCompare(b.label);
    if (sort === "asc") return a.id - b.id;
    if (sort === "desc") return b.id - a.id;
    return 0;
  });

  if (loadingSheets || loadingStatements) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0A3D62" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

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

      {/* TRI */}
      <View style={styles.sortRow}>
        <TouchableOpacity onPress={() => setSort("desc")} style={styles.sortBtn}>
          <Text style={styles.sortText}>Récents ↓</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSort("asc")} style={styles.sortBtn}>
          <Text style={styles.sortText}>Anciens ↑</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSort("alpha")} style={styles.sortBtn}>
          <Text style={styles.sortText}>A → Z</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des mois */}
      {sortedSheets.map((sheet) => {
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

              {/* En-tête */}
              <View style={styles.rowHeader}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="calendar-outline"
                    size={22}
                    color="#0A3D62"
                    style={styles.icon}
                  />
                  <Text style={styles.label}>{sheet.label}</Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    solde >= 0 ? styles.badgePos : styles.badgeNeg,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {solde >= 0 ? "Positif" : "Négatif"}
                  </Text>
                </View>
              </View>

              {/* Mode simple */}
              {mode === "simple" && (
                <Text
                  style={[
                    styles.soldeSimple,
                    solde >= 0 ? styles.pos : styles.neg,
                  ]}
                >
                  {solde.toFixed(2)} €
                </Text>
              )}

              {/* Mode compact */}
              {mode === "compact" && (
                <View style={styles.compactRow}>
                  <Text style={styles.resume}>
                    <Text style={styles.pos}>{totalRevenus.toFixed(2)} €</Text>
                  </Text>

                  <Text style={styles.resume}>
                    <Text style={styles.neg}>{totalDepenses.toFixed(2)} €</Text>
                  </Text>

                  <Text
                    style={[
                      styles.resume,
                      solde >= 0 ? styles.pos : styles.neg,
                    ]}
                  >
                    {solde.toFixed(2)} €
                  </Text>
                </View>
              )}

              {/* Mode détaillé */}
              {mode === "detail" && (
                <>
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
                </>
              )}

            </TouchableOpacity>
          </Link>
        );
      })}
    </ScrollView>
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

  /* Tri */
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

  /* Item */
  item: {
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
    alignItems: "center",
    marginBottom: 10,
  },

  icon: {
    marginRight: 8,
  },

  label: {
    fontSize: 18,
    color: "#1B4F72",
    fontWeight: "700",
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

  soldeSimple: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "right",
  },

  compactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
