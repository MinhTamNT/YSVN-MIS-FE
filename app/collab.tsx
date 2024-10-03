import ViewTaskScreen from "@/components/Details/Detail";
import HeaderGoBack from "@/components/Header/HeaderGoBack";
import LoadingIndicator from "@/components/Loading/Loading";
import { Task } from "@/lib/interface";
import { API, endPoints } from "@/Service/Api";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Button,
  Image,
  KeyboardAvoidingView,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RadioForm from "react-native-simple-radio-button";
import moment from "moment";
import EditTaskScreen from "@/components/Edit/EditCollab";
import { radio_props, radio_translate } from "@/lib/lib";
import Toast from "react-native-toast-message";
import { convertToBase64 } from "@/lib/utilis";
const Collab: React.FC = () => {
  const [taskDetails, setTaskDetails] = useState<Task>({
    JobTitle: "",
    StartTime: new Date(),
    EndTime: new Date(),
    Priority: 2,
    Content: "",
    WithPerson: "",
    TransportationMode: 1,
    NextAppointment: new Date(),
    Referral: "",
    Cost: "",
    Notes: "",
    AttachmentURL: null,
    Status: 1,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isModalVisibleViewTask, setModalVisibleViewTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingViewTask, setIsLoadingViewTask] = useState(false);
  const [editView, setEditView] = useState(false);
  const [isReferral, setIsReferral] = useState(false);
  function formatDateToCustomString(dateString: any) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setModalVisibleViewTask(true);
  };

  const editVewTask = (task: Task) => {
    setSelectedTask(task);
    setEditView(true);
  };

  const editVewTaskClose = () => {
    setEditView(false);
    setSelectedTask(null);
  };
  const closeTaskModal = () => {
    setModalVisibleViewTask(false);
    setSelectedTask(null);
  };

  useEffect(() => {
    const getAllCollobarte = async () => {
      try {
        setIsLoadingViewTask(true);
        const response = await API().get(endPoints["get-collaborate"]);
        setTasks(response.data);
      } catch (error) {
        console.log("Error while fetching tasks:", error);
      } finally {
        setIsLoadingViewTask(false);
      }
    };
    getAllCollobarte();
  }, [isReferral]);

  const handleSubmit = async () => {
    if (!taskDetails.JobTitle || !taskDetails.Content) {
      alert("Tiêu đề và nội dung không được để trống.");
      return;
    }

    if (taskDetails.StartTime >= taskDetails.EndTime) {
      alert("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        job_title: taskDetails.JobTitle,
        start_time: taskDetails.StartTime.toISOString(),
        end_time: taskDetails.EndTime.toISOString(),
        priority: taskDetails.Priority,
        content: taskDetails.Content,
        with_person: taskDetails.WithPerson,
        transportation_mode: taskDetails.TransportationMode,
        next_appointment: formatDateToCustomString(
          taskDetails.NextAppointment.toDateString()
        ),
        referral: taskDetails.Referral,
        cost: taskDetails.Cost,
        notes: taskDetails.Notes,
        attachment: taskDetails.AttachmentURL,
      };

      await API().post(endPoints["create-collaborate"], payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setTasks((prevTasks) => [...prevTasks, taskDetails]);
      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.log("Error while submitting:", error);
      alert("Có lỗi xảy ra trong quá trình gửi dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTaskDetails({
      JobTitle: "",
      StartTime: new Date(),
      EndTime: new Date(),
      Priority: 2,
      Content: "",
      WithPerson: "",
      TransportationMode: 1,
      NextAppointment: new Date(),
      Referral: "",
      Cost: "",
      Notes: "",
      AttachmentURL: null,
      Status: 1,
    });
  };

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const base64Image = await convertToBase64(uri);
      setTaskDetails((prev) => ({
        ...prev,
        AttachmentURL: base64Image,
      }));
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    setIsReferral((prev) => !prev);
    setIsLoading(false);
  };

  const renderTaskCard = (task: Task, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.taskCard}
      onPress={() => {
        if (task.Status === 1) {
          editVewTask(task);
        } else {
          openTaskModal(task);
        }
      }}
    >
      <Text style={styles.taskTitle}>{task?.JobTitle}</Text>
      <Text style={styles.taskDate}>
        Ngày làm việc : {formatDateToCustomString(task?.StartTime)}
      </Text>
      <Text style={styles?.taskFooter}>Người liên hệ: {task?.WithPerson}</Text>
      <View style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
        <Text>Tình trạng:</Text>
        <Text
          style={[
            styles.taskFooter,
            task.Status === 1
              ? styles.pending
              : task.Status === 2
              ? styles.approved
              : task.Status === 3
              ? styles.rejected
              : {},
          ]}
        >
          {task.Status === 1
            ? "Chờ xác nhận"
            : task.Status === 2
            ? "Đã duyệt"
            : task.Status === 3
            ? "Từ chối"
            : "Không xác định"}{" "}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleBackPress = () => {
    if (isModalVisibleViewTask) {
      closeTaskModal();
      return true;
    }
    return false;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => backHandler.remove();
  }, [isModalVisibleViewTask]);

  return (
    <SafeAreaView style={styles.container}>
      {isLoadingViewTask ? (
        <LoadingIndicator />
      ) : (
        <>
          <Toast />
          <HeaderGoBack />
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.createButtonText}>Tạo phiếu công tác</Text>
          </TouchableOpacity>
          <ScrollView
            style={styles.scrollContainer}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={fetchTasks} />
            }
          >
            <Text style={styles.title}>Danh sách phiếu công tác:</Text>
            {tasks.length > 0 ? (
              tasks?.map(renderTaskCard)
            ) : (
              <Text style={styles.emptyMessage}>Chưa có công việc nào.</Text>
            )}

            <Modal
              animationType="slide"
              transparent={false}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <ScrollView
                style={{
                  flex: 1,
                  paddingTop: 60,
                  paddingHorizontal: 20,
                  position: "relative",
                }}
                contentContainerStyle={styles.scrollViewContent}
              >
                <KeyboardAvoidingView behavior="padding">
                  <Text style={styles.modalTitle}>Thông tin công việc</Text>
                  <Text style={styles.label}>Tiêu đề công việc:</Text>
                  <TextInput
                    value={taskDetails.JobTitle}
                    onChangeText={(text) =>
                      setTaskDetails((prev) => ({ ...prev, JobTitle: text }))
                    }
                    style={styles.input}
                  />
                  <View>
                    <Text style={styles.label}>Giờ bắt đầu:</Text>
                    <DateTimePicker
                      value={taskDetails.StartTime}
                      mode="datetime"
                      display="default"
                      onChange={(event, date) =>
                        setTaskDetails((prev) => ({
                          ...prev,
                          StartTime: date || prev.StartTime,
                        }))
                      }
                      style={styles.datePicker}
                      themeVariant="light"
                    />

                    <Text style={styles.label}>Giờ kết thúc:</Text>
                    <DateTimePicker
                      value={taskDetails.EndTime}
                      mode="datetime"
                      display="default"
                      onChange={(event, date) =>
                        setTaskDetails((prev) => ({
                          ...prev,
                          EndTime: date || prev.EndTime,
                        }))
                      }
                      style={styles.datePicker}
                      themeVariant="light"
                    />
                  </View>

                  <Text style={styles.label}>Nội dung công việc:</Text>
                  <TextInput
                    value={taskDetails.Content}
                    onChangeText={(text) =>
                      setTaskDetails((prev) => ({ ...prev, Content: text }))
                    }
                    style={styles.textarea}
                    multiline
                    numberOfLines={4}
                  />
                  <Text style={styles.label}>Người liên hệ:</Text>
                  <TextInput
                    value={taskDetails.WithPerson}
                    onChangeText={(text) =>
                      setTaskDetails((prev) => ({ ...prev, WithPerson: text }))
                    }
                    style={styles.input}
                  />
                  <Text style={styles.label}>Chi phí (nếu có):</Text>
                  <TextInput
                    value={taskDetails.Cost}
                    onChangeText={(text) =>
                      setTaskDetails((prev) => ({ ...prev, Cost: text }))
                    }
                    style={styles.input}
                    keyboardType="numeric"
                  />
                  <View style={styles.containerGroup}>
                    <View style={styles.radioGroup}>
                      <Text style={styles.label}>Phương tiện di chuyển:</Text>
                      <RadioForm
                        radio_props={radio_translate}
                        initial={1}
                        formHorizontal={true}
                        animation={true}
                        onPress={(value: any) =>
                          setTaskDetails((prev) => ({
                            ...prev,
                            TransportationMode: value,
                          }))
                        }
                        style={styles.radioForm}
                        buttonColor="#000000"
                        labelColor="#000000"
                      />
                    </View>

                    <View style={styles.radioGroup}>
                      <Text style={styles.label}>Ưu tiên:</Text>
                      <RadioForm
                        radio_props={radio_props}
                        initial={1}
                        formHorizontal={true}
                        animation={true}
                        onPress={(value: any) =>
                          setTaskDetails((prev) => ({
                            ...prev,
                            Priority: value,
                          }))
                        }
                        style={[styles.radioForm]}
                        buttonColor="#000000"
                        labelColor="#000000"
                      />
                    </View>
                  </View>

                  <Text style={styles.label}>Ngày hẹn lại:</Text>
                  <DateTimePicker
                    value={taskDetails.NextAppointment}
                    mode="datetime"
                    display="default"
                    onChange={(event, date) =>
                      setTaskDetails((prev) => ({
                        ...prev,
                        NextAppointment: date || prev.NextAppointment,
                      }))
                    }
                    themeVariant="light"
                    style={styles.datePicker}
                  />
                  <Text style={styles.label}>Nguồn giới thiệu:</Text>
                  <TextInput
                    value={taskDetails.Referral}
                    onChangeText={(text) =>
                      setTaskDetails((prev) => ({
                        ...prev,
                        Referral: text,
                      }))
                    }
                    style={styles.input}
                  />
                  <Text style={styles.label}>Ghi chú:</Text>
                  <TextInput
                    value={taskDetails.Notes}
                    onChangeText={(text) =>
                      setTaskDetails((prev) => ({ ...prev, Notes: text }))
                    }
                    style={styles.textarea}
                    multiline
                    numberOfLines={4}
                  />
                  <Button
                    title="Chọn ảnh đính kèm"
                    onPress={handleImageUpload}
                  />
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
                </KeyboardAvoidingView>
              </ScrollView>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Đóng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Lưu Phiếu</Text>
                </TouchableOpacity>
              </View>
              {isLoading && <LoadingIndicator />}
            </Modal>
          </ScrollView>
          <Modal
            visible={isModalVisibleViewTask}
            animationType="slide"
            onRequestClose={closeTaskModal}
          >
            {selectedTask && (
              <ViewTaskScreen
                task={selectedTask}
                closeTaskModal={closeTaskModal}
              />
            )}
          </Modal>
          <Modal
            visible={editView}
            animationType="slide"
            onRequestClose={editVewTaskClose}
          >
            {selectedTask && editView && (
              <>
                <EditTaskScreen
                  task={selectedTask}
                  closeModal={() => setEditView(false)}
                  setIsReferral={() => setIsReferral(!isReferral)}
                />
              </>
            )}
          </Modal>
        </>
      )}
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
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 1,
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
    position: "relative",
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
    marginTop: 15,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    minHeight: 60,
    marginTop: 15,
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
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    borderRadius: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#007BFF",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  approved: {
    color: "green",
  },
  pending: {
    color: "red",
  },
  rejected: {
    color: "red",
  },

  containerGroup: {
    marginVertical: 10,
  },
  radioGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  radioForm: {
    gap: 50,
    marginTop: 10,
    flexDirection: "row",
  },
  scrollViewContent: {
    paddingBottom: 350,
  },

  datePicker: {
    marginBottom: 12,
  },
});

export default Collab;
