import React, { useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import database from "@react-native-firebase/database";
import auth from '@react-native-firebase/auth';
import ErrorModal from '../components/ErrorModal';
import LottieView from 'lottie-react-native';
import AnimatedLoader from 'react-native-animated-loader';
import Button from '../components/Button';
import colors from '../core/colors';
import call from 'react-native-phone-call';

const PendingScreen = ({ navigation }) => {
    const data = navigation.getParam('data');
    const bookingId = navigation.getParam('bookingId');
    const prob = data.problems;
    let problem = prob.split(',');
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
    const uid = auth().currentUser.uid;
    const [phone, setPhone] = useState('');
    const [name, setName] = useState("");

    useEffect(() => {
        retreive();
        getUserData();
    }, [])

    const retreive = async () => {
        await database().ref(`products/${prodId}/`).once('value').then(snapshot => {
            setImage(snapshot.val().prod_image);
            setPname(snapshot.val().prod_name);
            setLoader(false);
        })
    };

    const getUserData = async () => {
        await database().ref(`users/${data.uid}/`).once('value')
            .then(snapshot => {
                setName(snapshot.val().name);
                setPhone(snapshot.val().phone);
            });
    };


    const problems = () => {
        return problem.map(element => {
            return (
                <View key={element} style={{ flex: 1, backgroundColor: "white", borderRadius: 20, borderColor: "silver", alignContent: "center", justifyContent: "flex-start", alignItems: "center", borderWidth: 0.5, padding: 8, margin: 3, flexDirection: "row" }}>
                    <Icon style={{ marginRight: 5, alignSelf: "center", color: "red", alignContent: "center", alignItems: "center" }}
                        name="alert-circle" size={15} />
                    <Text style={{fontFamily:"breg", marginHorizontal: 5 }}>{element}</Text>
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
                        <Text numberOfLines={1} style={{ fontSize: 24,color: "black", fontFamily:"bbol", marginBottom: 5 }}>id {bookingId}</Text>
                        <View style={{ flexDirection: "row", marginVertical: 2, paddingTop: 10 }}>
                            <Icon style={{ alignSelf: "flex-start", color: "red", alignContent: "flex-end", alignItems: "flex-end", paddingBottom: 3 }}
                                name="calendar" size={20} />
                            <Text style={{ fontFamily:"breg",alignSelf: "center", textShadowRadius: 1, paddingLeft: 2, fontSize: 16 }}>{data.date}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginVertical: 2 }}>
                            <Icon style={{ alignSelf: "flex-start", color: "red", alignContent: "flex-end", alignItems: "flex-end", paddingBottom: 3 }}
                                name="clock" size={20} />
                            <Text style={{fontFamily:"breg", alignSelf: "center", textShadowRadius: 1, paddingLeft: 2, fontSize: 16 }}>{data.time}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginVertical: 2 }}>
                            <Icon style={{ alignSelf: "flex-start", color: "red", paddingBottom: 3 }}
                                name="map-pin" size={20} />
                            <Text numberOfLines={1} style={{ fontFamily:"breg",alignSelf: "center", marginHorizontal: 2, textShadowRadius: 1, fontSize: 16 }}>{data.address}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginVertical: 10, marginLeft: 5 }}>
                            <View style={{
                                backgroundColor: "silver", elevation: 1, borderRadius: 20,
                                paddingHorizontal: 5, marginVertical: 2, marginHorizontal: 5
                            }}>
                                <Text style={{ fontFamily:"breg",color: "white", paddingBottom: 2, paddingHorizontal: 2 }}>Home</Text>
                            </View>
                            <View style={{
                                backgroundColor: "silver", elevation: 1, marginHorizontal: 5, borderRadius: 20,
                                paddingHorizontal: 5, marginVertical: 2, marginHorizontal: 5
                            }}>
                                <Text style={{ fontFamily:"breg",color: "white", paddingBottom: 2, paddingHorizontal: 2 }}>Work</Text>
                            </View>
                            <View style={{
                                backgroundColor: "silver", elevation: 1, borderRadius: 20,
                                paddingHorizontal: 5, marginVertical: 2, marginHorizontal: 5
                            }}>
                                <Text style={{ fontFamily:"breg",color: "white", paddingBottom: 2, paddingHorizontal: 2 }}>others</Text>
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
                                fontFamily:"bbol", alignSelf: "stretch"
                            }}>{name}</Text>
                            <Text style={{ marginLeft: "3%", fontSize: 14 }}>{phone}</Text>
                        </View>
                    </View>
                    <View style={{
                        borderBottomColor: 'silver',
                        borderBottomWidth: 0.5, marginHorizontal: 15
                    }} />
                    <View style={{ marginHorizontal: "5%", marginTop: 15 }}>
                        <Text style={{
                            fontSize: 18, color: "black",
                            fontFamily:"bbol", alignSelf: "stretch"
                        }}>
                            Complaint Details</Text>
                        <View style={{ marginVertical: 10 }}>{problems()}</View>
                    </View>
                    <View style={{ marginTop: 10, marginHorizontal: "5%" }}>
                        <Text style={{
                            fontSize: 18, color: "black",
                            fontFamily:"bbol", alignSelf: "stretch"
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
                    <View style={{ flex: 1, marginHorizontal: 20, marginTop: 20, flexDirection: "row" }}>
                        <View style={{ flexDirection: "column", width: "50%" }}>
                            <View style={{ alignItems: "flex-start",  backgroundColor: "white", padding: 5 }}>
                                <Text style={{fontFamily:"breg",}}>product name</Text>
                            </View>
                            <View style={{ alignItems: "flex-start",backgroundColor: "white", padding: 5 }}>
                                <Text style={{fontFamily:"breg",}}>company name</Text>
                            </View>
                            <View style={{ alignItems: "flex-start",  backgroundColor: "white", padding: 5 }}>
                                <Text style={{fontFamily:"breg",}}>model</Text>
                            </View>
                            <View style={{ alignItems: "flex-start", backgroundColor: "white",padding: 5 }}>
                                <Text style={{fontFamily:"breg",}}>date of purchase</Text>
                            </View>
                            <View style={{ alignItems: "flex-start", backgroundColor: "white", padding: 5 }}>
                                <Text style={{fontFamily:"breg",}}>warranty</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: "column", width: "50%" }}>
                            <View style={{ alignItems: "flex-start",  backgroundColor: "white", padding: 5 }}>
                                <Text style={{fontFamily:"breg",}} numberOfLines={1}>{pname}</Text>
                            </View>
                            <View style={{ alignItems: "flex-start",backgroundColor: "white", padding: 5 }}>
                                <Text style={{fontFamily:"breg",}}>---</Text>
                            </View>
                            <View style={{ alignItems: "flex-start",  backgroundColor: "white", padding: 5 }}>
                                <Text style={{fontFamily:"breg",}}>---</Text>
                            </View>
                            <View style={{ alignItems: "flex-start",backgroundColor: "white", padding: 5 }}>
                                <Text style={{fontFamily:"breg",}}>---</Text>
                            </View>
                            <View style={{ alignItems: "flex-start",  backgroundColor: "white", padding: 5 }}>
                                <Text style={{fontFamily:"breg",}}>---</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        marginTop: 20, marginHorizontal: 20, elevation: 1,
                        justifyContent: "center", alignItems: "center", backgroundColor: "white"
                    }}>
                        <Image style={{ width: "100%", height: 200, borderRadius: 2 }} source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=600x800&maptype=roadmap&markers=color:red%7Clabel:S%7C${latitude},${longitude}&key=AIzaSyBhsYbmkBufF5SW-nb2tEsHKSV5A6J1_u8` }} />
                    </View>
                    <Button style={{ alignSelf: "center",alignItems:"center" ,alignContent:"center",justifyContent:"center",height:40, width: "70%", backgroundColor: "white", borderColor: colors.primary, borderWidth: 1.5, elevation: 1 }} mode="outlined"
                        onPress={() => {
                            navigation.navigate({
                                routeName: "MapScreen",
                                params: { latitude: latitude, longitude: longitude }
                            })
                        }}>
                        open maps
                        </Button>
                    <Button style={{ alignSelf: "center",alignItems:"center" ,alignContent:"center",justifyContent:"center", marginBottom: 90,height:40, width: "70%", backgroundColor: "white", borderColor: colors.primary, borderWidth: 1.5, elevation: 1 }} mode="outlined" onPress={() => {
                        const args = {
                            number: phone,
                            prompt: false
                        }
                        call(args).catch(console.error)
                    }}>
                        CALL
                        </Button>
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
                            <Text style={styles.buttonCon}>complete</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    :
                    <View style={styles.bottomContainer1}>
                        <Text style={styles.buttonCon}>completed</Text>
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
                    <Button
                        onPress={() => { setShow(false) }}
                        mode="outlined"
                        style={{
                            backgroundColor:"white",
                            color:"white",
                            borderWidth:2,
                            borderColor:colors.primary,
                            width: "60%",
                            alignSelf: "center",
                            margin: 6,
                        }}>
                        okay
                    </Button>
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
        backgroundColor: colors.primary
    },
    bottomContainer1: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        backgroundColor: colors.primary
    },
    buttonCon:{
        color: "white",
        fontFamily:"bbol",
        fontSize: 18,
        textTransform: "uppercase",
        textAlign: "left"
    }
})
export default PendingScreen;
