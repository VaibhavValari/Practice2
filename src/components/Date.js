import React from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import colors from "../core/colors";

const Date = (props) => {
  const date = props.date;
  const day = date.substr(8, 2);
  const mon = date.substr(5, 2);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthNumToName = (monNum) => {
    return months[monNum - 1];
  };
  const month = monthNumToName(mon);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 24 }}>
        {day}
      </Text>
      <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 12 }}>
        {month}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: 35,
    borderRadius: 10,
    paddingBottom: 2,
    alignItems: "center",
    flexDirection: "column",
  },
});

export default Date;
