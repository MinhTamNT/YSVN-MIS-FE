import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const LoadingIndicator = ({
  text = "Loading...",
  color = "#0000ff",
  size = 60,
  duration = 1000,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(1)).current;

  const startSpin = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
    }).start(() => startSpin());
  };

  const startFade = () => {
    fadeValue.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeValue, {
          toValue: 0.5,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startSpin();
    startFade();
  }, [spinValue, fadeValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Icon name="loading" size={size} color={color} />
      </Animated.View>
      <Animated.Text style={[styles.loadingText, { opacity: fadeValue }]}>
        {text}
      </Animated.Text>
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
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#0000ff",
  },
});

export default LoadingIndicator;
