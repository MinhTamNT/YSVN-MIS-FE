import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RadioForm from "react-native-simple-radio-button";

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

const EditTaskScreen: React.FC<{
  task: Task;
  updateTask: (task: Task) => void;
}> = ({ task, updateTask }) => {
  const [taskDetails, setTaskDetails] = useState<Task>(task);

  const handleSubmit = () => {
    if (!taskDetails.title || !taskDetails.content) {
      alert("Tiêu đề và nội dung không được để trống.");
      return;
    }

    if (taskDetails.startDate >= taskDetails.endDate) {
      alert("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }

    updateTask(taskDetails);
  };

  const radio_props = [
    { label: "Thấp", value: "low" },
    { label: "Trung bình", value: "medium" },
    { label: "Cao", value: "high" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Chỉnh sửa phiếu công tác</Text>
        {task.approved ? (
          <Text style={styles.errorText}>
            Phiếu công tác đã được duyệt, không thể chỉnh sửa.
          </Text>
        ) : (
          <>
            <Text>Tiêu đề công việc:</Text>
            <TextInput
              value={taskDetails.title}
              onChangeText={(text) =>
                setTaskDetails({ ...taskDetails, title: text })
              }
              style={styles.input}
            />
            <Text>Ngày bắt đầu:</Text>
            <DateTimePicker
              value={taskDetails.startDate}
              mode="datetime"
              display="default"
              onChange={(event, date) =>
                setTaskDetails({
                  ...taskDetails,
                  startDate: date || taskDetails.startDate,
                })
              }
            />
            <Text>Ngày kết thúc:</Text>
            <DateTimePicker
              value={taskDetails.endDate}
              mode="datetime"
              display="default"
              onChange={(event, date) =>
                setTaskDetails({
                  ...taskDetails,
                  endDate: date || taskDetails.endDate,
                })
              }
            />
            <Text>Ưu tiên:</Text>
            <RadioForm
              radio_props={radio_props}
              initial={radio_props.findIndex(
                (item) => item.value === taskDetails.priority
              )}
              formHorizontal={true}
              onPress={(value: string) =>
                setTaskDetails({ ...taskDetails, priority: value })
              }
              style={{ gap: 50, marginTop: 10 }}
            />
            <Button title="Lưu thay đổi" onPress={handleSubmit} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  modalContainer: { padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, marginBottom: 20 },
  errorText: { color: "red", fontSize: 16, marginVertical: 10 },
});

export default EditTaskScreen;
