import { View, Image, StyleSheet, Text } from "react-native";

export function MapLegend() {
  return (
    <View style={styles.mapLegend}>
      <View style={styles.mapLegendItem}>
        <Image source={require("../assets/icons/marker-icon-green.png")} />
        <Text style={styles.text}>Boxes</Text>
      </View>
      <View style={styles.mapLegendItem}>
        <Image source={require("../assets/icons/marker-icon-grey.png")} />
        <Text style={styles.text}>Empty Boxes</Text>
      </View>
      <View style={styles.mapLegendItem}>
        <Image source={require("../assets/icons/marker-icon-blue.png")} />
        <Text style={styles.text}>Your Boxes</Text>
      </View>
      <View style={styles.mapLegendItem}>
        <Image source={require("../assets/icons/marker-icon-gold.png")} />
        <Text style={styles.text}>Your Empty Boxes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  mapLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  text: {
    maxWidth: 50,
  },
});
