import React, { useState } from "react";
import {
  Button,
  ScrollView,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import HeaderGoBack from "@/components/Header/HeaderGoBack";
import RadioForm from "react-native-simple-radio-button";
import { KeyboardAvoidingView } from "react-native";

interface Task {
  title: string;
  startDate: Date;
  endDate: Date;
  priority: string;
  content: string;
  contactPerson: string;
  transportation: string;
  followUpDate: Date;
  referenceSource: string;
  cost: string;
  notes: string;
  attachment: string | null;
  approved: boolean;
}

const Collab: React.FC = () => {
  const [taskDetails, setTaskDetails] = useState<Task>({
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    priority: "medium",
    content: "",
    contactPerson: "",
    transportation: "tự túc",
    followUpDate: new Date(),
    referenceSource: "",
    cost: "",
    notes: "",
    attachment: null,
    approved: false,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showDetailsIndex, setShowDetailsIndex] = useState<number | null>(null);
  const [showMoreIndex, setShowMoreIndex] = useState<number | null>(null);

  const radio_props = [
    { label: "Thấp", value: "low" },
    { label: "Trung bình", value: "medium" },
    { label: "Cao", value: "high" },
  ];

  const radio_translate = [
    { label: "Tự Túc", value: "1" },
    { label: "Xe công ty", value: "2" },
    { label: "Khác", value: "3" },
  ];

  const handleSubmit = () => {
    if (!taskDetails.title || !taskDetails.content) {
      alert("Tiêu đề và nội dung không được để trống.");
      return;
    }

    if (taskDetails.startDate >= taskDetails.endDate) {
      alert("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }

    setTasks((prevTasks) => [...prevTasks, taskDetails]);
    resetForm();
    setModalVisible(false);
  };

  const resetForm = () => {
    setTaskDetails({
      title: "",
      startDate: new Date(),
      endDate: new Date(),
      priority: "medium",
      content: "",
      contactPerson: "",
      transportation: "tự túc",
      followUpDate: new Date(),
      referenceSource: "",
      cost: "",
      notes: "",
      attachment: null,
      approved: false,
    });
  };

 
  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setTaskDetails((prev) => ({ ...prev, attachment: result.assets[0].uri }));
    }
  };

  const toggleDetails = (index: number) => {
    setShowDetailsIndex(showDetailsIndex === index ? null : index);
  };

  const toggleMore = (index: number) => {
    setShowMoreIndex(showMoreIndex === index ? null : index);
  };

  const renderTaskCard = (task: Task, index: number) => (
    <View key={index} style={styles.taskCard}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <Text style={styles.taskDate}>
        Ngày bắt đầu: {task.startDate.toLocaleString()} | Ngày kết thúc:
        {task.endDate.toLocaleString()}
      </Text>
      <Text style={styles.taskFooter}>
        Người liên hệ: {task.contactPerson} | Tình trạng:{" "}
        {task.approved ? "Đã duyệt" : "Chưa duyệt"}
      </Text>
      {task.attachment && (
        <Image source={{ uri: task.attachment }} style={styles.image} />
      )}
      <TouchableOpacity onPress={() => toggleDetails(index)}>
        <Text style={styles.detailButton}>
          {showDetailsIndex === index ? "Ẩn chi tiết" : "Xem chi tiết"}
        </Text>
      </TouchableOpacity>
      {showDetailsIndex === index && (
        <View>
          <Text style={styles.taskContent}>{task.content}</Text>
          <TouchableOpacity onPress={() => toggleMore(index)}>
            <Text style={styles.moreButton}>
              {showMoreIndex === index ? "Ẩn thêm" : "Xem thêm"}
            </Text>
          </TouchableOpacity>
          {showMoreIndex === index && (
            <Text style={styles.taskNotes}>Ghi chú: {task.notes}</Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderGoBack />
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Danh sách công việc:</Text>
        {tasks.length > 0 ? (
          tasks.map(renderTaskCard)
        ) : (
          <Text style={styles.emptyMessage}>Chưa có công việc nào.</Text>
        )}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createButtonText}>Tạo phiếu công tác</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <ScrollView style={styles.modalContainer}>
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.buttonContainer}>
                <Button title="Lưu Phiếu" onPress={handleSubmit} />
                <Button title="Đóng" onPress={() => setModalVisible(false)} />
              </View>
              <Text style={styles.modalTitle}>Thông tin công việc</Text>
              <Text>Tiêu đề công việc:</Text>
              <TextInput
                value={taskDetails.title}
                onChangeText={(text) =>
                  setTaskDetails((prev) => ({ ...prev, title: text }))
                }
                style={styles.input}
              />
              <Text>Ngày bắt đầu:</Text>
              <DateTimePicker
                value={taskDetails.startDate}
                mode="datetime"
                display="default"
                onChange={(event, date) =>
                  setTaskDetails((prev) => ({
                    ...prev,
                    startDate: date || prev.startDate,
                  }))
                }
              />
              <Text>Ngày kết thúc:</Text>
              <DateTimePicker
                value={taskDetails.endDate}
                mode="datetime"
                display="default"
                onChange={(event, date) =>
                  setTaskDetails((prev) => ({
                    ...prev,
                    endDate: date || prev.endDate,
                  }))
                }
              />
              <Text>Nội dung công việc:</Text>
              <TextInput
                value={taskDetails.content}
                onChangeText={(text) =>
                  setTaskDetails((prev) => ({ ...prev, content: text }))
                }
                style={styles.textarea}
                multiline
                numberOfLines={4}
              />
              <Text>Người liên hệ:</Text>
              <TextInput
                value={taskDetails.contactPerson}
                onChangeText={(text) =>
                  setTaskDetails((prev) => ({ ...prev, contactPerson: text }))
                }
                style={styles.input}
              />
              <Text>Chi phí (nếu có):</Text>
              <TextInput
                value={taskDetails.cost}
                onChangeText={(text) =>
                  setTaskDetails((prev) => ({ ...prev, content: text }))
                }
                style={styles.input}
                keyboardType="numeric"
              />
              <Text>Phương tiện di chuyển:</Text>
              <RadioForm
                radio_props={radio_translate}
                initial={1}
                formHorizontal={true}
                animation={true}
                onPress={(value: any) =>
                  setTaskDetails((prev) => ({ ...prev, transportation: value }))
                }
                style={{ gap: 50, marginTop: 10 }}
              />
              <Text>Ưu tiên:</Text>
              <RadioForm
                radio_props={radio_props}
                initial={1}
                formHorizontal={true}
                animation={true}
                onPress={(value: any) =>
                  setTaskDetails((prev) => ({ ...prev, priority: value }))
                }
                style={{ gap: 50, marginTop: 10 }}
              />
              <Text>Ngày hẹn lại:</Text>
              <DateTimePicker
                value={taskDetails.followUpDate}
                mode="datetime"
                display="default"
                onChange={(event, date) =>
                  setTaskDetails((prev) => ({
                    ...prev,
                    followUpDate: date || prev.followUpDate,
                  }))
                }
              />
              <Text>Nguồn tham khảo:</Text>
              <TextInput
                value={taskDetails.referenceSource}
                onChangeText={(text) =>
                  setTaskDetails((prev) => ({ ...prev, referenceSource: text }))
                }
                style={styles.input}
              />
              <Text>Ghi chú:</Text>
              <TextInput
                value={taskDetails.notes}
                onChangeText={(text) =>
                  setTaskDetails((prev) => ({ ...prev, notes: text }))
                }
                style={styles.textarea}
                multiline
                numberOfLines={4}
              />
              <Button title="Chọn ảnh đính kèm" onPress={handleImageUpload} />
              {taskDetails.attachment && (
                <Image
                  source={{ uri: taskDetails.attachment }}
                  style={styles.image}
                />
              )}
            </KeyboardAvoidingView>
          </ScrollView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskDate: {
    fontSize: 14,
    color: "#666",
  },
  taskFooter: {
    fontSize: 14,
    color: "#666",
  },
  detailButton: {
    color: "#007BFF",
    marginTop: 10,
  },
  taskContent: {
    marginTop: 10,
  },
  moreButton: {
    color: "#007BFF",
    marginTop: 10,
  },
  taskNotes: {
    marginTop: 5,
  },
  createButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    minHeight: 60,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  emptyMessage: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#888",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

export default Collab;
