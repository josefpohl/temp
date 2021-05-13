import React from 'react';
import {View, StyleSheet, Button, TouchableOpacity, Text} from 'react-native';
import {connect} from 'react-redux';
import {loginUser} from '../../actions/authenticationActions';

const LoginForm = (props) => {
  return (
    <View style={styles.loginContainer}>
      <Text style={styles.textContent}>Hello Login View Screen</Text>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => props.loginUser()}>
        <Text style={styles.textContent}>Authenticate</Text>
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {loginUser})(LoginForm);

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  textContent: {
    fontSize: 15,
    color: '#fff',
  },
  buttonStyle: {
    elevation: 8,
    backgroundColor: '#232323',
    alignSelf: 'center',
  },
});
