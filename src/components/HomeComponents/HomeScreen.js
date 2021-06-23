import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import { Button, Portal, Modal } from "react-native-paper";
import { logoutUser } from "../../actions/authenticationActions";
import { debounce } from "lodash";
import Toast from "react-native-toast-message";
import Loading from "../common/Loading";
import { rejectingCall } from "../../socketio/actions/liveCallSocket";
import { clearLiveCall } from "../../state/liveCalls";
const HomeScreen = ({
  navigation,
  user,
  profiles,
  availables,
  allAvailables,
  loadingAvailables,
  incomingCall,
  jobs,
  logoutUser,
  rejectingCall,
  clearLiveCall,
  skywriter,
}) => {
  const [availableCount, setAvailableCount] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  React.useEffect(() => {
    const filtered = availables.allAvailables.filter((a) => {
      return a.isAvailable && !a.inLiveCall;
    });
    setAvailableCount(filtered.length);
  }, [allAvailables]);

  React.useEffect(() => {
    if (incomingCall) {
      console.log(`INCOMING CALL`);
      setModalVisible(true);
    }
  }, [incomingCall]);

  const liveDebounce = React.useCallback(
    debounce(() => {
      navigation.navigate("LiveCall", { isSender: true });
    }, 500),
    []
  );

  const rejectLiveCallIncoming = () => {
    rejectingCall({ receiver: user, sender: skywriter.userLoggedIn });
    setModalVisible(false);
    //setIncomingCall false
    //emit Reject
    clearLiveCall();
  };
  const acceptLiveCallIncoming = () => {
    setModalVisible(false);

    navigation.navigate("LiveCall", { isSender: false });
  };
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
  const noSkywritersToast = () => {
    Toast.show({
      text1: "No skywriters available",
      text2: "Please try again or contact the Team Lead",
      autoHide: true,
      visibilityTime: 5000,
    });
  };

  return loadingAvailables ? (
    <Loading />
  ) : (
    <View style={styles.homeContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalHeaderText}>Hello {user.name}</Text>
      </View>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
          }}
          contentContainerStyle={styles.containerStyle}
        >
          <View>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Live call requested</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignContent: "center",
              }}
            >
              <Button
                raised
                mode="contained"
                theme={{ roundness: 10 }}
                onPress={acceptLiveCallIncoming}
                style={{ padding: 15 }}
              >
                <Text style={styles.dataElements}>Accept</Text>
              </Button>
              <Button
                raised
                mode="contained"
                theme={{ roundness: 10 }}
                onPress={rejectLiveCallIncoming}
                style={{ padding: 15 }}
              >
                <Text style={styles.dataElements}>Decline</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      <View style={styles.buttonContainer}>
        <Button
          raised
          mode="contained"
          color={availableCount > 0 ? null : "#d3d5d6"}
          theme={{ roundness: 10 }}
          onPress={availableCount > 0 ? liveDebounce : noSkywritersToast}
          style={styles.homeButton}
        >
          <Text style={styles.dataElements}>Make a Live Call</Text>
        </Button>
        <Button
          raised
          mode="contained"
          theme={{ roundness: 10 }}
          onPress={recordDebounce}
          style={styles.homeButton}
        >
          <Text style={styles.dataElements}>Record </Text>
        </Button>
        <Button
          raised
          mode="contained"
          theme={{ roundness: 10 }}
          onPress={jobsDebounce}
          style={styles.homeButton}
        >
          <Text style={styles.dataElements}>Jobs </Text>
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
          Available count:
          {availableCount}
        </Text>
        <Text style={styles.dataElements}>
          Job count: {jobs.allJobs.length}
        </Text>
        <Text style={styles.dataElements}>Version: 4.0.9 (13)</Text>
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
  allAvailables: state.availables.allAvailables,
  loadingAvailables: state.availables.loadingAvailables,
  jobs: state.jobs,
  incomingCall: state.livecalls.incomingCall,
  skywriter: state.livecalls.skywriter,
});

export default connect(mapStateToProps, {
  logoutUser,
  rejectingCall,
  clearLiveCall,
})(HomeScreen);
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
  homeButton: {
    width: 300,
    height: 100,
    padding: 15,
    justifyContent: "center",
  },
  containerStyle: { backgroundColor: "white", padding: 20 },
  modalHeader: { justifyContent: "center", alignItems: "center", margin: 45 },
  modalHeaderText: { fontSize: 30 },
});
