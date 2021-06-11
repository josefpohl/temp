import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-paper";
import { logoutUser } from "../../actions/authenticationActions";
import { debounce } from "lodash";

const HomeScreen = ({
  navigation,
  user,
  profiles,
  availables,
  jobs,
  logoutUser,
}) => {
  const liveDebounce = React.useCallback(
    debounce(() => {
      navigation.navigate("LiveCall");
    }, 500),
    []
  );

  const recordDebounce = React.useCallback(
    debounce(() => {
      navigation.navigate("Recording");
    }, 500),
    []
  );
  const jobsDebounce = React.useCallback(
    debounce(() => {
      navigation.navigate("Jobs");
    }, 500),
    []
  );
  return (
    <View style={styles.homeContainer}>
      <Text>Hello Home View Screen {user.name}</Text>
      <View style={styles.buttonContainer}>
        <Button
          raised
          mode="contained"
          theme={{ roundness: 3 }}
          onPress={liveDebounce}
        >
          <Text style={styles.dataElements}>Go to Live Calls</Text>
        </Button>
        <Button
          raised
          mode="contained"
          theme={{ roundness: 3 }}
          onPress={recordDebounce}
        >
          <Text style={styles.dataElements}>Go to Asynch Recording </Text>
        </Button>
        <Button
          raised
          mode="contained"
          theme={{ roundness: 3 }}
          onPress={jobsDebounce}
        >
          <Text style={styles.dataElements}>Go to Jobs </Text>
        </Button>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.dataElements}>
          My Profile: {profiles.userProfile.user.name}
        </Text>
        <Text style={styles.dataElements}>
          Profile count: {profiles.teamProfiles.length}
        </Text>
        <Text style={styles.dataElements}>
          Available count: {availables.allAvailables.length}
        </Text>
        <Text style={styles.dataElements}>
          Job count: {jobs.allJobs.length}
        </Text>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Button
          raised
          mode="contained"
          theme={{ roundness: 10 }}
          onPress={() => logoutUser(user)}
        >
          <Text style={styles.dataElements}>Logout</Text>
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

export default connect(mapStateToProps, { logoutUser })(HomeScreen);
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "#d3d5d6",
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
    backgroundColor: "#94bccb",
    marginBottom: 10,
  },
  dataElements: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 25,
  },
});
