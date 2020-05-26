import React, { useState, useEffect } from 'react';
import {
    Image, View, Text, ScrollView,
    StyleSheet, TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import call from 'react-native-phone-call';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import auth from '@react-native-firebase/auth';
import AnimatedLoader from 'react-native-animated-loader';
import database from '@react-native-firebase/database';
import ErrorModal from '../components/ErrorModal';
import LottieView from 'lottie-react-native';
import Button from "../components/Button";
import storage from '@react-native-firebase/storage';


const DetailScreen = ({ navigation }) => {

    const bookingId = navigation.getParam('bookingId');
    const messageId = navigation.getParam('id');
    const cname = navigation.getParam('cname');
    const contact = navigation.getParam('contact');
    const date = navigation.getParam('date');
    const time = navigation.getParam('time');
    const prodId = navigation.getParam('prodId');
    const location = navigation.getParam('location');
    //const latlang = location.latlang;
    const address = navigation.getParam('address');
    const customerId = navigation.getParam('customerId');
    const prob = navigation.getParam('problems');
    const problem = prob.split(',');
    const userToken = navigation.getParam('userToken');

    const [reject, setReject] = useState(false);
    const [show, setShow] = useState(false);
    const [Alert, setAlert] = useState(false);
    const [loader, setLoader] = useState(false);
    const [loader1, setLoader1] = useState(true);
    const [image, setImage] = useState('');
    const [pname, setPname] = useState('');
    const [url, setUrl] = useState(``);
    const uid = auth().currentUser.uid;

    useEffect(() => {
        retreive();
        getAndLoadHttpUrl();
    }, [])

    const retreive = async () => {
        await database().ref(`products/${prodId}/`).once('value').then(snapshot => {
            setImage(snapshot.val().prod_image);
            setPname(snapshot.val().prod_name);
            setLoader1(false);
        })
    };

    const getAndLoadHttpUrl = async () => {
        const userr = auth().currentUser.uid;
        const ref = storage().ref(`Technicians/${userr}/Profile_Picture.jpg`);
        await ref.getDownloadURL().then(data => {
            setUrl(data);
            console.log(data);
        }).catch(error => {
            console.log(error);
        });
    };

    const problems = () => {
        return problem.map(element => {
            return (
                <View key={element} style={{ flex: 1, backgroundColor: "white", borderRadius: 20, borderColor: "silver", alignContent: "center", justifyContent: "flex-start", alignItems: "center", borderWidth: 0.5, padding: 8, margin: 3, flexDirection: "row" }}>
                    <Icon style={{ marginRight: 5, alignSelf: "center", color: "red", alignContent: "center", alignItems: "center" }}
                        name="alert-circle" size={15} />
                    <Text>{element}</Text>
                </View>
            )
        })
    };

    if (image === '') {
        return (
            <View>
                <AnimatedLoader
                    visible={loader1}
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
                        <Text style={{ fontSize: 33, color: "black", fontWeight: "bold", marginBottom: 5 }}>{bookingId}</Text>
                        <View style={{ flexDirection: "row", marginVertical: 2 }}>
                            <Icon style={{ alignSelf: "flex-start", color: "red", alignContent: "flex-end", alignItems: "flex-end", paddingBottom: 3 }}
                                name="calendar" size={20} />
                            <Text style={{ alignSelf: "center", textShadowRadius: 1, paddingLeft: 2, fontSize: 16 }}>{date}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginVertical: 2 }}>
                            <Icon style={{ alignSelf: "flex-start", color: "red", alignContent: "flex-end", alignItems: "flex-end", paddingBottom: 3 }}
                                name="clock" size={20} />
                            <Text style={{ alignSelf: "center", textShadowRadius: 1, paddingLeft: 2, fontSize: 16 }}>{time}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginVertical: 2 }}>
                            <Icon style={{ alignSelf: "flex-start", color: "red", paddingBottom: 3 }}
                                name="map-pin" size={20} />
                            <Text numberOfLines={1} style={{ alignSelf: "center", marginHorizontal: 2, textShadowRadius: 1, fontSize: 16 }}>{address}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginVertical: 10, marginLeft: 5 }}>
                            <View style={{
                                backgroundColor: "silver", borderRadius: 20,
                                paddingHorizontal: 5, marginVertical: 2, marginHorizontal: 5
                            }}>
                                <Text style={{ color: "white", paddingBottom: 2, paddingHorizontal: 2 }}>Home</Text>
                            </View>
                            <View style={{
                                backgroundColor: "silver", marginHorizontal: 5, borderRadius: 20,
                                paddingHorizontal: 5, marginVertical: 2, marginHorizontal: 5
                            }}>
                                <Text style={{ color: "white", paddingBottom: 2, paddingHorizontal: 2 }}>Work</Text>
                            </View>
                            <View style={{
                                backgroundColor: "silver", borderRadius: 20,
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
                            }}>{cname}</Text>
                            <Text style={{ marginLeft: "3%", fontSize: 14 }}>{contact}</Text>
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
                        <Text style={{ paddingTop: 20, fontSize: 15, paddingHorizontal: "4%", textAlign: "justify" }}>{messageId}</Text>
                        <View style={{ marginVertical: 10 }}>{problems()}</View>
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
                        <Image style={{ width: "100%", height: 200, borderRadius: 2 }} source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=15.2832,73.9862&zoom=14&size=600x800&maptype=roadmap&markers=color:red%7Clabel:S%7C15.2832,73.9862&key=AIzaSyBhsYbmkBufF5SW-nb2tEsHKSV5A6J1_u8` }} />
                    </View>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            navigation.navigate({
                                routeName: "MapScreen1",
                                params: { latitude: 15.2832, longitude: 73.9862 }
                            })
                        }}
                        style={{ height: "100%", width: "100%" }}>
                        <View style={{ backgroundColor: "#600EE6", elevation: 2, marginBottom: 10, position: "relative", marginHorizontal: "10%", paddingVertical: 8, borderRadius: 5 }}>
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
                        <View style={{ backgroundColor: "#600EE6", elevation: 2, marginBottom: 90, position: "relative", marginHorizontal: "10%", paddingVertical: 8, borderRadius: 5 }}>
                            <Text style={{ color: "white", fontWeight: "bold", alignSelf: "center" }}>Call</Text>
                        </View>
                    </TouchableWithoutFeedback>

                </ScrollView>
                <View style={styles.bottomContainer}>
                    <TouchableWithoutFeedback style={{ height: "100%", width: "100%" }}
                        onPress={async () => {
                            setLoader(true);
                            var data = {
                                bookId: bookingId,
                                techId: uid,
                                imageUrl: url,
                                userToken: userToken
                            }
                            try {
                                await fetch(
                                    "https://us-central1-servic-68add.cloudfunctions.net/ConfirmAppointment",
                                    {
                                        method: "POST",
                                        headers: {
                                            "Accept": "application/json",
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(data)
                                    }
                                ).then(response => response.json())
                                    .then(responseJson => {
                                        console.log(responseJson);
                                        setShow(true);
                                        if (responseJson === "Technician Already Selected!!") {
                                            setLoader(false);
                                            setAlert(true);
                                        }
                                        else {
                                            setLoader(false);
                                            setAlert(false);
                                        }
                                    });
                            }
                            catch (errors) {
                                alert(errors);
                            }
                        }}>
                        <View style={styles.buttonContainer1}>
                            <Text style={styles.buttonAccept}>ACCEPT</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { setReject(true); }}>
                        <View style={styles.buttonContainer2}>
                            <Text style={styles.buttonReject}>REJECT</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {
                    Alert ?
                        <ErrorModal onPress={() => { setShow(false) }} toggle={show}>
                            <View style={{ height: 300, marginTop: 20, width: "100%", }}>
                                <LottieView source={require('../assets/fix.json')} autoPlay loop />
                            </View>
                            <Text style={{ fontSize: 25, marginTop: 30, fontWeight: "bold", textAlign: "center" }}>Oops!!</Text>
                            <Text style={{ width: "90%", alignSelf: "center", margin: 12, fontSize: 17, fontWeight: "bold", textAlign: "center", color: "rgba(0,0,0,0.4)", }}>
                                Technician is Already Selected</Text>
                        </ErrorModal>
                        :
                        <ErrorModal onPress={() => { setShow(false) }} toggle={show}>
                            <View style={{ height: 300, marginTop: 20, width: "100%", }}>
                                <LottieView source={require('../assets/prog.json')} autoPlay loop />
                            </View>
                            <Text style={{ fontSize: 25, marginTop: 30, fontWeight: "bold", textAlign: "center" }}>Congrats!!</Text>
                            <Text style={{ width: "90%", alignSelf: "center", margin: 12, fontSize: 17, fontWeight: "bold", textAlign: "center", color: "rgba(0,0,0,0.4)", }}>
                                Appointment Confirmed</Text>
                        </ErrorModal>
                }
                <ErrorModal onPress={() => { setReject(false) }} toggle={reject}>
                    <View style={{
                        height: 300,
                        marginTop: 20,
                        width: "100%",
                    }}>
                        <LottieView source={require('../assets/testing.json')} autoPlay loop />
                    </View>
                    <Text style={{
                        fontSize: 25,
                        marginTop: 30,
                        fontWeight: "bold",
                        textAlign: "center",
                    }}>Uh oh!!</Text>
                    <Text style={{
                        width: "90%",
                        alignSelf: "center",
                        margin: 12,
                        fontSize: 17,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "rgba(0,0,0,0.4)",
                    }}>
                        Appointment Rejected
          </Text>
                </ErrorModal>
                <AnimatedLoader
                    visible={loader}
                    source={require("../assets/loader.json")}
                    overlayColor="rgba(255,255,255,0.75)"
                    animationStyle={{ width: 100, height: 100 }}
                    speed={1} />
            </View>
        )
}
DetailScreen.navigationOptions = ({ navigation }) => {
    return {
        headerTitleStyle: {

            color: "#F1F1F1"
        },
        headerTitleAlign: "center",
        headerStyle: {
            elevation: 0,
            backgroundColor: "#F1F1F1"
        },
        headerLeft: () => <Icon name="arrow-left" style={{ paddingLeft: 15, marginTop: 10, color: "black" }}
            onPress={() => { navigation.navigate({ routeName: 'Home' }) }} size={25} />
    }
};

const styles = StyleSheet.create({
    bottomContainer: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0, flexDirection: "row"
    },
    buttonContainer1: {
        flex: 1,
        height: "100%",
        backgroundColor: "#600EE6",
        alignItems: "center",
        justifyContent: "center",

    },
    buttonContainer2: {
        flex: 1,
        height: "100%",
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#600EE6"
    },
    buttonAccept: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
        textAlign: "left"
    },
    buttonReject: {
        color: "#600EE6",
        fontWeight: "bold",
        fontSize: 15,
        textAlign: "left"
    }
})
export default DetailScreen;