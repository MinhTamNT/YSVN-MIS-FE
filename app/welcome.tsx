import { View, Text, Image, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootParamsList } from "./_layout";
import { useNavigation } from "expo-router";

type WelcomeNavigateProps = NativeStackNavigationProp<RootParamsList>;

export default function Welcome() {
  const navigate = useNavigation<WelcomeNavigateProps>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate.navigate("login");
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("@/assets/images/logo-min.png")}
        style={styles.logo}
      />
      <View style={styles.footer}>
        <Text style={styles.text}>
          ©2022 - Chứng khoán Yuanta Việt Nam - Phát triển bởi Altisss.vn
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  logo: {
    width: 204,
    height: 204,
    resizeMode: "contain",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 12,
  },
});
