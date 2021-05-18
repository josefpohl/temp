import React from 'react';
import {View, StyleSheet, Button, Text} from 'react-native';
import {connect} from 'react-redux';
const RecordingScreen = ({navigation, user}) => {
  return (
    <View style={styles.homeContainer}>
      <Text>Hello Recording Screen {user.name}</Text>
      <Button
        color="#fff"
        title="Go Home"
        onPress={() => {
          navigation.navigate('Home');
        }}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(RecordingScreen);

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
});