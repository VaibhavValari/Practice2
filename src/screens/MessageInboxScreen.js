import React, { useEffect, useState } from "react";
import { Image, View, Text, StyleSheet, Platform, Button } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ocr from "react-native-tesseract-ocr";
import ImagePicker from "react-native-image-picker";

const MessageInboxScreen = (props) => {
  const options = {
    title: "Select Image",
    storageOptions: {
      skipBackup: true,
      path: "images",
    },
  };

  const tessOptions = {
    whitelist: null,
    blacklist: null,
  };

  const [image, setImage] = useState(null);
  const [text, setText] = useState();
  const pickImage = () => {
    return new Promise((resolve, reject) => {
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) return;
        if (response.error) {
          const message = `An error was occurred: ${response.error}`;
          reject(new Error(message));
          return;
        }
        const dataa = response.data;
        setImage(dataa);
        extractText(response.data);
      });
    });
  };

  const extractText = (img) => {
    Ocr.recognize(img, "LANG_ENGLISH", tessOptions).then((res) => {
      setText(res);
    });
  };

  return (
    <View>
      <View
        style={{
          flex: 1,
          paddingTop: 20,
          paddingLeft: 15,
          position: "absolute",
        }}
      >
        <Icon
          name="arrow-left"
          style={{ color: "black" }}
          onPress={() => {
            props.navigation.navigate({ routeName: "Home" });
          }}
          size={25}
        />
      </View>
      <View
        style={{
          paddingHorizontal: 0,
          marginTop: 50,
          justifyContent: "center",
          alignItems: "flex-start",
          marginLeft: 20,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            color: "black",
            fontFamily: "bbol",
            marginBottom: 0,
          }}
        >
          Inbox
        </Text>
      </View>
      <Image source={image} />
      <View>{text}</View>
    </View>
  );
};

MessageInboxScreen.navigationOptions = ({ navigation }) => {
  return {
    headerMode: "none",
    headerTitleStyle: {
      color: "#F1F1F1",
    },
    headerTitleAlign: "center",
    headerStyle: {
      elevation: 0,
      backgroundColor: "#F1F1F1",
    },
  };
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
    elevation: 10,
  },
  text: {
    fontSize: 20,
  },
});
export default MessageInboxScreen;
