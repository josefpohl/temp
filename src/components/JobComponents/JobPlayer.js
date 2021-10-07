import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { ActivityIndicator, Colors } from "react-native-paper";
import axios from "axios";
import Player from "../../AsyncRecording/Player";
import config from "../../config";

const SERVEURL = config.SERVER;

const JobPlayer = ({ job }) => {
  const [url, setUrl] = React.useState("");
  const [loadingFile, setLoadingFile] = React.useState(true);
  const [isMKA, setIsMKA] = React.useState(false);

  React.useEffect(() => {
    if (loadingFile && url === "") {
      if (job.mediaType === "audio/x-matroska") {
        setIsMKA(true);
        setLoadingFile(false);
      }
      const uri = config.SERVER + `/api/jobs/signedURL/${job.s3File}`;
      axios.get(uri).then((res) => {
        setUrl(res.data);
        setLoadingFile(false);
      });
    }
  }, [loadingFile]);

  return (
    <>
      {loadingFile ? (
        <ActivityIndicator
          animating={true}
          colors={Colors.white}
          size={"large"}
        />
      ) : isMKA ? (
        <View style={{ marginBottom: 20, marginTop: 20 }}>
          <Text style={styles.mkaMessage}>
            This audio format is currently not supported due to iOS limitations.
            Please check the web version.
          </Text>
        </View>
      ) : (
        <View style={styles.playerOuterView}>
          <Player audioFileName={url.url} />
        </View>
      )}
    </>
  );
};

export default JobPlayer;

const styles = StyleSheet.create({
  playerOuterView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  mkaMessage: {
    fontSize: 24,
    color: "red",
  },
});
