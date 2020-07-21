import React from "react";
import firebase from "@react-native-firebase/app";
import App from "./src/";
import { theme } from "./src/core/theme";
import { Provider } from "react-native-paper";
import messaging from "@react-native-firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCUh_hbS3cEK5MbbEDRuAnhxQzwPO1ZPiw",
  authDomain: "servic-68add.firebaseapp.com",
  databaseURL: "https://servic-68add.firebaseio.com",
  projectId: "servic-68add",
  storageBucket: "servic-68add.appspot.com",
  messagingSenderId: "224009564004",
  appId: "1:224009564004:web:1a4a1145ea399d1a461471",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Main = () => {
  console.disableYellowBox = true;
  return (
    <Provider theme={theme}>
      <App />
    </Provider>
  );
};

export default Main;
