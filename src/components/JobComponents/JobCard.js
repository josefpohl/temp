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

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "#999",
    marginBottom: 20,
  },
  cardText: {
    color: "#000",
  },
});
function JobCard({ job }) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardText}>Title: {job.description}</Text>

      <Text style={styles.cardText}>Created: {job.createDate}</Text>
    </View>
  );
}

export default JobCard;
