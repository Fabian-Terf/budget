import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUser } from "../context/UserContext";
import { getAvailableYears } from "../services/api";

export default function UserSelection() {
  const router = useRouter();
  const { setUser, setYear } = useUser();

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [openYearModal, setOpenYearModal] = useState(false);
  const [years, setYears] = useState<number[]>([]);
  const [loadingYears, setLoadingYears] = useState(true);

  // Charger les années depuis l'API
  useEffect(() => {
    async function loadYears() {
      try {
        const data = await getAvailableYears();
        setYears(data);
        setSelectedYear(data[data.length - 1]); // dernière année par défaut
      } catch (err) {
        console.log("Erreur chargement années", err);
      } finally {
        setLoadingYears(false);
      }
    }

    loadYears();
  }, []);

  const handleSelect = (user: "Natacha" | "Fabian") => {
    if (!selectedYear) return;
    setUser(user);
    setYear(selectedYear);
    router.push("/budget");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qui utilise l'application ?</Text>

      {/* Sélecteur d'année */}
      <TouchableOpacity
        style={styles.yearBox}
        onPress={() => !loadingYears && setOpenYearModal(true)}
      >
        <Text style={styles.yearLabel}>Année du budget</Text>

        {loadingYears ? (
          <ActivityIndicator color="#0A3D62" style={{ marginTop: 10 }} />
        ) : (
          <Text style={styles.yearValue}>{selectedYear}</Text>
        )}
      </TouchableOpacity>

      {/* Modal de sélection */}
      <Modal visible={openYearModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir une année</Text>

            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.yearItem}
                  onPress={() => {
                    setSelectedYear(item);
                    setOpenYearModal(false);
                  }}
                >
                  <Text style={styles.yearText}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity onPress={() => setOpenYearModal(false)}>
              <Text style={styles.close}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sélection utilisateur */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => handleSelect("Natacha")}>
          <Image source={require("../../assets/images/natacha-dentz.jpg")} style={styles.avatar} />
          <Text style={styles.name}>Natacha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleSelect("Fabian")}>
          <Image source={require("../../assets/images/fabian-terf.jpg")} style={styles.avatar} />
          <Text style={styles.name}>Fabian</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F1FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 30,
  },
  yearBox: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 15,
    borderRadius: 15,
    marginBottom: 40,
    elevation: 3,
  },
  yearLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B4F72",
  },
  yearValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A3D62",
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    gap: 30,
  },
  card: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: "center",
    width: 140,
    elevation: 4,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#0A3D62",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B4F72",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "70%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#0A3D62",
  },
  yearItem: {
    paddingVertical: 12,
  },
  yearText: {
    fontSize: 18,
    color: "#1B4F72",
  },
  close: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#0A3D62",
    fontWeight: "600",
  },
});
