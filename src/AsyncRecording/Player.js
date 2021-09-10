import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Icon } from "react-native-elements";
import Slider from "@react-native-community/slider";
import Sound from "react-native-sound";

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      isPlayingPaused: true,
      playSecondsCounter: 0,
      duration: 0,
      audioFileName: "",
    };
    this.sliderEditing;
  }

  componentDidMount() {
    this.timeout = setInterval(() => {
      if (
        this.sound &&
        this.sound.isLoaded() &&
        this.state.isPlaying &&
        !this.state.isPlayingPaused
      ) {
        this.sound.getCurrentTime((seconds, isPlaying) => {
          this.setState({ playSecondsCounter: seconds });
        });
      }
    }, 100);

    this.setState(
      { audioFileName: this.props.audioFileName },
      this.loadPlayer(this.props.audioFileName)
    );
  }

  componentWillUnmount() {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }
    if (this.timeout) {
      clearInterval(this.timeout);
    }
  }

  loadPlayer = (fileName) => {
    if (this.state.audioFileName) {
      fileName = this.state.audioFileName;
    } else if (this.props.audioFileName) {
      fileName = this.props.audioFileName;
    }
    this.sound = new Sound(fileName, "", (error) => {
      if (error) {
        console.log("The audio file failed to load", error);
        return;
      }
      this.setState({
        isPlaying: false,
        isPlayingPaused: true,
        duration: this.sound.getDuration(),
      });
    });
  };

  play = async () => {
    // get the recording and play
    if (this.sound) {
      this.sound.play(this.playComplete); // can add playback
      this.setState({ isPlaying: true, isPlayingPaused: false });
    } else {
      this.loadPlayer();
    }
  };

  playComplete = (success) => {
    if (this.sound) {
      if (success) {
        console.log("Successfully finished playing");
      } else {
        console.log("Playback failed due to unknown error");
      }
      this.setState({
        isPlaying: false,
        isPlayingPaused: true,
        playSecondsCounter: 0,
      });
      this.sound.setCurrentTime(0);
    }
  };

  pausePlayer = () => {
    // pause the current player
    if (this.sound) {
      this.sound.pause();
    }
    this.setState({ isPlaying: false, isPlayingPaused: true });
  };

  jumpNSeconds = (numSeconds) => {
    if (this.sound) {
      this.sound.getCurrentTime((secs, isPlaying) => {
        let nextSecs = secs + numSeconds;
        if (nextSecs < 0) nextSecs = 0;
        else if (nextSecs > this.state.duration) nextSecs = this.state.duration;
        this.sound.setCurrentTime(nextSecs);
        this.setState({ playSecondsCounter: nextSecs });
      });
    }
  };

  jumpForward10 = () => {
    this.jumpNSeconds(10);
  };

  jumpBack10 = () => {
    this.jumpNSeconds(-10);
  };

  onSliderEditStart = () => {
    this.sliderEditing = true;
  };
  onSliderEditEnd = () => {
    this.sliderEditing = false;
  };
  onSliderEditing = (value) => {
    if (this.sound) {
      this.sound.setCurrentTime(value);
      this.setState({ playSecondsCounter: value });
    }
  };

  renderPlayPauseButton = () => {
    if (this.state.isPlaying) {
      return (
        <View style={styles.buttonView}>
          <Icon
            size={100}
            name="pause"
            color="white"
            onPress={this.pausePlayer}
          />
          <Text style={styles.buttonLabelText}>Pause</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.buttonView}>
          <Icon
            size={100}
            name="play-arrow"
            color="white"
            onPress={this.play}
          />
          <Text style={styles.buttonLabelText}>Play</Text>
        </View>
      );
    }
  };

  renderJumpButtons = (direction) => {
    if (direction === "forward") {
      return (
        <View style={styles.buttonView}>
          <Icon
            size={100}
            name="forward-10"
            color="white"
            onPress={this.jumpForward10}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.buttonView}>
          <Icon
            size={100}
            name="replay-10"
            color="white"
            onPress={this.jumpBack10}
          />
        </View>
      );
    }
  };

  getAudioTimeString(seconds) {
    const h = parseInt(seconds / (60 * 60));
    const m = parseInt((seconds % (60 * 60)) / 60);
    const s = parseInt(seconds % 60);

    return (
      (h < 10 ? "0" + h : h) +
      ":" +
      (m < 10 ? "0" + m : m) +
      ":" +
      (s < 10 ? "0" + s : s)
    );
  }

  render() {
    const currentTimeString = this.getAudioTimeString(
      this.state.playSecondsCounter
    );
    const durationString = this.getAudioTimeString(this.state.duration);
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.playerButtonView}>
          {this.renderJumpButtons("backward")}
          {this.renderPlayPauseButton()}
          {this.renderJumpButtons("forward")}
        </View>
        <View
          style={{
            marginVertical: 15,
            marginHorizontal: 15,
            flexDirection: "row",
          }}
        >
          <Text style={{ color: "white", alignSelf: "center" }}>
            {currentTimeString}
          </Text>
          <Slider
            onTouchStart={this.onSliderEditStart}
            onTouchEnd={this.onSliderEditEnd}
            onValueChange={this.onSliderEditing}
            value={this.state.playSecondsCounter}
            maximumValue={this.state.duration}
            maximumTrackTintColor="gray"
            minimumTrackTintColor="white"
            thumbTintColor="white"
            style={{
              flex: 1,
              alignSelf: "center",
              marginHorizontal: Platform.select({ ios: 5 }),
            }}
          />
          <Text style={{ color: "white", alignSelf: "center" }}>
            {durationString}
          </Text>
        </View>
      </View>
    );
  }
}

export default Player;

const styles = StyleSheet.create({
  playerButtonView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  buttonLabelText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
});
