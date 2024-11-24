import { useNavigation } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import * as Yup from "yup";
import { RootParamsList } from "./_layout";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Chưa nhập tên đăng nhặp"),
  password: Yup.string().required("Chưa nhập mật khẩu"),
});

type HomeNavigationProps = NativeStackNavigationProp<RootParamsList>;

const nameApp = require("../assets/images/name-app.png")
const handImage = require("../assets/images/hand.png")
export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigation<HomeNavigationProps>();
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <Image
          source={nameApp}
          style={styles.Logo}
        />
      </View>
      <Formik
        initialValues={{ username: "", password: "", rememberMe: false }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            if (values.username === "admin" && values.password === "admin") {
              navigate.navigate("tab");
              console.log("Login successful", values);
            }
          }, 2000);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View style={styles.formContainer}>
            <TextInput
              style={[
                styles.input,
                touched.password && errors.password ? styles.inputError : {},
              ]}
              placeholder="Tên đăng nhập"
              placeholderTextColor={"#333"}
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
            />
            {touched.username && errors.username ? (
              <Text style={styles.errorText}>{errors.username}</Text>
            ) : null}

            <TextInput
              style={[
                styles.input,
                touched.password && errors.password ? styles.inputError : {},
              ]}
              placeholder="Mật khẩu"
              placeholderTextColor={"#333"}
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            {touched.password && errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setFieldValue("rememberMe", !values.rememberMe)}
                style={styles.checkbox}
              >
                <Text
                  style={{ color: values.rememberMe ? "#F26522" : "#F26522" }}
                >
                  {values.rememberMe ? "☑️" : "⬜️"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.checkboxText}>Lưu tên đăng nhập</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonLogin}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.buttonLoginText}>ĐĂNG NHẬP</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={handImage}
                  style={{ resizeMode: "contain", width: 42, height: 42 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>

      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ActivityIndicator
              size="large"
              color="#F26522"
              style={styles.spinner}
            />
            <Text style={styles.modalText}>Đang đăng nhập...</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  Logo: {
    width: 273.71,
    height: 41,
    resizeMode: "contain",
    marginBottom: 30,
    zIndex: 1,
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: "95%",
    height: 60,
    color: "#333",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "left",
    width: "95%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "95%",
    padding: 10,
    borderRadius: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    color: "#333",
  },
  forgotPassword: {
    marginLeft: "auto",
  },
  forgotPasswordText: {
    color: "#022751",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 10,
  },
  buttonLogin: {
    width: "80%",
    height: 42,
    backgroundColor: "#F26522",
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  buttonLoginText: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 10,
  },
  iconButton: {
    alignItems: "center",
  },
  iconText: {
    marginTop: 5,
    color: "#022751",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center", 
    shadowColor: "#000", 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    elevation: 5, 
  },
  spinner: {
    marginBottom: 10, 
  },
  modalText: {
    marginTop: 10,
    color: "#333", 
    fontSize: 16,
    textAlign: "center", 
    fontFamily: "HelveticaNeue", 
  },
  createAccountContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  createAccountText: {
    color: "#333",
    fontSize: 14,
  },
  createAccountLink: {
    color: "#F26522",
    fontWeight: "bold",
  },
});
