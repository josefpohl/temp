import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-paper";
import { logoutUser } from "../../actions/authenticationActions";

const HomeScreen = ({
  navigation,
  user,
  profiles,
  availables,
  jobs,
  logoutUser,
}) => {
  return (
    <View style={styles.homeContainer}>
      <Text>Hello Home View Screen {user.name}</Text>
      <View style={styles.buttonContainer}>
        <Button
          raised
          mode="contained"
          theme={{ roundness: 3 }}
          onPress={() => {
            navigation.navigate("LiveCall");
          }}
        >
          {" "}
          Go to Live Calls{" "}
        </Button>
        <Button
          raised
          mode="contained"
          theme={{ roundness: 3 }}
          onPress={() => {
            navigation.navigate("Recording");
          }}
        >
          Go to Asynch Recording
        </Button>
        <Button
          raised
          mode="contained"
          theme={{ roundness: 3 }}
          onPress={() => {
            navigation.navigate("Jobs");
          }}
        >
          Go to Jobs
        </Button>
      </View>
      <View style={styles.dataContainer}>
        <Text>My Profile: {profiles.userProfile.user.name}</Text>
        <Text>Profile count: {profiles.teamProfiles.length}</Text>
        <Text>Available count: {availables.allAvailables.length}</Text>
        <Text>Job count: {jobs.allJobs.length}</Text>
      </View>
      <View>
        <Button
          raised
          mode="contained"
          theme={{ roundness: 10 }}
          onPress={() => logoutUser(user)}
        >
          Logout
        </Button>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  profiles: state.profiles,
  availables: state.availables,
  jobs: state.jobs,
});

const mapDispatchToProps = { logoutUser };

export default connect(mapStateToProps, { logoutUser })(HomeScreen);
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  dataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
});
