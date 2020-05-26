import React, { memo } from "react";
import { Image, StyleSheet, Text } from "react-native";

const Logo = () => (
  //<Image source={require("../assets/logo.png")} style={styles.image} />
  <Text style = {styles.header}>Servic</Text>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default memo(Logo);