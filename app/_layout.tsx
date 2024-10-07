import { createStackNavigator } from "@react-navigation/stack";
import Login from "./login";
import Welcome from "./welcome";
import TabLayout from "./tab";
import Collab from "./collab";
import Toast from "react-native-toast-message";

export type RootParamsList = {
  login: undefined;
  welcome: undefined;
  tab: undefined;
  collab: undefined;
};

const Stack = createStackNavigator<RootParamsList>();

export default function RootLayout() {
  return (
    <>
      <Stack.Navigator initialRouteName="welcome">
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="collab"
          component={Collab}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="tab"
          component={TabLayout}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
}
