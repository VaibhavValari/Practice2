import React, { memo, useState } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import firebase from '@react-native-firebase/app';


const HomeScreen = ({ navigation }) => {

  return (
    <Background>
      <Logo />
      <Header>Welcome</Header>
      <Paragraph>What would you like to do?</Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("LoginScreen")}>
        Login
      </Button>
      <Button
      
        mode="contained"
        onPress={() => navigation.navigate("RegisterScreen")}>
        Sign Up
      </Button>
    </Background>
  );
};

export default HomeScreen;