import React from 'react';
import {View, StyleSheet, Button, Text} from 'react-native';

export default ({navigation}) => {
  return (
    <View style={styles.homeContainer}>
      <Text>Hello other Screen</Text>
      <Button
        title="Go home darn it"
        onPress={() => {
          navigation.pop(); //.navigate('Home');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ßhomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aa4455',
  },
});
