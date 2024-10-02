import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function HeaderStart() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("VIE");

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const selectLanguage = (lang: any) => {
    setSelectedLanguage(lang);
    setMenuVisible(false);
    alert(`Switched to ${lang}`);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => alert("Back button pressed")}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.languageContainer}>
        <TouchableOpacity onPress={toggleMenu} style={styles.languageButton}>
          <Image source={require("@/assets/images/earth.png")} />
        </TouchableOpacity>

        <Text style={styles.selectedLanguageText}>{selectedLanguage}</Text>

        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons
            name={isMenuVisible ? "chevron-up" : "chevron-down"}
            size={16}
            color="black"
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>

      {isMenuVisible && (
        <View style={styles.languageMenu}>
          <TouchableOpacity onPress={() => selectLanguage("VIE")}>
            <Text style={[styles.languageOption, styles.languageOptionBorder]}>
              Vietnamese
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectLanguage("ENG")}>
            <Text style={[styles.languageOption, styles.languageOptionBorder]}>
              English
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectLanguage("TW")}>
            <Text style={styles.languageOption}>中文</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 50,
    zIndex: 1,
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedLanguageText: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
    marginLeft: 10,
  },
  languageMenu: {
    position: "absolute",
    top: 50, // Adjust this value as needed
    right: 15, // Aligns the menu to the right edge of the button
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    width: 170,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2, 
  },
  languageOption: {
    paddingVertical: 5,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  languageOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
