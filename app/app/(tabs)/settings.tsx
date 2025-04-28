import { StyleSheet, View, Text } from "react-native";

export default function SettingsPage() {
  return (
    <View>
      <Text>I am the settings page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
