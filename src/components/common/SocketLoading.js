import React from "react";

import { View, StyleSheet, Text, Image } from "react-native";
import { ActivityIndicator, Button, Colors } from "react-native-paper";
import { useDispatch } from "react-redux";

import { hideSocketLoading } from "../../actions/socketActions";

export default ({ navigation, step = 0 }) => {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(hideSocketLoading());
  }

  return (
    <View style={styles.loadingContainer}>
      <View>
        <Image
          source={require("../img/SkywriterMD_Logo_mediumbluebackground.png")}
          style={{
            width: 400,
            height: 150,
            marginBottom: 20,
            marginTop: 100,
          }}
        />
      </View>
      {
        step == 0 ? (
          <View>
            <Text style={styles.loadingText}>Establishing connection…</Text>
            <ActivityIndicator
              animating={true}
              colors={Colors.white}
              size={"large"}
            />
          </View>
        ) : step == 1 ? (
          <View>
            <Text style={styles.loadingText}>Attempting to reconnect...</Text>
            <Text style={styles.loadingSubText}>We’re attempting to automatically reconnect you to Skywriter</Text>
            <ActivityIndicator
              animating={true}
              colors={Colors.white}
              size={"large"}
            />
          </View>
        ) : (
          <View style={styles.failedContainer}>
            <Text style={styles.loadingText}>Failed to reconnect</Text>
            <Text style={styles.loadingSubText}>We weren’t able to reconnect you to Skywriter. Please logout and try again</Text>
            <Button style={styles.logoutBtn} onPress={() => logout()}>
              <Text style={styles.btnText}>Logout</Text>
            </Button>
          </View>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e8ea7",
  },
  failedContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  loadingText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 10
  },
  loadingSubText: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 18,
    fontStyle: 'italic',
    color: '#FFF'
  },
  logoutBtn: {
    width: '25%',
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 6,
    backgroundColor: '#346C7C'
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF'
  }
});