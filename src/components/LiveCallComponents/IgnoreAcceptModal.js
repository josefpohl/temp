import React, { Component } from "react";
import { View, StyleSheet, Modal, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { ignoreIncomingCall } from "../../actions/liveCallActions";

class IgnoreAcceptModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      promptIncomingCall: false,
    };
  }
  componentDidMount() {
    this.setState({ promptIncomingCall: true });
  }
  //MAY BE ABLE TO REMOVE SOCKET?
  closeModalIgnore = () => {
    console.log("Close Modal Ignore Modal");
    this.setState({ promptIncomingCall: false });
    this.props.ignorePress();
    this.props.ignoreIncomingCall(true);
  };

  closeModalAccept = () => {
    console.log("Close Modal Accept Modal");
    this.setState({ promptIncomingCall: false });
    this.props.acceptPress();
    this.props.ignoreIncomingCall(false);
  };

  render() {
    if (this.state.promptIncomingCall) {
      return (
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.promptIncomingCall}
          onRequestClose={() => {}}
        >
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              height: "30%",
              width: "100%",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.75)",
              padding: 20,
              marginTop: 100,
              marginBottom: 200,
            }}
          >
            <View style={{ marginTop: 150 }}>
              <Text style={{ fontSize: 24, color: "#fff" }}>
                You have an incoming live call from a skywriter.
              </Text>
              <Text style={{ fontSize: 16, color: "#fff" }}>
                {this.props.message}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 10,
                    width: 150,
                    height: 40,
                    borderRadius: 5,
                    backgroundColor: "#1BAFD9",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    this.closeModalIgnore();
                  }}
                >
                  <Text>Ignore</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 10,
                    width: 150,
                    height: 40,
                    borderRadius: 5,
                    backgroundColor: "#1BAFD9",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    this.closeModalAccept();
                  }}
                >
                  <Text>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    livecalls: state.livecalls,
  };
};

export default connect(mapStateToProps, { ignoreIncomingCall })((props) => (
  <IgnoreAcceptModal {...props} socket={socket} />
));

const styles = StyleSheet.create({
  modalContainer: {},
  buttonStyle: {},
});
