import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import { CheckBox } from "react-native-elements";

const JobFilter = ({
  filter,
  handleChange,
  showLiveCalls,
  showDictations,
  sortByDate,
}) => {
  return (
    <View style={styles.filterLayout}>
      <View style={{ flex: 1, marginLeft: 15, marginRight: 15 }}>
        <TextInput
          placeholder="enter search terms"
          onChangeText={(changedText) => handleChange("filter", changedText)}
          value={filter}
        />
      </View>
      <View style={styles.checkboxes}>
        <View style={styles.boxes}>
          <CheckBox
            size={32}
            textStyle={styles.labelText}
            checked={showLiveCalls}
            onPress={() => {
              handleChange("liveCalls");
            }}
            title="Live Calls"
          />
        </View>
        <View style={styles.boxes}>
          <CheckBox
            size={32}
            textStyle={styles.labelText}
            checked={showDictations}
            onPress={() => handleChange("dictations")}
            title="Dictations"
          />
        </View>
        <View style={styles.boxes}>
          <CheckBox
            size={32}
            textStyle={styles.labelText}
            checked={sortByDate}
            onPress={() => handleChange("sortByDate")}
            title={`Reverse`}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterLayout: {
    flex: 1,
    backgroundColor: "#aaa",
  },
  checkboxes: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  boxes: {
    flex: 1,
  },
  labelText: {
    fontSize: 24,
  },
});

export default JobFilter;
