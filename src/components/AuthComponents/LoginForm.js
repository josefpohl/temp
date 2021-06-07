import React from "react";
import { View, StyleSheet, Button, TouchableOpacity, Text } from "react-native";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authenticationActions";
import { TextInput } from "react-native-paper";

const LoginForm = (props) => {
  const [text, setText] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <View>
      <View>
        <View>
          <TextInput
            label="email"
            value={text}
            onChangeText={(text) => setText(text)}
          />
        </View>
        <View>
          <TextInput
            label="password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity onPress={() => props.loginUser()}>
          <Text>Authenticate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { loginUser })(LoginForm);

const styles = StyleSheet.create({});
