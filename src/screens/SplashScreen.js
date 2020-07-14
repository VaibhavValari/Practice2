import React, { useEffect, useState } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import auth from "@react-native-firebase/auth";
import { ActivityIndicator } from 'react-native';
import colors from "../core/colors";

const SplashScreen = ({ navigation }) => {


  useEffect(() => {
    setTimeout(() => {
      checkUser();
    }, 5000);
  }, []);

  const checkUser = () => {
    auth().onAuthStateChanged(user => {
      console.log(user);
      user ? navigation.navigate('App') : navigation.navigate('Auth');
    });
  }

  return (
    <Background>
      <Logo />
      <ActivityIndicator size="large" color={colors.accent} />
    </Background>
  );
};

export default SplashScreen;