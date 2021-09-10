import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { connect } from "react-redux";
import { Button, Portal, Modal, Card, Title } from "react-native-paper";
import { logoutUser } from "../../actions/authenticationActions";
import { debounce } from "lodash";
import Toast from "react-native-toast-message";
import RNBeep from "react-native-a-beep";
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
  currentlyInLiveCall,
  isRecording,
}) => {
  const [availableCount, setAvailableCount] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [goToLiveCall, setGoToLiveCall] = React.useState(false);
  const [goToAsync, setGoToAsync] = React.useState(false);

  //const [onHome, setOnHome] = React.useState(false);

  let timer = null;
  React.useEffect(() => {
    console.log(
      `IN LIVE CALL ${currentlyInLiveCall} ${JSON.stringify(skywriter)}`
    );
    if (currentlyInLiveCall) {
      console.log("Recognized live call in progress.");
      setGoToLiveCall(true);
    }
    if (isRecording) {
      setGoToAsync(true);
    }
    //console.log(`SETTING TIMER....`);

    // const focused = navigation.addListener(`focus`, () => {
    //   setOnHome(true);

    //   console.log(`HOME SCREEN HAS FOCUS...`);
    // });
    // return focused;
  }, []);

  // React.useEffect(() => {
  //   let timer;
  //   if (onHome) {
  //     timer = setTimeout(() => {
  //       RNBeep.beep();
  //       Toast.show({
  //         text1: "Idle timeout",
  //         text2: "Logging you out of the application",
  //       });
  //       logoutUser(user);
  //     }, 60 * 1000 * 15);
  //   }
  //   return () => {
  //     console.log(`clearing TIMEOUT`);
  //     clearTimeout(timer);
  //   };
  // }, [onHome]);

  React.useEffect(() => {
    if (goToLiveCall) {
      console.log("goToLiveCall");
      // setOnHome(false);
      navigation.navigate("LiveCall", { isSender: true, joinInProgress: true });
    }
  }, [goToLiveCall]);

  React.useEffect(() => {
    if (goToAsync) {
      //  setOnHome(false);
      navigation.navigate("Recording");
    }
  }, [goToAsync]);

  React.useEffect(() => {
    const filtered = availables.allAvailables?.filter((a) => {
      return a.isAvailable && !a.inLiveCall;
    });
    setAvailableCount(filtered.length);
  }, [allAvailables]);

  React.useEffect(() => {
    if (incomingCall) {
      console.log(`INCOMING CALL`, incomingCall);
      threeBeeps();
      setModalVisible(true);
    }
  }, [incomingCall]);

  const threeBeeps = () => {
    let i = 0;
    RNBeep.beep();
    const beeper = setInterval(() => {
      RNBeep.beep();
      if (++i === 4) {
        clearInterval(beeper);
      }
    }, 2000);
  };
  const liveDebounce = React.useCallback(
    debounce((e) => {
      // setOnHome(false);
      // e.stopPropagation();
      navigation.navigate("LiveCall", { isSender: true });
    }, 500),
    []
  );

  const rejectLiveCallIncoming = () => {
    console.log('rejectLiveCallIncoming');
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
      //  setOnHome(false);
      navigation.navigate("Recording");
    }, 500),
    []
  );
  const jobsDebounce = React.useCallback(
    debounce(() => {
      // setOnHome(false);
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
      <View style={styles.topHeader}>
        <Image
          source={require("../img/SkywriterMD_Logo_mediumbluebackground.png")}
          style={{
            width: 400,
            height: 150,
          }}
        />
        <Text style={styles.modalHeaderText}>Welcome {user.name}</Text>
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
        <Card style={styles.cardContainer}>
          <Card.Title>Skywriters Online</Card.Title>
          <Card.Content>
            <Title style={styles.cardText}>Skywriters Online</Title>
            <View style={styles.dataOuter}>
              <Text style={styles.cardText}>{availableCount}</Text>
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.cardContainer}>
          <Card.Title>Jobs complete</Card.Title>
          <Card.Content>
            <Title style={styles.cardText}>Jobs Complete</Title>
            <View style={styles.dataOuter}>
              <Text style={styles.cardText}>
                {jobs.allJobs.filter((j) => j.isComplete).length}
              </Text>
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.cardContainer}>
          <Card.Title>Jobs Pending</Card.Title>
          <Card.Content>
            <Title style={styles.cardText}>Jobs Pending</Title>
            <View style={styles.dataOuter}>
              <Text style={styles.cardText}>
                {jobs.allJobs.filter((j) => !j.isComplete).length}
              </Text>
            </View>
          </Card.Content>
        </Card>
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
      <Text style={{ textAlign: "center", fontSize: 12 }}>
        Version: 4.0.10 (6)
      </Text>
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
  currentlyInLiveCall: state.livecalls.currentlyInLiveCall,
  isRecording: state.jobs.isRecording,
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
    flexDirection: "row",
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
  topHeader: { justifyContent: "center", alignItems: "center", marginTop: 10 },
  modalHeader: { justifyContent: "center", alignItems: "center", margin: 45 },
  modalHeaderText: { fontSize: 30 },
  cardContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    alignSelf: "stretch",
    backgroundColor: "#346c7c",
    margin: 20,
  },
  dataOuter: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  cardHeaderText: {},
  cardText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#e3e3e3",
  },
});
