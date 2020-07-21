import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import database from "@react-native-firebase/database";

const CustomerName = (props) => {
  const uid = props.uid;
  const [name, setName] = useState("");
  useEffect(() => {
    getName();
  }, []);

  const getName = async () => {
    await database()
      .ref(`users/${uid}/name`)
      .once("value")
      .then((snapshot) => {
        setName(snapshot.val());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={{ ...props.style }}>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  name: {
    fontFamily: "bbol",
    color: "black",
    textAlign: "left",
    fontSize: 17,
    width: 170,
  },
});

export default CustomerName;
