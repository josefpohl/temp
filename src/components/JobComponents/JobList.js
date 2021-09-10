import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Text,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { ActivityIndicator, Colors } from "react-native-paper";
import JobCard from "./JobCard";
import JobFilter from "./JobFilter";
import { getJobs } from "../../actions/jobActions";

function JobList({ jobs, loadingJobs, getJobs, user }) {
  const [loading, setLoading] = React.useState(false);
  const [showLive, setShowLive] = React.useState(false);
  const [showDictations, setDictations] = React.useState(false);
  const [sortByDate, setSortByDate] = React.useState(false);
  const [filter, setFilter] = React.useState("");

  const getCard = ({ item }) => {
    return <JobCard job={item} />;
  };

  const list = (
    <FlatList
      data={jobs}
      renderItem={(item) => getCard(item)}
      keyExtractor={(item) => item._id.toString()}
      refreshControl={
        <RefreshControl
          onRefresh={() => getJobs(user.id)}
          refreshing={loadingJobs}
        />
      }
    />
  );
  return (
    <View style={styles.container}>
      {loadingJobs ? (
        <ActivityIndicator
          animating={true}
          colors={Colors.white}
          size={"large"}
        />
      ) : (
        list
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  loadingJobs: state.jobs.loadingJobs,
});
export default connect(mapStateToProps, { getJobs })(JobList);
