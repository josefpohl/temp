import React from "react";
import { connect } from "react-redux";
import { Button, Text, View, StyleSheet, FlatList } from "react-native";
import JobCard from "./JobCard";

function JobList({ jobs }) {
  const getCard = ({ item }) => {
    return <JobCard job={item} />;
  };
  return (
    <View>
      <Text> My List {jobs.length}</Text>
      <FlatList
        data={jobs}
        renderItem={(item) => getCard(item)}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

export default JobList;
