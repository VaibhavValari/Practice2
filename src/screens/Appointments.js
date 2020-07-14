import React, { useEffect, useState, useRef } from 'react';
import {
  Image, View, Text, ScrollView,
  StyleSheet, TouchableWithoutFeedback,
  RefreshControl, TouchableNativeFeedback,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AnimatedLoader from 'react-native-animated-loader';
import colors from '../core/colors';
import Date from '../components/Date';
import { Searchbar, IconButton } from 'react-native-paper';
import CustomerName from '../components/CustomerName';
import LinearGradient from 'react-native-linear-gradient';
import { Portal } from 'react-native-paper';
import { createFilter } from 'react-native-search-filter';
import { TouchableOpacity } from 'react-native-gesture-handler';


const Appointments = ({ navigation }) => {


  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [arrayP, setArrayP] = useState([]);
  const [arrayC, setArrayC] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pressed, setPressed] = useState(false);

  let pending = [];
  let completed = [];


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
            <View style={{ alignSelf: "flex-end" }}>
              <Date date={element.pData.date} />
            </View>
            <View style={{
              width: 74,
              overflow: "hidden",
              height: 74,
              borderRadius: 50,
              borderColor: "white",
              backgroundColor: "white"
            }}>
              <Image source={require('../assets/ic_a.png')}
                style={{ resizeMode: "contain", height: 80, width: 80, alignSelf: "center" }} />
            </View>
            <View style={{ marginTop: 7, backgroundColor: colors.primary, width: "100%", paddingVertical: 8 }}>
              <Text
                numberOfLines={1}
                style={{ fontFamily: "bbol", color: "white", paddingHorizontal: 10, fontSize: 15 }}>
                id {element.bookingId}</Text>
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
        }}>
          <View>
            <View style={styles.conatiner1}>
              <View style={{
                marginTop: 6, height: 50, width: 50, overflow: "hidden",
                borderRadius: 50,
                justifyContent: "center", alignItems: "center",
                alignContent: "center", alignSelf: "center"
              }}>
                <Image source={require('../assets/ic_a.png')} style={{ resizeMode: "contain", alignSelf: "center", height: "100%", width: "100%" }} />
              </View>
              <View style={{ marginLeft: 15, alignitems: "flex-start", justifyContent: "flex-start" }}>
                <View style={{ borderWidth: 0.6, borderRadius: 5, paddingHorizontal: 3, borderColor: "silver", backgroundColor: "#f8f8f8" }}><Text numberOfLines={1} style={{ fontSize: 13, fontFamily: "breg" }}>id {element.bookingId}</Text>
                </View>
                <CustomerName style={{ alignSelf: "flex-start", marginLeft: 3 }} uid={element.cData.uid} />
              </View>
              <Icon name="chevron-right" style={{ color: colors.primaryLight, alignSelf: "center", marginLeft: 65 }} size={25} />
            </View>
            <View style={{ marginLeft: 80, marginRight: 70, borderBottomColor: "silver", borderBottomWidth: 0.6 }} />
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

  const KEYS_TO_FILTERS = ["bookingId", "cData.date"];
  const filteredList = arrayC.filter(
    createFilter(searchQuery, KEYS_TO_FILTERS)
  );

  const showSearch = () => {
    if (pressed) {
      return (
        <Portal>
          <Animated.View style={{
            opacity: fade,
            backgroundColor: "white",
            alignSelf: "center",
            marginTop: 165,
            flex: 1,
            width: "88%",
            borderRadius: 5,
            padding: 15,
            flexDirection: "column"
          }}>
            {filteredList.map(element => {
              return (
                <TouchableNativeFeedback key={element.bookingId} onPress={() => {
                  setPressed(false)
                  navigation.navigate({
                    routeName: 'CompletedScreen',
                    params: {
                      bookingId: element.bookingId,
                      data: element.cData
                    }
                  })
                }}>
                  <View style={styles.constainer2}>
                    <View style={styles.imageCon}>
                      <Image
                        source={require('../assets/ic_a.png')}
                        style={{ resizeMode: "contain", alignSelf: "center", height: "100%", width: "100%" }} />
                    </View>
                    <View style={{ flexDirection: "column", marginLeft: 10, marginTop: 10 }}>
                      <View style={{ borderRadius: 5, borderColor: "silver", borderWidth: 0.6, paddingHorizontal: 3, backgroundColor: "white" }}><Text numberOfLines={1} style={{ fontSize: 13, fontFamily: "breg" }}>id {element.bookingId}</Text>
                      </View>
                      <CustomerName style={{ alignSelf: "flex-start", marginLeft: 3 }} uid={element.cData.uid} />
                    </View>
                    <Icon name="chevron-right" style={{ color: colors.primaryLight, alignSelf: "center", marginLeft: 40 }} size={25} />
                  </View>
                </TouchableNativeFeedback>
              )
            })
            }
          </Animated.View>
        </Portal>
      )
    }
    else {
      return null;
    }
  }

  const fade = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    setPressed(true);
    Animated.timing(fade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fade, {
      toValue: 0,
      duration: 200,
      delay: 100,
      useNativeDriver: true
    }).start(() => {
      setPressed(false);
    });
  }


  return (
    <LinearGradient
      //colors={['#ecb8a5', '#ecb8a5', '#eccfc3', '#f1f1f1', '#f1f1f1', '#f1f1f1']}
      colors={['#f1f1f1', '#f1f1f1', '#f1f1f1']}
      style={{ backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={colors.primaryLight}
            refreshing={refreshing}
            onRefresh={_onRefresh} />}>
        <View style={{ marginLeft: 18, alignSelf: "flex-start" }}>
          <Text style={{ fontFamily: "bbol", fontSize: 22, color: "black" }}>Your Appointments</Text>
        </View>
        <Searchbar
          style={{ marginLeft: 25, marginRight: 25, marginTop: 20, elevation: 5, backgroundColor: "white" }}
          placeholder="Search"
          onChangeText={text => { setSearchQuery(text); }}
          onFocus={fadeIn}
          onBlur={fadeOut}
          value={searchQuery}
          clearIcon={<Icon name="clipboard" size={23} />}
        />
        <View>
          {showSearch()}
        </View>
        <View style={{ alignSelf: "flex-end", flex: 1, width: 100, marginTop: 5,elevation:6, transform: [{ rotate: '90deg' }] }}>
          <Icon color="grey" name="sliders" size={20} /></View>
        <View style={{
          alignContent: "flex-start", justifyContent: "center",
          alignItems: "flex-start",
          alignSelf: "flex-start", marginLeft: 24
        }}>
          <Text style={{ fontFamily: "bbol", fontSize: 21, color: "black" }}>Active</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginLeft: 4 }}>
          {
            arrayP.length > 0 ?
              list()
              :
              <Text style={styles.msg}>you have no appointments yet</Text>
          }
        </ScrollView>
      </ScrollView>
      <View style={{
        alignContent: "flex-start", justifyContent: "center",
        marginLeft: 24,
        alignItems: "flex-start", alignSelf: "flex-start"
      }}>
        <Text
          style={{ fontSize: 20, fontFamily: "bbol", color: "black" }}>
          Completed</Text>
      </View>
      <View style={{ paddingVertical: 10, backgroundColor: "#f1f1f1" }}>
        <ScrollView
          style={{ height: 247, marginLeft: 3 }}
          vertical
          showsVerticalScrollIndicator={false}>
          {
            arrayC.length>0 ?
              complete()
              :
              <Text style={styles.msg}> you have no appointments yet</Text>
          }
        </ScrollView>
      </View>
      <AnimatedLoader
        visible={loading}
        source={require("../assets/loader.json")}
        overlayColor="rgba(255,255,255,0.75)"
        animationStyle={{ width: 100, height: 100 }}
        speed={1} />
    </LinearGradient>
  )
};

Appointments.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: null,
    headerStyle: {
      elevation: 0,
      backgroundColor: "#f1f1f1"
    },
    headerTitleStyle: {
      marginTop: 20
    }
  }
}
const styles = StyleSheet.create({
  msg:{
    fontFamily:"breg",
    margin:10,
    marginLeft:30,
    marginVertical:10
  },
  imageCon: {
    marginTop: 6,
    height: 40,
    width: 40,
    overflow: "hidden",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center"
  }
  ,
  conatiner: {
    marginHorizontal: 20,
    marginVertical: 10,
    flex: 1,
    width: 140,
    height: 167,
    textAlign: "center",
    backgroundColor: colors.accentLight,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 10,
    marginTop: 20,
    elevation: 5,
    marginBottom: 30
  },
  conatiner1: {
    flex: 1,
    width: "100%",
    textAlign: "center",
    alignSelf: "center",
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: "5%",
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
  },
  constainer2: {
    width: "90%",
    flexDirection: "row",
    textAlign: "center",
    alignSelf: "flex-start",
    marginLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 0.5
  }

})
export default Appointments;