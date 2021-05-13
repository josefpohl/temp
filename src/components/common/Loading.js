import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export default ({navigation}) => {
  return (
    <View style={styles.loadingContainer}>
      <Text>Loading....</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
});
