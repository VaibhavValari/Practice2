import React, { useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import database from "@react-native-firebase/database";
import auth from '@react-native-firebase/auth';
import ErrorModal from '../components/ErrorModal';
import LottieView from 'lottie-react-native';
import AnimatedLoader from 'react-native-animated-loader';


const PendingScreen = ({ navigation }) => {
    const data = navigation.getParam('data');
    const bookingId = navigation.getParam('bookingId');
    const prob = data.problems;
    let problem = prob.split(',');
    console.log(data);
    const prodId = data.prod_id;
    const location = data.location;
    const nameArr = location.split(',');
    const latitude = nameArr[0];
    const longitude = nameArr[1];

    const [loader, setLoader] = useState(true);
    const [image, setImage] = useState('');
    const [pname, setPname] = useState('');
    const [complete, setComplete] = useState(true);
    const [show, setShow] = useState(false);


    useEffect(() => {
        retreive();
    }, [])

    const retreive = async () => {
        await database().ref(`products/${prodId}/`).once('value').then(snapshot => {
            setImage(snapshot.val().prod_image);
            setPname(snapshot.val().prod_name);
            setLoader(false);
        })
    };


    const problems = () => {
        return problem.map(element => {
            return (
                <View key={element} style={{ flex: 1,backgroundColor:"white", borderRadius: 20, borderColor: "silver",alignContent:"center" ,justifyContent: "flex-start", alignItems: "center", borderWidth: 0.5, padding: 8, margin: 3, flexDirection: "row" }}>
                    <Icon style={{ marginRight: 5, alignSelf: "center", color: "red", alignContent: "center", alignItems: "center" }}
                        name="alert-circle" size={15} />
                    <Text>{element}</Text>
                </View>
            )
        })
    }
    if (image === '') {
        return (
            <View>
                <AnimatedLoader
                    visible={loader}
                    source={require("../assets/loader.json")}
                    overlayColor="rgba(255,255,255,0.75)"
                    animationStyle={{ width: 100, height: 100 }}
                    speed={1} />
            </View>
        )
    }
    else
    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: "#F1F1F1" }}>
                <View style={{ marginHorizontal: "5%", paddingBottom: 10 }}>
                    <Text numberOfLines={1} style={{ fontSize: 33, paddingRight: 30, color: "black", fontWeight: "bold", marginBottom: 5 }}>{bookingId}</Text>
                    <View style={{ flexDirection: "row", marginVertical: 2, paddingTop: 10 }}>
                        <Icon style={{ alignSelf: "flex-start", color: "red", alignContent: "flex-end", alignItems: "flex-end", paddingBottom: 3 }}
                            name="calendar" size={20} />
                        <Text style={{ alignSelf: "center", textShadowRadius: 1, paddingLeft: 2, fontSize: 16 }}>{data.date}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginVertical: 2 }}>
                        <Icon style={{ alignSelf: "flex-start", color: "red", alignContent: "flex-end", alignItems: "flex-end", paddingBottom: 3 }}
                            name="clock" size={20} />
                        <Text style={{ alignSelf: "center", textShadowRadius: 1, paddingLeft: 2, fontSize: 16 }}>{data.time}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginVertical: 2 }}>
                        <Icon style={{ alignSelf: "flex-start", color: "red", paddingBottom: 3 }}
                            name="map-pin" size={20} />
                        <Text style={{ alignSelf: "center", marginHorizontal: 2, textShadowRadius: 1, fontSize: 16 }}>address</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginVertical: 10, marginLeft: 5 }}>
                        <View style={{
                            backgroundColor: "silver", elevation: 1, borderRadius: 20,
                            paddingHorizontal: 5, marginVertical: 2, marginHorizontal: 5
                        }}>
                            <Text style={{ color: "white", paddingBottom: 2, paddingHorizontal: 2 }}>Home</Text>
                        </View>
                        <View style={{
                            backgroundColor: "silver", elevation: 1, marginHorizontal: 5, borderRadius: 20,
                            paddingHorizontal: 5, marginVertical: 2, marginHorizontal: 5
                        }}>
                            <Text style={{ color: "white", paddingBottom: 2, paddingHorizontal: 2 }}>Work</Text>
                        </View>
                        <View style={{
                            backgroundColor: "silver", elevation: 1, borderRadius: 20,
                            paddingHorizontal: 5, marginVertical: 2, marginHorizontal: 5
                        }}>
                            <Text style={{ color: "white", paddingBottom: 2, paddingHorizontal: 2 }}>others</Text>
                        </View>
                    </View>
                </View>
                <View style={{
                    borderBottomColor: 'silver',
                    borderBottomWidth: 0.5, marginHorizontal: 15
                }} />
                <View style={{
                    paddingVertical: 5, marginBottom: "1%",
                    marginRight: "5%",
                    justifyContent: "space-around", alignSelf: "flex-start",
                    flexDirection: "row", marginLeft: "5%", paddingTop: 10, flex: 1
                }}>
                    <Image source={require('../assets/ic_a.png')}
                        style={{
                            alignSelf: "flex-start", resizeMode: "contain",
                            height: 60, width: 60
                        }} />
                    <View style={{ alignSelf: "center", marginLeft: "4%", marginTop: 5 }}>
                        <Text style={{
                            fontSize: 18, color: "black",
                            fontWeight: "700", alignSelf: "stretch"
                        }}>cname</Text>
                        <Text style={{ marginLeft: "3%", fontSize: 14 }}>contact</Text>
                    </View>
                </View>
                <View style={{
                    borderBottomColor: 'silver',
                    borderBottomWidth: 0.5, marginHorizontal: 15
                }} />
                <View style={{ marginHorizontal: "5%", marginTop: 15 }}>
                    <Text style={{
                        fontSize: 18, color: "black",
                        fontWeight: "bold", alignSelf: "stretch"
                    }}>
                        Complaint Details</Text>
                    <Text style={{ paddingTop: 20, fontSize: 15, paddingHorizontal: "4%", textAlign: "justify" }}>message</Text>
                    <View style={{marginVertical:10}}>{problems()}</View>
                </View>
                <View style={{ marginTop: 10, marginHorizontal: "5%" }}>
                    <Text style={{
                        fontSize: 18, color: "black",
                        fontWeight: "bold", alignSelf: "stretch"
                    }}>
                        Product Details
                </Text>
                    <View style={{ flex: 1, paddingVertical: 10 }}>
                        <Image
                            source={{ uri: image }}
                            style={{
                                height: 180, width: 180, resizeMode: "contain",
                                flex: 1, alignSelf: "center",
                                paddingVertical: 20
                            }} />
                    </View>
                </View>
                <View style={{ flex: 1, marginHorizontal: 30, marginTop: 20, flexDirection: "row" }}>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <View style={{ alignItems: "flex-start", elevation: 1, backgroundColor: "white", padding: 5 }}>
                            <Text>product name</Text>
                        </View>
                        <View style={{ alignItems: "flex-start", padding: 5 }}>
                            <Text>company name</Text>
                        </View>
                        <View style={{ alignItems: "flex-start", elevation: 1, backgroundColor: "white", padding: 5 }}>
                            <Text>model</Text>
                        </View>
                        <View style={{ alignItems: "flex-start", padding: 5 }}>
                            <Text>date of purchase</Text>
                        </View>
                        <View style={{ alignItems: "flex-start", elevation: 1, backgroundColor: "white", padding: 5 }}>
                            <Text>warranty</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <View style={{ alignItems: "flex-start", elevation: 1, backgroundColor: "white", padding: 5 }}>
                            <Text numberOfLines={1}>{pname}</Text>
                        </View>
                        <View style={{ alignItems: "flex-start", padding: 5 }}>
                            <Text>hh</Text>
                        </View>
                        <View style={{ alignItems: "flex-start", elevation: 1, backgroundColor: "white", padding: 5 }}>
                            <Text>gg</Text>
                        </View>
                        <View style={{ alignItems: "flex-start", padding: 5 }}>
                            <Text>hh</Text>
                        </View>
                        <View style={{ alignItems: "flex-start", elevation: 1, backgroundColor: "white", padding: 5 }}>
                            <Text>----</Text>
                        </View>
                    </View>
                </View>
                <View style={{
                    marginVertical: 30, marginHorizontal: 20, elevation: 1,
                    justifyContent: "center", alignItems: "center", backgroundColor: "white"
                }}>
                    <Image style={{ width: "100%", height: 200, borderRadius: 2 }} source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=600x800&maptype=roadmap&markers=color:red%7Clabel:S%7C${latitude},${longitude}&key=AIzaSyBhsYbmkBufF5SW-nb2tEsHKSV5A6J1_u8` }} />
                </View>
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.navigate({
                            routeName: "MapScreen",
                            params: { latitude: latitude, longitude: longitude }
                        })
                    }}
                    style={{ height: "100%", width: "100%" }}>
                    <View style={{ backgroundColor: "#346cff", elevation: 2, marginBottom: 10, position: "relative", marginHorizontal: "10%", paddingVertical: 8, borderRadius: 5 }}>
                        <Text style={{ color: "white", fontWeight: "bold", alignSelf: "center" }}>Open Maps</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    style={{ height: "100%", width: "100%" }}
                    onPress={() => {
                        const args = {
                            number: contact,
                            prompt: false
                        }
                        call(args).catch(console.error)
                    }}>
                    <View style={{ backgroundColor: "#346cff", elevation: 2, marginBottom: 90, position: "relative", marginHorizontal: "10%", paddingVertical: 8, borderRadius: 5 }}>
                        <Text style={{ color: "white", fontWeight: "bold", alignSelf: "center" }}>Call</Text>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
            {complete ?
                <TouchableWithoutFeedback onPress={async () => {
                    setComplete(false);
                    setShow(true);
                    await database().ref(`/bookings/${bookingId}/`).child(`status`).set("completed").then(status => {
                        console.log(status);
                        return null;
                    })
                }}>
                    <View style={styles.bottomContainer}>
                        <Text style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 18,
                            textTransform: "uppercase",
                            textAlign: "left"
                        }}>complete</Text>
                    </View>
                </TouchableWithoutFeedback>
                :
                <View style={styles.bottomContainer1}>
                    <Text style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 18,
                        textTransform: "uppercase",
                        textAlign: "left"
                    }}>completed</Text>
                </View>}
            <ErrorModal onPress={() => { setShow(false) }} toggle={show}>
                <View style={{
                    height: 300,
                    marginTop: 20,
                    width: "100%",
                }}>
                    <LottieView source={require('../assets/test.json')} autoPlay loop />
                </View>
                <Text style={{
                    fontSize: 25,
                    marginTop: 30,
                    fontWeight: "bold",
                    textAlign: "center",
                }}>Success!!</Text>
                <Text style={{
                    // borderWidth: 1,
                    width: "90%",
                    alignSelf: "center",
                    margin: 12,
                    fontSize: 17,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "rgba(0,0,0,0.4)",
                }}>
                    Appointment Completed
          </Text>
            </ErrorModal>
        </View>
    )
}
PendingScreen.navigationOptions = ({ navigation }) => {

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
        headerLeft: () => <Icon name="arrow-left" style={{ paddingLeft: 15, marginTop: 10, color: "black" }}
            onPress={() => { navigation.navigate({ routeName: 'Appointments' }) }} size={25} />

    }
};

const styles = StyleSheet.create({
    bottomContainer: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        backgroundColor: "#346cff"
    },
    bottomContainer1: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        backgroundColor: "#00e304"
    }
})
export default PendingScreen;
