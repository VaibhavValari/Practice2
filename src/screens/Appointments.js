import React, { useEffect, useState } from 'react';
import {
  Image, View, Text, ScrollView,
  StyleSheet, TouchableWithoutFeedback,
  RefreshControl, TouchableNativeFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AnimatedLoader from 'react-native-animated-loader';


const Appointments = ({ navigation }) => {

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [arrayP, setArrayP] = useState([]);
  const [arrayC, setArrayC] = useState([]);

  let pending = [{
    "bookingId": "-M7TrW5TO9pttY5BL7prriRB",
    "pData": {
      "date": "19-05-2020",
      "location": "15.5298181,73.8334979",
      "problems": "Display not working,Device Not Turning On",
      "prod_id": "prod_2", "status": "completed",
      "tech_id": "3yy9Nvu6YoP66LK74j6fRLexVfo1",
      "time": "6:00 PM",
      "uid": "hOBZg7on2we9c0TmNoMdH7i0nZB3"
    }
  }];
  let completed = [{
    "bookingId": "-M7TrW5TO9pY5BL7prriRB",
    "cData": {
      "date": "19-05-2020",
      "location": "15.5298181,73.8334979",
      "problems": "Display not working,Device Not Turning On",
      "prod_id": "prod_2", "status": "completed",
      "tech_id": "3yy9Nvu6YoP66LK74j6fRLexVfo1",
      "time": "6:00 PM",
      "uid": "hOBZg7on2we9c0TmNoMdH7i0nZB3"
    }
  }];

  useEffect(() => {
    fetchData();
  }, []);

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

            let pData = friendSnapshot.val();
            pending.push({ pData, bookingId });
          }
          else {
            let cData = friendSnapshot.val();
            completed.push({ cData, bookingId });
          }
        });
        setArrayP(pending);
        setArrayC(completed);
        setLoading(false);
      });
  };


  const list = () => {
    return arrayP.map((element, i) => {
      return (
        <TouchableWithoutFeedback key={element.bookingId} onPress={() => {
          navigation.navigate({
            routeName: 'PendingScreen',
            params: {
              bookingId: element.bookingId,
              data: element.pData
            }
          })
        }
        }>
          <View style={styles.conatiner}>
            <View style={{
              width: 95,
              height: 95,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: "white",
              backgroundColor:"white",
              elevation:3
            }}>
              <Image source={require('../assets/ic_a.png')}
                style={{ resizeMode: "contain", height: 100, width: 100, alignSelf: "center" }} />
            </View>
            <View style={{  width: "100%"}}>
              <Text numberOfLines={1} style={{marginTop:5,fontWeight:"bold", color: "#605858", paddingHorizontal: 20, fontSize: 18 }}>{element.bookingId}</Text>
              <Text style={{ textAlign: "left",marginLeft:30, fontSize: 13, color: "#696363",paddingBottom:5 }}>Vaibhav Naik</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
    })
  };

  const complete = () => {
    return arrayC.map((element, i) => {
      return (
        <TouchableNativeFeedback key={element.bookingId} onPress={() => {
          navigation.navigate({
            routeName: 'CompletedScreen',
            params: {
              bookingId: element.bookingId,
              data: element.cData
            }
          })
        }
        }>
          <View style={styles.conatiner1}>
            <View style={{ height: 50, width: 50, justifyContent: "center", alignItems: "center", alignContent: "center", alignSelf: "center" }}>
              <Image source={require('../assets/ic_a.png')} style={{ alignSelf: "center", height: "100%", width: "100%" }} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text numberOfLines={1} style={{ fontSize: 18, paddingTop: 5 }}>{element.bookingId}</Text>
              <Text style={{ textAlign: "left", fontSize: 15, paddingLeft: 10 }}>vaibhav naik</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      )
    })
  };

  const _onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false);
    });
  };

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            progressBackgroundColor="#FF9F9F"
            refreshing={refreshing}
            onRefresh={_onRefresh} />}>
        <View style={{
          alignContent: "flex-start", justifyContent: "center",
          marginTop: 30, alignItems: "flex-start",
          alignSelf: "flex-start", marginLeft: 20
        }}>
          <Text style={{ fontSize: 20,fontWeight:"bold" }}>Pending Appointents</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {list()}
        </ScrollView>
      </ScrollView>
      <View style={{
        alignContent: "flex-start", justifyContent: "center",
        marginLeft: 20, marginTop: 20,
        alignItems: "flex-start", alignSelf: "flex-start"
      }}>
        <Text style={{ fontSize: 20,fontWeight:"bold", marginBottom: 20 }}>Completed Appointents</Text>
      </View>
      <View style={{ height: 350, backgroundColor: "#f1f1f1" }}>
        <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
          {complete()}
        </ScrollView>
      </View>
      <AnimatedLoader
        visible={loading}
        source={require("../assets/loader.json")}
        overlayColor="rgba(255,255,255,0.75)"
        animationStyle={{ width: 100, height: 100 }}
        speed={1} />
    </View>
  )
};

const styles = StyleSheet.create({
  conatiner: {
    marginHorizontal: 20,
    marginVertical: 20,
    flex: 1,
    width: 170,
    height: 160,
    textAlign: "center",
    backgroundColor: "#e4cdfd",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 15,
    paddingTop: 10,
    marginTop: 30,
    elevation: 5
  },
  conatiner1: {
    flex: 1,
    width: "100%",
    textAlign: "center",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: "5%",
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "silver",
    backgroundColor: "#f1f1f1"
  }

})
export default Appointments;