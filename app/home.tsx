import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootParamsList } from "./_layout";
import { useNavigation } from "expo-router";

type HomeNavigatorProp = NativeStackNavigationProp<RootParamsList>;

interface ServiceItem {
  id: string;
  name: string;
  image: any; // or a more specific type, like ImageSource
  navigate?: string; // note the optional ? symbol
}

const Home = () => {
  const currentUser = {
    picture:
      "https://vcdn1-giaitri.vnecdn.net/2023/01/04/mono-2-1672831360-2966-1672832004.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=IwzfJrCRPol6khtxasxR1Q",
    name: "Ngô Trịnh Minh Tâm",
    phone: "0123456789",
  };

  const navigate = useNavigation<HomeNavigatorProp>();
  const services = [
    {
      id: "1",
      name: "Phiếu công tác",
      image: require("@/assets/images/doc.png"),
      navigate: "collab",
    },
    {
      id: "2",
      name: "Dịch vụ 2",
      image: require("@/assets/images/doc.png"),
    },
    {
      id: "2",
      name: "Dịch vụ 2",
      image: require("@/assets/images/doc.png"),
    },
  ];

  const renderServiceItem = ({ item }: { item: ServiceItem }) => (
    <View
      style={styles.serviceItem}
      onTouchEnd={() => navigate.navigate(item?.navigate || "")}
    >
      <View style={styles.serviceImageContainer}>
        <Image source={item.image} style={styles.serviceImage} />
      </View>
      <Text style={styles.serviceName}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          paddingHorizontal: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={styles.userLeft}>
          <Image
            source={{ uri: currentUser.picture }}
            style={{ width: 66, height: 66, borderRadius: 20 }}
          />
          <View style={styles.nameUserContainer}>
            <Text style={styles.nameUser}>{currentUser.name}</Text>
            <Text style={styles.phoneUser}>{currentUser.phone}</Text>
          </View>
          <Image
            source={require("@/assets/images/verify.png")}
            style={styles.verify}
          />
        </View>
      </View>

      <View style={styles.contentHome}>
        <Text style={styles.nameService}>Danh sách chức năng</Text>

        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  userLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    position: "relative",
  },
  nameUserContainer: {
    gap: 5,
  },
  nameUser: {
    color: "#022751",
    fontSize: 16,
    fontWeight: "bold",
  },
  phoneUser: {
    color: "#022751",
    fontSize: 12,
  },
  verify: {
    position: "absolute",
    left: 50,
    top: 50,
    width: 20,
    height: 20,
  },
  contentHome: {
    paddingHorizontal: 12,
    marginTop: 20,
    width: "100%",
    maxWidth: 384,
    backgroundColor: "#F4FBFE",
    borderRadius: 5,
    marginLeft: 12,
    padding: 10,
  },
  nameService: {
    color: "#022751",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  gridContainer: {
    paddingHorizontal: 4,
  },
  serviceItem: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  serviceImage: {
    marginBottom: 5,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  serviceName: {
    textAlign: "center",
    color: "#022751",
    fontWeight: "500",
    fontSize: 12,
  },
  serviceImageContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 10,
    marginBottom: 5,
    width: 50,
    height: 50,
  },
});

export default Home;
