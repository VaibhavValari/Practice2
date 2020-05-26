import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  StatusBar,
  FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import RNLocation from 'react-native-location';

let pushData = [
  {
    cName: "Vaibhav Naik",
    address: "H.no.358 Nerul Titawado Bardez Goa 403114",
    contact: "9158493829",
    bookingId: "123454",
    prod_id: "prod_1",
    problems: "Display not working,Device Not Turning On",
    message: "My TV has been broken for along time..so i want to get it fixed as soon as possible..it doesnt start,and also makes sound when turned on.",
    date: '10-10-2020',
    time: '12:30 pm',
    location: {},
    uid: ""
  },

]


const Dashboard = ({ navigation }) => {

  useEffect(() => {
    _checPermission();
  }, []);

  const _checPermission = () => {
    RNLocation.checkPermission({
      android: {
        detail: "fine"
      }
    }).then(granted => {
      if (granted) {
        _getLocation();
      } else {
        _getPermission();
      }
    })
  }

  const _getLocation = () => {
    RNLocation.getLatestLocation({ timeout: 60000 }).then(latestLocation => {
      const u = auth().currentUser.uid
      let data = [];
      data.push(latestLocation.latitude);
      data.push(latestLocation.longitude);
      const set = data.toString();
      database().ref(`technician/${u}/coordinates`).set(set);
    })
  };

  const _getPermission = () => {
    RNLocation.requestPermission({
      android: {
        detail: "fine",
        rationale: {
          title: "we need to access your location",
          message: "we use your location get the route",
          buttonPositive: "Ok",
          buttonNegative: "cancel"
        }
      }
    }).then(granted => {
      if (granted) {
        _getLocation();
      }
    })
  }

  useEffect(() => {
    messageHandler();
  },[]);

  const messageHandler = () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      _addDataToList(remoteMessage.data);
      console.log("back",+remoteMessage);
    });
    messaging().onNotificationOpenedApp(remoteMessage=>{
      _addDataToList(remoteMessage.data);
      console.log("on",remoteMessage);
    });
    messaging().getInitialNotification(remoteMessage=>{
      _addDataToList(remoteMessage.data);
      console.log("initial",remoteMessage);
    });
  };
 

  const [state, setState] = useState();
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('FCM Message Data:', remoteMessage);
      _addDataToList(remoteMessage.data);
      PushNotification.configure({
        onNotification: function (notification) {
          //console.log(notification);
        },
        //popInitialNotification: true,
        requestPermissions: true
      });
    });
    return () => { unsubscribe() };
  });

  const _renderItem = ({ item }) => (
    <View>
      <TouchableWithoutFeedback onPress={() => {
        navigation.navigate({
          routeName: 'DetailScreen',
          params: {
            id: item.message,
            bookingId: item.bookingId,
            cname: item.cName,
            address: item.address,
            contact: item.contact,
            date: item.date,
            prodId: item.prod_id,
            time: item.time,
            location: item.location,
            customerId: item.uid,
            problems: item.problems
          }
        })
      }}>
        <View style={styles.view} key={item.bookingId}>
          <View style={styles.con}>
            <Image
              style={{
                height: 50, width: "15%", alignSelf: "center",
                justifyContent: "center", alignItems: "center"
              }}
              source={require("../assets/ic_a.png")} />
            <View style={{ flex: 0.7 }}>
              <Text style={styles.title}>{item.bookingId}</Text>
              <Text style={{ fontSize: 12, paddingLeft: 12 }}>{item.cName}</Text>
            </View>
            <View style={{
              borderRadius: 90, borderWidth: 0, elevation: 0.7,
              overflow: "hidden",
              backfaceVisibility: "visible", marginLeft: 60,
              backgroundColor: "#F1F1F1", alignContent: "flex-start",
              width: 30, alignItems: "flex-start", alignSelf: "center",
              justifyContent: "flex-start"
            }}>
              <Icon style={{
                alignSelf: "center", alignContent: "center",
                color: "#7530ff", paddingVertical: 5, marginLeft: 5, paddingRight: 2,
                transform: [{ rotate: '50deg' }]
              }}
                name="md-navigate" size={20} />
            </View>
          </View>
          <Text numberOfLines={3} style={styles.message}>{item.message}</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", marginTop: 10, paddingLeft: 20 }}>
            <Icon style={{ alignSelf: "center", alignContent: "flex-end", alignItems: "flex-end", paddingBottom: 3 }}
              name="md-alarm" size={25} />
            <Text style={styles.date}>{item.date}</Text></View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );


  const _addDataToList = (data) => {
    //console.log('data', data);
    let array = pushData;
    array.push(data);
    setState({
      pushData: array
    });
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView style={{ marginTop: 20 }} horizontal={true} showsHorizontalScrollIndicator={false}>
          <TouchableWithoutFeedback>
            <View style={styles.view1}>
              <Text style={{
                fontSize: 30, fontWeight: "bold",
                color: "white", textShadowRadius: 10,
                paddingLeft: 20, paddingTop: 10, alignSelf: "flex-start",
              }}>01</Text>
              <Text style={{
                fontSize: 18, fontWeight: "bold",
                color: "white", textShadowRadius: 10,
                paddingLeft: 20, alignSelf: "flex-start",
              }}>Assigned</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <View style={styles.view2}>
              <Text style={{
                fontSize: 30, fontWeight: "bold",
                color: "white", textShadowRadius: 10,
                paddingLeft: 20, paddingTop: 10, alignSelf: "flex-start",
              }}>01</Text>
              <Text style={{
                fontSize: 18, fontWeight: "bold",
                color: "white", textShadowRadius: 10,
                paddingLeft: 20, alignSelf: "flex-start",
              }}>Assigned</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <View style={styles.view3}>
              <Text style={{
                fontSize: 30, fontWeight: "bold",
                color: "white", textShadowRadius: 10,
                paddingLeft: 20, paddingTop: 10, alignSelf: "flex-start",
              }}>01</Text>
              <Text style={{
                fontSize: 18, fontWeight: "bold",
                color: "white", textShadowRadius: 10,
                paddingLeft: 20, alignSelf: "flex-start",
              }}>Assigned</Text>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        <View style={{ justifyContent: "flex-start", alignSelf: "flex-start", marginLeft: 25 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", textShadowRadius: 5 }}>Today's Appointments</Text>
        </View>
        <View style={styles.body}>
          {(pushData.length != 0) &&
            <FlatList
              data={pushData}
              renderItem={(item) => _renderItem(item)}
              keyExtractor={(item) => item.bookingId}
              extraData={state}
              horizontal={false}
            />
          }
          {(pushData.length == 0) &&
            <View style={styles.noData}>
              <Text style={styles.noDataText}>You don't have any Appointments yet.</Text>
            </View>}
        </View>
      </SafeAreaView>
    </ScrollView>
  )
};

Dashboard.navigationOptions = ({ navigation }) => {
  const Go = () => {
    navigation.navigate({ routeName: 'MessageInboxScreen' });
  }
  return {
    headerTitle: 'Home',

    headerRight: () => <Icon style={styles.images} name="md-chatbubbles" size={25} onPress={Go} />,
  }
};

const styles = StyleSheet.create({
  images: {
    width: 28,
    height: 28,
  },
  con: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 10,
    borderTopEndRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomWidth: 0.1,
    borderBottomColor: "silver",
    backgroundColor: "white"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    alignSelf: "flex-start",
    paddingTop: 3,
  },
  container: {
    paddingLeft: 10,
    paddingTop: 20,
    backgroundColor: "#F1F1F1",
    width: '100%',
  },
  noData: {
    paddingVertical: 50,
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  date: {
    fontSize: 13,
    alignSelf: "flex-end",
    paddingBottom: 15,
    paddingRight: 20,
    paddingLeft: 5,
    paddingTop: 15,
    fontWeight: "bold"
  },
  view: {
    borderRadius: 6,
    marginVertical: 10,
    backgroundColor: "white",
    marginHorizontal: 15,
    elevation: 2,
    paddingVertical: 5,
  },
  view1: {
    marginVertical: 10,
    backgroundColor: "#07f607",
    marginHorizontal: 20,
    elevation: 15,
    borderRadius: 10,
    paddingTop: 2,
    height: 180,
    width: 260,
    marginBottom: 25,
    justifyContent: "center",

  },
  view2: {
    marginVertical: 10,
    backgroundColor: "#369fff",
    elevation: 15,
    borderRadius: 10,
    paddingTop: 2,
    height: 180,
    width: 260,
    marginBottom: 25,
    justifyContent: "center",

  },
  view3: {
    marginVertical: 10,
    backgroundColor: "#ff6969",
    marginHorizontal: 20,
    elevation: 15,
    borderRadius: 10,
    paddingTop: 2,
    height: 180,
    width: 260,
    marginBottom: 25,
    justifyContent: "center",

  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#F1F1F1",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
})

export default Dashboard;