import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator,Keyboard } from 'react-native';
import Background from "../components/Background";
import database from '@react-native-firebase/database';
import auth, { firebase } from '@react-native-firebase/auth';
import TextInput from '../components/TextInput';
import storage from '@react-native-firebase/storage';
//import database from '@react-native-firebase/database';
import Header from '../components/Header';
import DatePicker from 'react-native-datepicker';
import Button from '../components/Button';
//import firebase from '@react-native-firebase/app';
import Profile from '../screens/Profile';
import ImagePicker from 'react-native-image-picker';
import AnimatedLoader from 'react-native-animated-loader';


const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

const SetupProfile = ({ navigation }) => {

  const [name, setName] = useState("");
  const [number, setNumber] = useState({ value: "" });
  const [address, setAddress] = useState({ value: "" });
  const [dob, setDob] = useState({ value: "" });
  const [company, setCompany] = useState({ value: "" });
  const [image, setImage] = useState(null);
  const [loader, setloader] = useState(false);
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setName(user.displayName);
      }
      else {
        console.log("Dashboard user: null");
      }
    });

    return () => { unsubscribe() };
  });

  const addData = async () => {
    Keyboard.dismiss();
    setloader(true);
    const uid = auth().currentUser.uid;
    const ref = database().ref(`/technician/${uid}`);
    await ref.set({
      name: name,
      contact: number.value,
      address: address.value,
      birthDate: dob.value,
      company: company.value
    });
    setloader(false);
    navigation.navigate({ routeName: 'BottomTabNav' })
  };


  const pickImage = () => {
    return new Promise((resolve, reject) => {
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) return;
        if (response.error) {
          const message = `An error was occurred: ${response.error}`;
          reject(new Error(message));
          return;
        }
        const { path: uri } = response;
        resolve(uri);
        const dataa = response.data;
        setImage(dataa);
      });
    });
  };

  // 3.function to upload to firebase
  const uploadImage = async (fileName, uri) => {
    const user = firebase.auth().currentUser.uid;
    return new Promise(
      (resolve, reject) => {
        firebase.storage()
          .ref(`Technicians/${user}/${fileName}`)
          .putFile(uri)
          .then(resolve)
          .catch(reject);
      }
    );
  }

  const pickImageAndUpload = async () => {
    const uri = await pickImage();
    const fileName = 'Profile_Picture.jpg';
    await uploadImage(fileName, uri);
  }

  const renderFileData = () => {
    if (image) {
      return (
        <Image source={{ uri: 'data:image/jpeg;base64,' + image }}
          style={{
            width: 125, height: 132,
            justifyContent: "center",
            borderRadius: 100,
            borderWidth: 3
          }} />
      )
    }
    else {
      return (
        <View style={{ marginTop: 10, alignSelf: "flex-start" }}>
          <Image source={require('../assets/ic_a.png')}
            style={{
              width: 125, height: 132,
            }} />
        </View>
      )
    }
  }


  return (
    <Background>
      <TouchableOpacity onPress={pickImageAndUpload}>
        <View style={styles.image}>
          {renderFileData()}
        </View>
      </TouchableOpacity>
      <TextInput
        label="Phone Number"
        returnKeyType="next"
        keyboardType="numeric"
        value={number.value}
        onChangeText={text => setNumber({ value: text })} />
      <TextInput
        label="Your Address"
        returnKeyType="next"
        value={address.value}
        onChangeText={text => setAddress({ value: text })} />
      <TextInput
        label="Your Company"
        returnKeyType="next"
        value={company.value}
        onChangeText={text => setCompany({ value: text })} />
      <DatePicker
        style={{ marginTop: 15, borderRadius: 5, borderColor: "grey", borderWidth: 1, padding: 3 }}
        label="Date Of Birth"
        mode="date"
        value={dob.value}
        confirmBtnText="Confirm"
        onDateChange={date => { setDob({ value: date }) }}
        returnKeyType="next" />
      <Button mode="contained"
        onPress={addData} style={styles.button}>
        Next
        </Button>
      <AnimatedLoader
        visible={loader}
        source={require("../assets/loader.json")}
        overlayColor="rgba(255,255,255,0.75)"
        animationStyle={{ width: 100, height: 100 }}
        speed={1} />
    </Background>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 24
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderWidth: 3,
    marginLeft: 5,
    borderColor: "white",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    alignItems: "center",
    elevation: 5,
  }
})

export default SetupProfile;