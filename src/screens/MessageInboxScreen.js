import React, { useEffect, useState } from 'react';
import {
  Image, View, Text, ScrollView,
  StyleSheet, TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AnimatedLoader from 'react-native-animated-loader';
import ErrorModal from '../components/ErrorModal';




const MessageInboxScreen = (props) => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <View>
      <View style={{ flex: 1, paddingTop: 20, paddingLeft: 15,position:"absolute", }}>
        <Icon name="arrow-left" style={{ color: "black" }}
          onPress={() => { props.navigation.navigate({ routeName: 'Home' }) }} size={25} />
      </View>
      <View style={{
        paddingHorizontal: 0, marginTop: 50, justifyContent: "center",
        alignItems: "flex-start", marginLeft: 20
      }}>
        <Text style={{ fontSize: 30, color: "black", fontWeight: "bold", marginBottom: 0 }}>Inbox</Text>
      </View>
    </View>
  )
};

MessageInboxScreen.navigationOptions = ({ navigation }) => {

  return {
      headerMode: "none",
      headerTitleStyle: {

          color: "#F1F1F1"
      },
      headerTitleAlign: "center",
      headerStyle: {
          elevation: 0,
          backgroundColor: "#F1F1F1"
      },


  }
};

const styles = StyleSheet.create({
  conatiner: {
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 50,
    textAlign: "center",
    backgroundColor: "yellow",
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 3,
    elevation: 10

  },
  text: {
    fontSize: 20,
  }
})
export default MessageInboxScreen;