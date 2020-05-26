import React, { memo, useState } from "react";
import { TouchableOpacity,Keyboard , Alert, StyleSheet, Text, View } from "react-native";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from "../core/theme";
import { emailValidator, passwordValidator } from "../core/utils";
import ErrorModal from '../components/ErrorModal';
import LottieView from 'lottie-react-native';
import auth, { firebase } from "@react-native-firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [alert, setAlert] = useState(false);

  const loginHandler = async () => {
    await auth().signInWithEmailAndPassword(email.value, password.value).
      then(user => {
        if (user) { navigation.navigate("BottomTabNav"); }
        return null;
      }).catch(error => {
        if (error.code === 'auth/wrong-password') {
          setAlert(true);
        }

      });
  };

  const _onLoginPressed = () => {
    Keyboard.dismiss();
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    loginHandler();
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate("HomeScreen")} />
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen")}>
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={_onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <ErrorModal onPress={() => { setAlert(false) }} toggle={alert}>
        <View style={{ height: 100, marginTop: 20, width: "100%", }}>
          <LottieView source={require('../assets/error.json')} autoPlay loop />
        </View>
        <Text style={{ fontSize: 25, marginTop: 30, fontWeight: "bold", textAlign: "center" }}>Uh oh!!</Text>
        <Text style={{ width: "90%", alignSelf: "center", margin: 12, fontSize: 17, fontWeight: "bold", textAlign: "center", color: "rgba(0,0,0,0.4)", }}>
          Email or Password is Incorrect,Try again</Text>
      </ErrorModal>
    </Background>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24
  },
  row: {
    flexDirection: "row",
    marginTop: 4
  },
  label: {
    color: theme.colors.secondary
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary
  }
});

export default LoginScreen;