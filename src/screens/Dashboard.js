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
import { fonts } from '../core/fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import RNLocation from 'react-native-location';
import colors from '../core/colors';

let pushData = [];

const Dashboard = ({ navigation }) => {

  useEffect(() => {
    _checPermission();
  }, []);

  useEffect(() => {
    msg();
  }, []);

  const msg = async () => {
   await
    messaging()
    .getToken()
    .then(data => {
      const uid = auth().currentUser.uid;
      database()
      .ref(`/technician/${uid}/`)
      .child(`token`)
      .set(data);
    });
  }



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

  const u = auth().currentUser.uid
  let data = [];
  const _getLocation = () => {
    RNLocation.getLatestLocation({ timeout: 60000 }).then(latestLocation => {
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

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    messageHandler();
    fetchData();
  }, []);

  const messageHandler = () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("hii")
    });
  };


  const [state, setState] = useState();
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      _addDataToList(remoteMessage.data);
      PushNotification.configure({
        onNotification: function (notification) {
          console.log(notification);
        },
        popInitialNotification: true,
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
            bookingId: item.booking_id,
            cname: item.name,
            latlang: item.latlng,
            address: item.address,
            date: item.date,
            prodId: item.prod_id,
            time: item.time,
            customerId: item.uid,
            problems: item.problems,
            userToken: item.token
          }
        })
      }}>
        <View style={styles.view} key={item.booking_id}>
          <View style={styles.con}>
            <Image
              style={{
                height: 50, width: "14%", marginLeft: 10
              }}
              source={require("../assets/ic_a.png")} />
            <View>
              <Text numberOfLines={1} style={styles.title}>{item.booking_id}</Text>
              <Text style={{ fontSize: 13, marginLeft: 12, fontFamily: "productsans_bold" }}>{item.name}</Text>
            </View>
            <View style={styles.iconCon}>
              <Icon style={styles.icon}
                name="md-navigate" size={20} />
            </View>
          </View>
          <Text numberOfLines={3} style={styles.message}>{item.problems}</Text>
          <View style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            marginTop: 10,
            paddingLeft: 20
          }}>
            <Icon style={{
              alignSelf: "center",
              alignContent: "flex-end",
              alignItems: "flex-end",
              paddingBottom: 3
            }}
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

  let completed = [];
  let pending = [];
  const [arrayP, setArrayP] = useState([]);
  const [arrayC, setArrayC] = useState([]);
  const techid = auth().currentUser.uid;
  const fetchData = async () => {
    await database().ref(`bookings/`)
      .orderByChild('tech_id')
      .equalTo(techid)
      .once('value')
      .then((snapshot) => {
        snapshot.forEach((friendSnapshot) => {
          const bookingId = friendSnapshot.key;
          const key = friendSnapshot.child('status').val();
          if (key === "pending") {
            pending.push(bookingId);
          }
          else {
            completed.push(bookingId);
          }
        });
        setArrayP(pending);
        setArrayC(completed);
      });
  };


  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView style={{ marginTop: 20 }} horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.view1}>
            <View style={{ marginTop: 20, flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 38, color: "white", fontFamily: "bbol", marginLeft: 30 }}>{arrayP.length}</Text>
              <View style={{ marginTop: 5, marginLeft: 30, alignSelf: "center", marginRight: 30, borderRadius: 30, elevation: 1 }}>
                <Icon color="white" size={20} style={{ padding: 5, paddingLeft: 5 }} name="md-construct" />
              </View>
            </View>
            <Text style={styles.cardText2}>ACTIVE</Text>
            <Text style={{ fontFamily: "bbol", color: "white", textAlign: "left", marginLeft: 30, fontSize: 12 }}>appointments</Text>

          </View>
          <View style={styles.view2}>
            <View style={{ marginTop: 20, flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 38, color: "white", fontFamily: "bbol", marginLeft: 30 }}>{arrayC.length}</Text>
              <View style={{ marginTop: 5, marginLeft: 20, alignSelf: "center", marginRight: 30, borderRadius: 30, elevation: 1 }}>
                <Icon color="white" size={20} style={{ padding: 5, paddingHorizontal: 7 }} name="md-checkmark-circle" />
              </View></View>
            <Text style={styles.cardText2}>COMPLETED</Text>
            <Text style={{ fontFamily: "bbol", color: "white", textAlign: "left", marginLeft: 30, fontSize: 12 }}>appointments</Text>
          </View>
        </ScrollView>
        <View style={{ justifyContent: "flex-start", alignSelf: "flex-start", marginLeft: 25 }}>
          <Text style={{ fontSize: 20, fontFamily: "bbol", textShadowRadius: 2 }}>Today's Appointments</Text>
        </View>
        <View style={styles.body}>
          {(pushData.length != 0) &&
            <FlatList
              data={pushData}
              renderItem={(item) => _renderItem(item)}
              keyExtractor={(item) => item.booking_id}
              extraData={state}
              horizontal={false}
            />
          }
          {(pushData.length == 0) &&
            <View style={styles.noData}>
              <Text style={styles.noDataText}>You don't have any Appointments Today.</Text>
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
  const name = auth().currentUser.displayName;
  return {
    headerTitle: `Hi, ${name}`,
    headerTitleStyle: {
      marginTop: 20,
      fontFamily: "bbol",
      textShadowRadius: 2
    },
    headerStyle: {
      elevation: 0,
      backgroundColor: "#f1f1f1"
    },
    headerRight: () => <Icon style={styles.images} name="md-chatbubbles" size={25} onPress={Go} />,
  }
};

