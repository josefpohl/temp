import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { connect } from "react-redux";
import JobList from "./JobList";
const JobScreen = ({ navigation, user, jobs }) => {
  const { allJobs, loadingJobs } = jobs;
  return (
    <View style={styles.homeContainer}>
      <JobList jobs={allJobs} />
      <Button
        color="#fff"
        title="Go Home"
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  jobs: state.jobs, //allJobs, loadingJobs
});

export default connect(mapStateToProps, {})(JobScreen);

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e9aa7",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    alignSelf: "center",
  },
});
