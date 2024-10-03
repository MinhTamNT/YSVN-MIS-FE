// LoadingIndicator.js
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const LoadingIndicator = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  const startSpin = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => startSpin());
  };

  useEffect(() => {
    startSpin();
  }, [spinValue]);

  // Interpolate the spin value to rotate the icon
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], 
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Icon name="loading" size={60} color="#0000ff" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});

export default LoadingIndicator;
