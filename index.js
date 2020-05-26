/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import RNLocation from "react-native-location";
import React, { useEffect, useState } from 'react';


const firebaseConfig = {
  apiKey: "AIzaSyCUh_hbS3cEK5MbbEDRuAnhxQzwPO1ZPiw",
  authDomain: "servic-68add.firebaseapp.com",
  databaseURL: "https://servic-68add.firebaseio.com",
  projectId: "servic-68add",
  storageBucket: "servic-68add.appspot.com",
  messagingSenderId: "224009564004",
  appId: "1:224009564004:web:1a4a1145ea399d1a461471"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
//background Handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  //remoteMessage is my data object i want to pass to my component
});




messaging().getToken().then(data => {
  const uid = auth().currentUser.uid;
  database().ref(`/technician/${uid}/`).child(`token`).set(data);
});

RNLocation.getCurrentPermission()


RNLocation.requestPermission({
  ios: "whenInUse",
  android: {
    detail: "coarse"
  }
}).then(abc => {
  // console.log('location accessible:   '+abc);
});

RNLocation.checkPermission({
  ios: 'whenInUse', // or 'always'
  android: {
    detail: 'coarse' // or 'fine'
  }
})

RNLocation.configure({
  distanceFilter: 10, // Meters
  desiredAccuracy: {
    ios: "best",
    android: "highAccuracy"
  },
  // Android only
  androidProvider: "auto",
  interval: 1000, // Milliseconds
  fastestInterval: 2000, // Milliseconds
  maxWaitTime: 1000, // Milliseconds

});

RNLocation.subscribeToPermissionUpdates();


AppRegistry.registerComponent(appName, () => App);
