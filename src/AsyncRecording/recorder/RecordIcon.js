import React from "react";
import PropTypes from "prop-types";
import { Text } from "react-native";
import { Icon } from "react-native-elements";

export default function RecordIcon({ onPress, labelText }) {
  return (
    <>
      <Icon
        size={100}
        name="fiber-manual-record"
        color="red"
        onPress={onPress}
      />
      <Text style={styles.buttonLabelText}>{labelText}</Text>
    </>
  );
}

const styles = {
  buttonLabelText: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "600",
    color: "#fff",
  },
};

RecordIcon.propTypes = {
  onPress: PropTypes.func.isRequired,
  labelText: PropTypes.string.isRequired,
};
