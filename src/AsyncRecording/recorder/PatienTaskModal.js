import React from "react";
import PropTypes from "prop-types";
import {
  Modal,
  View,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  Text,
} from "react-native";
import { Alert } from "react-native";

//TODO
//Check if input is empty string, don't allow it
export default function PatientTaskModal({
  modalVisible,
  updateTextChange,
  title,
  closeModal,
  cancelFromModal,
}) {
  function saveAndClose() {
    if (!title) {
      Alert.alert("Please enter a Patient/Task identification");
      return;
    }
    closeModal();
  }
  return (
    <Modal
      animationType="fade"
      transparent
      onRequestClose={() => {}}
      visible={modalVisible}
      supportedOrientations={["landscape", "portrait"]}
    >
      <View style={styles.modalContentStyle}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeaderStyle}>
            <Text style={styles.modalHeaderText}>
              Patient/Task Identification
            </Text>
          </View>
          <View style={styles.modalFormStyle}>
            <View style={styles.modalTextContainerStyle}>
              <TextInput
                style={styles.modalTextInputStyle}
                onChangeText={(changedText) => {
                  updateTextChange(changedText);
                }}
                onSubmitEditing={saveAndClose}
                autoFocus={true}
                autoCorrect={false}
                value={title}
                placeholder="Add a patient or task identifier."
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <TouchableHighlight
                style={styles.submitCancelButton}
                onPress={saveAndClose}
              >
                <Text style={styles.submitCancelButtonText}>Save</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.submitCancelButton}
                onPress={() => {
                  cancelFromModal();
                }}
              >
                <Text style={styles.submitCancelButtonText}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

PatientTaskModal.propTypes = {
  updateTextChange: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  modalContentStyle: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.5)",
  },
  modalContainer: {
    flex: 1,
    marginTop: 100,
    marginBottom: 100,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#ffffff",
  },
  modalHeaderStyle: {
    height: 40,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#1BAFD9",
  },
  modalHeaderText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#fff",
  },
  modalFormStyle: {
    flex: 1,
    paddingTop: 100,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#0E8AA5",
  },

  modalTextContainerStyle: {
    flexDirection: "row",
    height: 40,
  },
  modalTextInputStyle: {
    color: "#000",
    backgroundColor: "#ddd",
    paddingRight: 15,
    paddingLeft: 15,
    fontSize: 32,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",
    position: "relative",
  },
  submitCancelButton: {
    backgroundColor: "#1BAFD9",
    margin: 30,
    borderRadius: 5,
  },
  submitCancelButtonText: {
    fontSize: 24,
    padding: 10,
    color: "#fff",
    fontWeight: "500",
  },
});
