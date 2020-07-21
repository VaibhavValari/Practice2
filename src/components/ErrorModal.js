import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import PropTypes from "prop-types";
import { Portal } from "react-native-paper";

import { theme } from "../core/theme";

const ErrorModal = (props) => {
  const { toggle } = props;
  const [isVisible, setIsVisible] = useState(false);
  const slide = useRef(new Animated.Value(-400)).current;
  const fade = useRef(new Animated.Value(0)).current;

  const slideUpAnimation = () => {
    setIsVisible(true);
    Animated.sequence([
      Animated.timing(fade, {
        toValue: 1,
        duration: 10,
        delay: 0,
        useNativeDriver: true,
      }),
      Animated.spring(slide, {
        toValue: 0,
        duration: 100,
      }),
    ]).start();
  };

  const slideDownAnimation = () => {
    Animated.timing(fade, {
      toValue: 0,
      duration: 100,
      delay: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
    });
  };

  useEffect(() => {
    toggle ? slideUpAnimation() : slideDownAnimation();
  }, [toggle]);

  if (!isVisible) {
    return null;
  }

  return (
    <Portal>
      <Animated.View style={{ ...styles.background, opacity: fade }}>
        <TouchableWithoutFeedback onPress={props.onPress}>
          <View
            style={{
              flex: 1,
            }}
          />
        </TouchableWithoutFeedback>
        <Animated.View style={{ ...styles.cardContainer, bottom: slide }}>
          {props.children}
        </Animated.View>
      </Animated.View>
    </Portal>
  );
};

ErrorModal.propTypes = {
  hide: PropTypes.bool,
};

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  cardContainer: {
    width: "100%",
    // height: "50%",
    position: "absolute",
    // bottom: 0,
    alignSelf: "center",
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
    padding: 12,
  },
  imageContainer: {
    height: 300,
    marginTop: 20,
    width: "100%",
    // margin: 20,
    // borderWidth: 1,
    // alignSelf: "center",
  },
  headerText: {
    fontSize: 25,
    marginTop: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subText: {
    width: "90%",
    alignSelf: "center",
    margin: 12,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    color: "rgba(0,0,0,0.4)",
  },
});

export default ErrorModal;
