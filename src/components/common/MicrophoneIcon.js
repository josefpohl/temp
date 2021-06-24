import React, { Component } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Icon } from "react-native-elements";

class MicrophoneIcon extends Component {
  constructor(props) {
    super(props);

    this.animatedValue = new Animated.Value(0);
    this.animatedValueBack = new Animated.Value(100);
  }

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.animatedValue, {
          toValue: 100,
          duration: 2000,
        }),
        Animated.timing(this.animatedValue, {
          toValue: 0,
          duration: 2000,
        }),
      ])
    ).start();
  }

  startAnimation = () => {};

  render() {
    const interpolatedColor = this.animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: ["rgb(0,0,0)", "rgb(255,0,0)"],
    });

    const animatedStyle = {
      backgroundColor: interpolatedColor,
    };

    return (
      <Animated.View style={[styles.box, animatedStyle]}>
        <Icon size={100} name="mic" color="white" />
      </Animated.View>
    );
  }
}

export { MicrophoneIcon };

const styles = StyleSheet.create({
  box: {
    height: 150,
    width: 150,
    paddingTop: 25,
    borderRadius: 25,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