const styles = StyleSheet.create({
  cardText: {
    fontSize: 30,
    fontFamily: "bbol",
    color: "white",
    textShadowRadius: 10,
    paddingLeft: 30,
    paddingTop: 20,
    alignSelf: "flex-start",
  },
  cardText2: {
    fontSize: 20,
    fontFamily: "bbol",
    color: "white",
    textShadowRadius: 10,
    marginTop: 35,
    paddingLeft: 30,
    alignSelf: "flex-start",
  },
  images: {
    width: 28,
    height: 28,
    marginTop: 20
  },
  con: {
    flex: 0,
    backgroundColor: "white",
    flexDirection: "row",
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 0,
    borderTopEndRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomWidth: 0.1,
    borderBottomColor: "silver",
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignContent: "space-around",
    width: "100%",
  },
  title: {
    fontSize: 14,
    fontFamily: "bbol",
    marginLeft: 10,
    alignSelf: "flex-start",
    paddingTop: 3,
    width: "100%"
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
    fontFamily: "bbol"
  },
  message: {
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginTop: 15,
    fontFamily: "breg"
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
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    elevation: 15,
    borderRadius: 10,
    paddingTop: 2,
    height: 180,
    width: 260,
    marginBottom: 25,
    justifyContent: "flex-start",

  },
  view2: {
    marginVertical: 10,
    backgroundColor: colors.primaryLight,
    elevation: 15,
    borderRadius: 10,
    paddingTop: 2,
    height: 180,
    width: 260,
    marginBottom: 25,
    justifyContent: "flex-start",
    marginRight: 20

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
  iconCon: {
    borderRadius: 90,
    borderWidth: 0,
    elevation: 0.7,
    marginLeft: 50,
    overflow: "hidden",
    backfaceVisibility: "visible",
    backgroundColor: colors.accentLight,
    alignContent: "flex-start",
    width: 30,
    alignItems: "flex-start",
    alignSelf: "center",
    justifyContent: "flex-start"
  },
  icon: {
    alignSelf: "center",
    alignContent: "center",
    color: colors.primary,
    paddingVertical: 5,
    marginLeft: 5,
    paddingRight: 2,
    transform: [{ rotate: '50deg' }]
  }
})

export default Dashboard;