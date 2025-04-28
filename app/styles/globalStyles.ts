import { StyleSheet } from "react-native";
import { COLORS } from "./constants";

export const globalStyles = StyleSheet.create({
  heading: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
});
