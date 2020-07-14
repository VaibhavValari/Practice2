import React, { memo, useState } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import firebase from '@react-native-firebase/app';
import color from '../core/colors';
import colors from "../core/colors";

const HomeScreen = ({ navigation }) => {

  return (
    <Background>
      <Logo />
      <Header>Welcome</Header>
      <Paragraph>What would you like to do?</Paragraph>
      <Button
        style={{ backgroundColor: colors.accentLight, width: "60%", alignSelf: "center", marginTop: 20, borderColor: color.primary, borderWidth: 1.5 }}
        mode="outlined"
        onPress={() => navigation.navigate("LoginScreen")}>
        Login
      </Button>
      <Button
        style={{ backgroundColor: "white", width: "60%", alignSelf: "center", marginTop: 20, borderColor: color.primary, borderWidth: 1.5 }}
        mode="outlined"
        onPress={() => navigation.navigate("RegisterScreen")}>
        Sign Up
      </Button>
    </Background>
  );
};

export default HomeScreen;