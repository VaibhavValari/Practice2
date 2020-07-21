import React, { memo, useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { emailValidator } from "../core/utils";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import Button from "../components/Button";
import colors from "../core/colors";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: "", error: "" });
  const _onSendPressed = () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
    navigation.navigate("LoginScreen");
  };
  return (
    <Background>
      <BackButton goBack={() => navigation.navigate("LoginScreen")} />
      <Logo />
      <Header>Restore Password</Header>
      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <Button style={styles.button} mode="outlined" onPress={_onSendPressed}>
        Send Reset Instructions
      </Button>
      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate("LoginScreen")}
      >
        <Text style={styles.label}>← Back to login</Text>
      </TouchableOpacity>
    </Background>
  );
};

const styles = StyleSheet.create({
  back: {
    width: "100%",
    marginTop: 12,
  },
  button: {
    backgroundColor: "white",
    width: "60%",
    alignSelf: "center",
    marginTop: 20,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  label: {
    color: theme.colors.secondary,
    width: "100%",
  },
});

export default ForgotPasswordScreen;
