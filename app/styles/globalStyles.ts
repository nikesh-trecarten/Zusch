import { StyleSheet } from "react-native";
import { COLORS } from "./constants";

export const globalStyles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    padding: 20,
  },
  heading: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    color: "#fff",
  },
  buttonPressed: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
