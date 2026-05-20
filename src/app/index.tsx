import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";

export default function UserSelection() {
  const router = useRouter();
  const { setUser } = useUser();

  const handleSelect = (user: "Natacha" | "Fabian") => {
    setUser(user);
    router.push("/budget");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qui utilise l'application ?</Text>

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
    marginBottom: 40,
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
    borderColor: "#0A3D62", // bleu foncé
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B4F72",
  },
});
