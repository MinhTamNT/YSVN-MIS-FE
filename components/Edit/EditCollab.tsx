import { Task } from "@/lib/interface";
import { radio_props, radio_translate } from "@/lib/lib";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RadioForm from "react-native-simple-radio-button";
import * as ImagePicker from "expo-image-picker"; // Import for image picker
import { API, endPoints } from "@/Service/Api";
import LoadingIndicator from "../Loading/Loading";
import Toast from "react-native-toast-message"; // Import Toast
import { convertToBase64 } from "@/lib/utilis";
const EditTaskScreen: React.FC<{
  task: Task;
  closeModal: () => void;
  setIsReferral: () => void;
}> = ({ closeModal, setIsReferral, task }) => {
  const [taskDetails, setTaskDetails] = useState<Task>({
    ...task,
    StartTime: new Date(task.StartTime),
    EndTime: new Date(task.EndTime),
    NextAppointment: new Date(task.NextAppointment || new Date()),
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showMeetingDatePicker, setShowMeetingDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    // Request permission to access the image library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access images is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const base64Image = await convertToBase64(uri);
      setTaskDetails({ ...taskDetails, AttachmentURL: base64Image });
    }
  };

  const handleSubmit = async () => {
    if (!taskDetails.JobTitle || !taskDetails.Content) {
      alert("Tiêu đề và nội dung không được để trống.");
      return;
    }

    if (taskDetails.StartTime >= taskDetails.EndTime) {
      alert("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }

    const updatedTask = {
      JobTitle: taskDetails.JobTitle,
      StartTime: taskDetails.StartTime.toISOString(),
      EndTime: taskDetails.EndTime.toISOString(),
      Priority: taskDetails.Priority,
      Content: taskDetails.Content,
      WithPerson: taskDetails.WithPerson,
      TransportationMode: taskDetails.TransportationMode,
      NextAppointment: taskDetails.NextAppointment?.toISOString(),
      Referral: taskDetails.Referral,
      Cost: taskDetails.Cost,
      Notes: taskDetails.Notes,
      AttachmentURL: taskDetails.AttachmentURL,
      Status: taskDetails.Status,
    };
    console.log(updatedTask.AttachmentURL);
    try {
      setIsLoading(true);
      await API().put(
        endPoints["update-collaborate"](task?.AutoID || 0),
        updatedTask
      );
      Toast.show({
        text1: "Cập nhật thành công!",
        visibilityTime: 50000,
        position: "bottom",
      });
      closeModal();
    } catch (err) {
      console.log(err);
      Toast.show({
        text1: "Cập nhật thất bại!",
        visibilityTime: 5000,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.modalContainer}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.modalTitle}>Chỉnh sửa phiếu công tác</Text>
        {task.Status !== 1 ? (
          <Text style={styles.errorText}>
            Phiếu công tác đã được duyệt, không thể chỉnh sửa.
          </Text>
        ) : (
          <>
            <Text style={styles.label}>Tiêu đề công việc:</Text>
            <TextInput
              value={taskDetails.JobTitle}
              onChangeText={(text) =>
                setTaskDetails({ ...taskDetails, JobTitle: text })
              }
              style={styles.input}
              placeholder="Nhập tiêu đề công việc"
            />
            <Text style={styles.label}>Ngày bắt đầu:</Text>

            <DateTimePicker
              value={taskDetails.StartTime}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) {
                  setTaskDetails({ ...taskDetails, StartTime: selectedDate });
                }
              }}
              themeVariant="light"
            />

            <Text style={styles.label}>Ngày kết thúc:</Text>

            <DateTimePicker
              value={taskDetails.EndTime}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) {
                  setTaskDetails({ ...taskDetails, EndTime: selectedDate });
                }
              }}
              themeVariant="light"
            />
            <Text style={styles.label}>Ưu tiên:</Text>
            <RadioForm
              radio_props={radio_props}
              initial={radio_props.findIndex(
                (item) => item.value === taskDetails.Priority
              )}
              formHorizontal={true}
              onPress={(value: number) =>
                setTaskDetails({ ...taskDetails, Priority: value })
              }
              style={styles.radioForm}
              buttonColor="#333"
              labelColor="#333"
            />
            <Text style={styles.label}>Phương tiện di chuyển:</Text>
            <RadioForm
              radio_props={radio_translate}
              initial={radio_props.findIndex(
                (item) => item.value === taskDetails.Priority
              )}
              formHorizontal={true}
              onPress={(value: number) =>
                setTaskDetails({ ...taskDetails, Priority: value })
              }
              style={styles.radioForm}
              buttonColor="#333"
              labelColor="#333"
            />

            <Text style={styles.label}>Nội dung công việc:</Text>
            <TextInput
              value={taskDetails.Content}
              onChangeText={(text) =>
                setTaskDetails({ ...taskDetails, Content: text })
              }
              style={styles.input}
              placeholder="Nhập nội dung công việc"
              multiline={true}
            />

            <Text style={styles.label}>Người liên hệ:</Text>
            <TextInput
              value={taskDetails.WithPerson}
              onChangeText={(text) =>
                setTaskDetails({ ...taskDetails, WithPerson: text })
              }
              style={styles.input}
              placeholder="Nhập tên người liên hệ"
            />

            <Text style={styles.label}>Ngày hẹn gặp:</Text>
            <DateTimePicker
              value={taskDetails.NextAppointment}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                setShowMeetingDatePicker(false);
                if (selectedDate) {
                  setTaskDetails({
                    ...taskDetails,
                    NextAppointment: selectedDate,
                  });
                }
              }}
              themeVariant="light"
            />

            <Text style={styles.label}>Nguồn:</Text>
            <TextInput
              value={taskDetails.Referral}
              onChangeText={(text) =>
                setTaskDetails({ ...taskDetails, Referral: text })
              }
              style={styles.input}
              placeholder="Nhập nguồn"
            />

            <Text style={styles.label}>Chi phí:</Text>
            <TextInput
              value={taskDetails.Cost}
              onChangeText={(text) =>
                setTaskDetails({ ...taskDetails, Cost: text })
              }
              style={styles.input}
              placeholder="Nhập chi phí"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Ghi chú:</Text>
            <TextInput
              value={taskDetails.Notes}
              onChangeText={(text) =>
                setTaskDetails({ ...taskDetails, Notes: text })
              }
              style={styles.input}
              placeholder="Nhập ghi chú"
              multiline={true}
            />

            <Text style={styles.label}>Ảnh:</Text>
            <Button title="Chọn ảnh" onPress={pickImage} />
            {taskDetails.AttachmentURL && (
              <Image
                source={{
                  uri: taskDetails.AttachmentURL
                    ? `data:image/jpeg;base64,${taskDetails.AttachmentURL}`
                    : taskDetails.AttachmentURL,
                }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
          </>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonCancel} onPress={closeModal}>
          <Text style={styles.buttonCancelText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      </View>
      {isLoading && <LoadingIndicator text="Đang thay đổi..." />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  modalContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 10,
    marginVertical: 20,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#fafafa",
    fontSize: 16,
    color: "#333",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#34495e",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 16,
    marginVertical: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    left: 20,
    bottom: 0,
    right: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#2196f3",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonCancel: {
    backgroundColor: "#ff4444", // Red color for cancel button
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
  },
  buttonCancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollViewContent: {
    paddingBottom: 350,
  },
  radioForm: { marginBottom: 20, gap: 50, flexDirection: "row" },
});

export default EditTaskScreen;
