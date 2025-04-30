import { View, Text, Image, StyleSheet } from "react-native";

export function Header() {
  return (
    <View style={styles.header}>
      <Image
        style={styles.logo}
        source={require("../assets/images/FullLogo_NoBuffer.png")}
        alt="logo"
      />
      <Text style={styles.headerText}>ZUSCH!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#32cd30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    margin: 10,
  },
  headerText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    paddingRight: 10,
  },
});
