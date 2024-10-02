import React, { useState } from "react";
import { Animated, StyleSheet, TextInput, View, Text } from "react-native";

interface AnimatedInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  error?: string;
  placeholder: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  onFocus,
  error,
  placeholder,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelAnimation = new Animated.Value(value ? 1 : 0);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(labelAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus();
  };

  const handleBlur = () => {
    if (value === "") {
      setIsFocused(false);
      Animated.timing(labelAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur();
  };

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.label,
          {
            top: labelAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
            fontSize: labelAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 12], // Font size of the label
            }),
            color: labelAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ["#aaa", "#F26522"], // Label color
            }),
          },
        ]}
      >
        {label}
      </Animated.Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={placeholder}
        placeholderTextColor={"#aaa"}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "95%",
  },
  label: {
    position: "absolute",
    left: 10,
    top: 0,
    fontSize: 16,
    backgroundColor: "#fff", // Background color of the label
    paddingHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    height: 60,
    color: "#333",
  },
  inputError: {
    borderColor: "red", // Red border for validation error
  },
  errorText: {
    color: "red",
    marginTop: 5,
    textAlign: "left",
  },
});

export default AnimatedInput;
