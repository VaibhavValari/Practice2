
import React, { useState, useEffect } from "react";
import { ListItem } from 'react-native-elements';
import Background from "../components/Background";
import {
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  View,
  FlatList,
  Text
} from 'react-native';
import Button from "../components/Button";
import Icon from 'react-native-vector-icons/Ionicons';
import auth, { firebase } from "@react-native-firebase/auth";
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

const Profile = ({ navigation }) => {
  const [currentEmail, setCurrentEmail] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState(``);
  const [timeout, setTimeout] = useState(true);

  //getImage
  useEffect(() => {
    const getAndLoadHttpUrl = async () => {
      const userr = auth().currentUser.uid;
      {
        const ref = storage().ref(`Technicians/${userr}/Profile_Picture.jpg`);
        await ref.getDownloadURL().then(data => {
          setUrl(data);

        }).catch(error => {
          console.log(error);
        }).then(time => {
          setTimeout(false);
        }, 9000);
      }
    }
    return () => { getAndLoadHttpUrl() };
  });

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setName(user.displayName);
        setCurrentEmail(user.email);
      } else {
        console.log("Dashboard user: null");
      }
    });
    return () => { unsubscribe() };
  });

  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    const userrr = auth().currentUser.uid;
    const db = database().ref(`technician/${userrr}/`).on('value', snapshot => {
      setAddress(snapshot.val().address),
      setAge(snapshot.val().birthDate),
      setPhone(snapshot.val().contact),
      setCompany(snapshot.val().company)
    });
    return () => { db };
  });

  //Firebase Auth
  const user = auth().currentUser.user;
  const logoutHandler = async () => {
    await auth().signOut();
    navigation.navigate("HomeScreen");
  };

  return (
    <ScrollView>
      <View style={styles.header}></View>
      <View style={styles.image}>
        {timeout ?
          <View >
            <ActivityIndicator color='violet' size='large' /></View>
          : <Image source={{ uri: url }} style={styles.imag} />
        }
      </View>
      <View style={styles.imv}><Text style={styles.name}>{name}</Text></View>
      <View style={{ marginTop: 5 }}>
        <Text style={styles.Add}>{currentEmail}</Text>
      </View>
      <View style={styles.textC}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.text}>Your Address:</Text>
          <Text style={styles.text1}>{address}</Text>
        </View>
        <Text style={styles.text}>Date of Birth:    {age}</Text>
        <Text style={styles.text}>Contact No:      {phone}</Text>
        <Text style={styles.text}>Company:          {company}</Text>
      </View>
      <Button style={{ backgroundColor: "#600EE6", width: "60%", alignSelf: "center", marginTop: 100, }} mode="outlined" onPress={logoutHandler}>
        Logout
      </Button>
    </ScrollView>
  );
};

Profile.navigationOptions = ({ navigation }) => {

  const hii = () => {
    navigation.navigate({ routeName: 'UpdateProfile' });

  }
  return {
    headerTitle: 'Profile',
    headerRight: () => <Icon style={styles.images} name="md-create" size={23} onPress={hii} />
  }
};

const styles = StyleSheet.create({
  images: {
    width: 24,
    height: 24,
  },
  text: {
    fontSize: 17,
    fontFamily: 'verdana',
    padding: 10,
    color: "grey",
    textAlign: "left",
    marginLeft: "12%"
  },
  text1: {
    fontSize: 17,
    fontFamily: 'verdana',
    textAlign: "left",
    paddingVertical: 10,
    width: 150,
    color: "grey",
    textAlign: "left",
  },
  textC: {
    flex: 1,
    justifyContent: "center",
    marginTop: 20,
    paddingTop: 80,
    paddingBottom: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 3,
    elevation: 1,
    marginHorizontal: 20,
  },
  name: {
    fontSize: 24,
    textAlign: "center",
    justifyContent: "flex-start",
    textShadowRadius: 5,
    marginTop: 90,
    flex: 1
  },
  imv: {
    justifyContent: "space-evenly",
  },
  personm: {
    width: 132,
    height: 132,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    flex: 1,
    justifyContent: "flex-start",
  },
  Add: {
    fontSize: 16,
    alignSelf: 'center',
    justifyContent: "center"
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "white",
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: "center",
    position: 'absolute',
    marginTop: 90,
    elevation: 5,
  },
  imag: {
    width: 130,
    height: 130,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "white",

  },
  header: {
    backgroundColor: "#7530ff",
    height: 150,
    borderBottomColor: "black",
    elevation: 4
  }

})

export default Profile;