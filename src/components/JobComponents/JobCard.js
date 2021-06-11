//Job Data for reference.
//"isLiveCall":true,
//"isComplete":false,
//"isAssigned":true,
//"_id":"5f4d3b124212c426b1695c7b",
//"description":"Live Call session at 8/31/2020 at 12:01",
//"roomSid":"RMf99c4380dcb3b1731b33b17c5c1d128a",
//"participantSid":"PA8bf200ab5d4cff65e27ad65af951de89",
//"team":{"_id":"5f46913a91a9fc20cffadf2d","name":"First Team"},
//"organization":"5f46915b91a9fc20cffadf2f",
//"skywriter":{"_id":"5f46a47e91a9fc20cffadf50","name":"Sky 3"},
//"provider":{"_id":"5f46937491a9fc20cffadf3a","name":"doc 1","avatar":"..."}
//"recordedDate":"2020-08-31T18:01:54.073Z"
//"createDate":"2020-08-31T18:01:54.073Z"
//"lastModifiedDate":"2020-08-31T18:01:54.073Z"
//"recordingDurationSecs":38}
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Modal,
  Portal,
} from "react-native-paper";
import moment from "moment";

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    alignSelf: "stretch",
    backgroundColor: "#999",
    marginBottom: 20,
  },
  dataOuter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  columnContent: {},
  cardText: {
    color: "#000",
  },
  containerStyle: { backgroundColor: "white", padding: 20 },
  pendingStatus: {
    height: 15,
    width: 15,
    marginRight: 10,
    backgroundColor: "red",
    borderRadius: 15 / 2,
  },
  inProgressStatus: {
    height: 15,
    width: 15,
    marginRight: 10,
    backgroundColor: "yellow",
    borderRadius: 15 / 2,
  },
  completeStatus: {
    height: 15,
    width: 15,
    marginRight: 10,
    backgroundColor: "green",
    borderRadius: 15 / 2,
  },
  uploadingStatus: {
    height: 15,
    width: 15,
    marginRight: 10,
    backgroundColor: "black",
    borderRadius: 15 / 2,
  },
  modalHeader: { fontSize: 25, fontWeight: "bold" },
  flexDirHeaders: { flexDirection: "row" },
});
function JobCard({ job }) {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const stat = !job.isAssigned
    ? { status: "pending", icon: styles.pendingStatus }
    : job.isComplete
    ? { status: "complete", icon: styles.completeStatus }
    : job.isAssigned && !job.isComplete
    ? { status: "inProgress", icon: styles.inProgressStatus }
    : { status: "uploading", icon: styles.uploadingStatus };

  return (
    <Card style={styles.cardContainer}>
      <Card.Title>{job.description}</Card.Title>
      <Card.Content>
        <Title>{job.description}</Title>
        <View style={styles.dataOuter}>
          <View style={styles.columnContent}>
            <View style={styles.flexDirHeaders}>
              <View style={stat.icon} />
              <Text>
                Status:
                {stat.status}
              </Text>
            </View>
            <Text>
              Skywriter: {job.isAssigned ? job.skywriter.name : "Unassigned"}
            </Text>
          </View>
          <View style={styles.columnContent}>
            <Text>
              Created: {moment(job.createDate).format("MM-DD-YYYY hh:mm:ss")}
            </Text>
            <Text>
              Completed:
              {job.completedDate
                ? moment(job.completedDate).format("MM-DD-YYYY hh:mm:ss")
                : "Not Complete"}
            </Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button onPress={showModal}>Listen</Button>
      </Card.Actions>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}
        >
          <View>
            <View style={styles.flexDirHeaders}>
              <View style={stat.icon} />
              <Text style={styles.modalHeader}>{job.description}</Text>
            </View>
            <View>
              <Text>Player would go here</Text>
            </View>
            <View>
              <Text>
                Created: {moment(job.createDate).format("MM-DD-YYYY hh:mm:ss")}
              </Text>
              <Text>
                Completed:
                {job.completedDate
                  ? moment(job.completedDate).format("MM-DD-YYYY hh:mm:ss")
                  : "Not Complete"}
              </Text>
            </View>
          </View>
        </Modal>
      </Portal>
    </Card>
  );
}

export default JobCard;
