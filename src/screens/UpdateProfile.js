import React, { useState } from 'react';
import { View, Text, TouchableOpacity,Keyboard,StyleSheet,Image } from 'react-native';
import Background from '../components/Background';
import Icon from 'react-native-vector-icons/Feather';
import storage from '@react-native-firebase/storage';
import { TextInput, Avatar } from 'react-native-paper';
import { theme } from '../core/theme';
import { add } from 'react-native-reanimated';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Button from '../components/Button';
import {
    emailValidator,
    passwordValidator,
    nameValidator
} from "../core/utils";
import colors from '../core/colors';
import { TouchableNativeFeedback, TouchableHighlight } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';



const UpdateProfile = ({ navigation }) => {


    const options = {
        title: 'Select Image',
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      };
    
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
    const renderFileData = () => {
        if (image) {
          return (
            <Image source={{ uri: 'data:image/jpeg;base64,' + image }}
              style={{
                resizeMode:"contain",
                width: "100%", height: 132,
                justifyContent: "center",
                borderRadius: 100,
                borderWidth: 3
              }} />
          )
        }
        else {
          return (
            <Avatar.Icon onPress={()=>{console.log("hii")}} style={{
                alignSelf: "center", justifyContent: "center",
                elevation: 10, marginVertical: 20,backgroundColor:colors.primary
            }}
                size={110} icon="plus" />
          )
        }
      };

      const [image, setImage] = useState(null);
      const pickImage = () => {
          return new Promise((resolve, reject) => {
            ImagePicker.showImagePicker(options, response => {
              if (response.didCancel) return;
              if (response.error) {
                const message = `An error was occurred: ${response.error}`;
                reject(new Error(message));
                return;
              }
              const { path: uri } = response;
              resolve(uri);
              const dataa = response.data;
              setImage(dataa);
            });
          });
        };
    
        const uploadImage = async (fileName, uri) => {
            const user = auth().currentUser.uid;
            return new Promise(
              (resolve, reject) => {
                storage()
                  .ref(`Technicians/${user}/${fileName}`)
                  .putFile(uri)
                  .then(resolve)
                  .catch(reject);
              }
            );
          }

      const pickImageAndUpload = async () => {
        const uri = await pickImage();
        const fileName = 'Profile_Picture.jpg';
        await uploadImage(fileName, uri);
      }

    return (
        <View style={{ backgroundColor: "#f1f1f1", height: "100%" }}>
            <View style={{ marginLeft: 20, marginTop: 40 }}>
                <Text style={{ fontSize: 30, color: "black", fontFamily:"bbol", marginBottom: 5 }}>
                    Update Profile
            </Text>
            </View>
            <TouchableOpacity onPress={pickImageAndUpload}>
            <View style={styles.image}>
                {renderFileData()}
            </View>
            </TouchableOpacity>
                
            <View style={{ marginHorizontal: 15 }}>
                <TextInput
                    selectionColor={colors.primary}
                    theme={{colors:{primary:colors.primary}}}
                    underlineColor="transparent"
                    mode="outlined"
                    style={{ marginVertical: 5, height: 50,color:colors.primary }}
                    label='Name'
                    value={name.name}
                    onChangeText={text => setName({ name: text, error: "" })}
                    returnKeyType="next"
                    error={!!name.error}
                    errorText={name.error}
                />
                <TextInput
                theme={{colors:{primary:colors.primary}}}
                    selectionColor={colors.primary}
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
                    selectionColor={colors.primary}
                    theme={{colors:{primary:colors.primary}}}
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
                    selectionColor={colors.primary}
                    underlineColor="transparent"
                    theme={{colors:{primary:colors.primary}}}
                    mode="outlined"
                    style={{ marginVertical: 5, height: 50 }}
                    label='Contact'
                    value={contact.name}
                    onChangeText={text => setContact({ name: text, error: "" })}
                    returnKeyType="next"
                    error={!!contact.error}
                    errorText={contact.error}
                />
                <TextInput
                    selectionColor={colors.primary}
                    underlineColor="transparent"
                    mode="outlined"
                    theme={{colors:{primary:colors.primary}}}
                    style={{ marginVertical: 5, marginBottom: 20, height: 50 }}
                    label='Company'
                    value={company.name}
                    onChangeText={text => setCompany({ name: text, error: "" })}
                    returnKeyType="next"
                    error={!!company.error}
                    errorText={company.error}
                />
                <Button style={{width:250, backgroundColor:"white",borderColor:colors.primary,borderWidth:1.5,elevation:1,alignSelf:"center"}} mode="outlined" onPress={Validate}>
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
const styles = StyleSheet.create({
    image: {
        width: 130,
        height: 130,
        borderRadius: 100,
        marginLeft: 5,
        borderColor: "white",
        justifyContent: "center",
        alignContent: "center",
        alignSelf: "center",
        alignItems: "center",
        overflow:"hidden"
      }
})

export default UpdateProfile;