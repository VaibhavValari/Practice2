import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback,Keyboard } from 'react-native';
import Background from '../components/Background';
import Icon from 'react-native-vector-icons/Feather';
import { TextInput, Avatar, Button } from 'react-native-paper';
import { theme } from '../core/theme';
import { add } from 'react-native-reanimated';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {
    emailValidator,
    passwordValidator,
    nameValidator
} from "../core/utils";


const UpdateProfile = ({ navigation }) => {

    const [name, setName] = useState({ name: "", error: "" });
    const [email, setEmail] = useState({ name: "", error: "" });
    const [address, setAddress] = useState({ name: "", error: "" });
    const [contact, setContact] = useState({ name: "", error: "" });
    const [company, setCompany] = useState({ name: "", error: "" });
    const techid = auth().currentUser.uid;

    const update = () => {
        auth().currentUser.updateProfile({ displayName: name.name });
        database().ref(`technician/${techid}/`).child(`name`).set(name.name);
        database().ref(`technician/${techid}/`).child(`contact`).set(contact.name);
        database().ref(`technician/${techid}/`).child(`address`).set(address.name);
        database().ref(`technician/${techid}/`).child(`company`).set(company.name);
    };

    const Validate = () => {
        Keyboard.dismiss();
        const nameError = nameValidator(name.name);
        const contactError = nameValidator(contact.name);
        const addressError = nameValidator(address.name);
        const companyError = nameValidator(company.name);
        if (contactError || companyError || addressError || nameError) {
            setName({ ...name, error: nameError });
            setAddress({ ...address, error: addressError });
            setContact({ ...contact, error: contactError });
            setCompany({ ...company, error: companyError });
            return;
        }
        update();
    }
    return (
        <View style={{ backgroundColor: "#f1f1f1", height: "100%" }}>
            <View style={{ marginLeft: 20, marginTop: 40 }}>
                <Text style={{ fontSize: 30, color: "black", fontWeight: "bold", marginBottom: 5 }}>
                    Update Profile
            </Text>
            </View>
            <Avatar.Icon style={{
                alignSelf: "center", justifyContent: "center",
                elevation: 10, marginVertical: 20
            }}
                size={110} icon="plus" />

            <View style={{ marginHorizontal: 15 }}>
                <TextInput
                    selectionColor={theme.colors.primary}
                    underlineColor="transparent"
                    mode="outlined"
                    style={{ marginVertical: 5, height: 50 }}
                    label='Name'
                    value={name.name}
                    onChangeText={text => setName({ name: text, error: "" })}
                    returnKeyType="next"
                    error={!!name.error}
                    errorText={name.error}
                />
                <TextInput
                    selectionColor={theme.colors.primary}
                    underlineColor="transparent"
                    mode="outlined"
                    style={{ marginVertical: 5, height: 50 }}
                    label='Email'
                    value={email.name}
                    onChangeText={text => setEmail({ name: text, error: "" })}
                    returnKeyType="next"
                    error={!!email.error}
                    errorText={email.error}
                />
                <TextInput
                    selectionColor={theme.colors.primary}
                    underlineColor="transparent"
                    mode="outlined"
                    style={{ marginVertical: 5, height: 50 }}
                    label='Address'
                    value={address.name}
                    onChangeText={text => setAddress({ name: text, error: "" })}
                    returnKeyType="next"
                    error={!!address.error}
                    errorText={address.error}
                />
                <TextInput
                    selectionColor={theme.colors.primary}
                    underlineColor="transparent"
                    mode="outlined"
                    style={{ marginVertical: 5, marginBottom: 20, height: 50 }}
                    label='Contact'
                    value={contact.name}
                    onChangeText={text => setContact({ name: text, error: "" })}
                    returnKeyType="next"
                    error={!!contact.error}
                    errorText={contact.error}
                />
                <TextInput
                    selectionColor={theme.colors.primary}
                    underlineColor="transparent"
                    mode="outlined"
                    style={{ marginVertical: 5, marginBottom: 20, height: 50 }}
                    label='Company'
                    value={company.name}
                    onChangeText={text => setCompany({ name: text, error: "" })}
                    returnKeyType="next"
                    error={!!company.error}
                    errorText={company.error}
                />
                <Button mode="contained" onPress={Validate}>
                    Save
                </Button>

            </View>
            <View style={{
                position: "absolute",
                height: 50, width: 50, alignContent: "center",
                alignItems: "center", justifyContent: "center",

            }}>
                <Icon name="arrow-left" style={{ color: "black" }}
                    onPress={() => { navigation.navigate({ routeName: 'Profile' }) }} size={25} />

            </View>
        </View>
    );
};

export default UpdateProfile;