import React, { memo, useEffect } from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";

import auth from "@react-native-firebase/auth";






const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      console.log(user);
      navigation.navigate(user ? 'App' : "Auth");
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <Background>
      <Logo />
    </Background>
  );
};

export default SplashScreen;