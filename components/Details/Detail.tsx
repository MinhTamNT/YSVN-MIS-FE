// Import necessary components
import { Task } from "@/lib/interface";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

// Function to get transportation label
const getTransportationLabel = (value: string) => {
  switch (value) {
    case "1":
      return "Xe tự túc";
    case "2":
      return "Xe công ty";
    case "3":
      return "Xe khác";
    default:
      return "Không xác định";
  }
};

const ViewTaskScreen: React.FC<{ task: Task; closeTaskModal: () => void }> = ({
  task,
  closeTaskModal,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.modalTitle}>Xem phiếu công tác</Text>
          <TouchableOpacity onPress={closeTaskModal} style={styles.closeButton}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Tiêu đề công việc:</Text>
          <Text style={styles.itemText}>{task.JobTitle}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Ngày bắt đầu:</Text>
          <Text style={styles.itemText}>{task.StartTime.toLocaleString()}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Ngày kết thúc:</Text>
          <Text style={styles.itemText}>{task.EndTime.toLocaleString()}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Ưu tiên:</Text>
          <Text style={styles.itemText}>
            {task.Priority === 1
              ? "Thấp"
              : task.Priority === 2
              ? "Trung bình"
              : task.Priority === 3
              ? "Cao"
              : "Không xác định"}
          </Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Nội dung công việc:</Text>
          <Text style={styles.itemText}>{task.Content}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Người liên hệ:</Text>
          <Text style={styles.itemText}>{task.WithPerson}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Phương tiện di chuyển:</Text>
          <Text style={styles.itemText}>
            {getTransportationLabel(task.TransportationMode)}
          </Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Chi phí:</Text>
          <Text style={styles.itemText}>{task.Cost}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Ghi chú:</Text>
          <Text style={styles.itemText}>{task.Notes}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Tình trạng:</Text>
          <Text style={styles.itemText}>
            {task.Status === 1
              ? "Đang chờ xác nhận"
              : task.Status === 2
              ? "Đã duyệt"
              : task.Status === 3
              ? "Từ chối"
              : "Không xác định"}
          </Text>
        </View>

        {task.AttachmentURL && (
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(task.AttachmentURL);
                setModalVisible(true);
              }}
            >
              <Image
                source={{
                  uri: task.AttachmentURL
                    ? `data:image/jpeg;base64,${task.AttachmentURL}`
                    : "",
                }}
                style={styles.image}
                resizeMode="contain" // Optional: to ensure the image fits nicely
              />
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalBackground}>
              <Image
                source={{
                  uri: selectedImage
                    ? `data:image/jpeg;base64,${selectedImage}`
                    : "",
                }}
                style={styles.fullImage}
                resizeMode="contain" // Optional: to ensure the image fits nicely
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F9", // Light gray background
  },
  modalContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF", // White background for modal
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Dark gray for title
  },
  closeButton: {
    backgroundColor: "#333", // Vibrant red color
    padding: 5,
    borderRadius: 5,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Light gray border
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555", // Medium gray for titles
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    color: "#333", // Dark gray for text
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  image: {
    width: 220,
    height: 160,
    borderRadius: 10,
    resizeMode: "cover",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark overlay
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "90%",
    borderRadius: 15,
    resizeMode: "contain",
  },
});

export default ViewTaskScreen;
