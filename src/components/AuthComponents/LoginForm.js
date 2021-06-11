import React from "react";
import {
  View,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import { loginUser } from "../../actions/authenticationActions";
import { TextInput, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-community/async-storage";
import * as Keychain from "react-native-keychain";

const LoginForm = (props) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [biometryType, setBiometryType] = React.useState();

  React.useEffect(() => {
    AsyncStorage.getItem("lastUser").then((lastUser) => setEmail(lastUser));
    Keychain.getSupportedBiometryType().then((biometryType) => {
      setBiometryType(biometryType);
    });
  }, []);

  const AUTH_OPTIONS = {
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    authenticationPrompt:
      "Please use your thumbprint or facial recognition option",
    authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
  };

  const debounceLogin = React.useCallback(
    _.debounce(async () => {
      console.log(`FROM FORM:  ${email}, ${password}`);
      await Keychain.setGenericPassword(email, password, AUTH_OPTIONS).then(
        (result) => {
          console.log(
            `Setting generic password-- keychain ${JSON.stringify(result)}`
          );
        }
      );
      props.loginUser(email, password);
    }, 500),
    [email, password]
  );

  const bioMetricLogin = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      const { username, password } = credentials;
      console.log(`credentials from Keychain: ${JSON.stringify(credentials)}`);
      props.loginUser(username, password);
    } else {
      console.log("No credentials stored. Alert via toast");
      alert("No credentials stored.  Please log in once to cache them.");
    }
  };

  return (
    <View style={styles.wrapper}>
      <View>
        <Image
          source={require("../img/SkywriterMD_Logo_mediumbluebackground.png")}
          style={{
            width: 400,
            height: 150,
            marginBottom: 20,
            marginTop: 100,
          }}
        />
      </View>
      <View style={styles.formElements}>
        <TextInput
          style={{ flex: 1 }}
          label="email"
          value={email}
          onChangeText={(email) => {
            console.log(`email: ${email}`);
            setEmail(email.toLowerCase());
          }}
        />
      </View>
      <View style={styles.formElements}>
        <TextInput
          style={{ flex: 1 }}
          label="password"
          secureTextEntry
          value={password}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <View style={styles.loginButton}>
        <TouchableOpacity onPress={debounceLogin}>
          <Text style={{ color: "#fff", fontSize: 25 }}>Authenticate</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Icon.Button
          name="fingerprint"
          backgroundColor="#0E8AA5"
          color="#fff"
          onPress={bioMetricLogin}
          size={75}
        >
          <Text style={{ color: "#fff", fontSize: 25 }}>
            Login with thumbprint
          </Text>
        </Icon.Button>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { loginUser })(LoginForm);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0E8AA5",
  },
  formStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#ddd",
    borderBottomWidth: 0,

    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
  },
  loginButton: {
    marginTop: 45,
    marginBottom: 30,
    backgroundColor: "#2e9aa7",
    padding: 20,
    //marginLeft: 200,
  },
  formContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#2e8ea7",
  },
  formElements: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: "#0E8AA5",
    justifyContent: "flex-start",
    alignSelf: "stretch",
    flexDirection: "row",
    borderColor: "#ddd",
    position: "relative",
  },
});
