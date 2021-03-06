import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import RNLocation from "react-native-location";

const MapScreen1 = ({ navigation }) => {
  const latLang = navigation.getParam("coords");
  const nameArr = latLang.split(",");
  const Lat = nameArr[0];
  const Lon = nameArr[1];
  const lat = parseFloat(Lat);
  const lon = parseFloat(Lon);
  const [region, setRegion] = useState();
  const [coords, setCoords] = useState({
    latitude: 15.5102014,
    longitude: 73.7822279,
  });

  useEffect(() => {
    _checPermission();
    //console.log(coords);
  }, []);

  const _checPermission = () => {
    RNLocation.checkPermission({
      android: {
        detail: "fine",
      },
    }).then((granted) => {
      if (granted) {
        _getLocation();
      } else {
        _getPermission();
      }
    });
  };

  const _getLocation = () => {
    RNLocation.getLatestLocation({ timeout: 60000 }).then((location) => {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
      setCoords({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    });
  };

  const _getPermission = () => {
    RNLocation.requestPermission({
      android: {
        detail: "fine",
        rationale: {
          title: "we need to access your location",
          message: "we use your location get the route",
          buttonPositive: "Ok",
          buttonNegative: "cancel",
        },
      },
    }).then((granted) => {
      if (granted) {
        _getLocation();
      }
    });
  };
  return (
    <View>
      <MapView
        style={{ height: "100%", width: "100%" }}
        initialRegion={region}
        showsUserLocation={true}
        minZoomLevel={10}
        showsCompass={false}
      >
        <Marker coordinate={{ latitude: lat, longitude: lon }} />
        <MapViewDirections
          origin={coords}
          destination={{ latitude: lat, longitude: lon }}
          apikey={"AIzaSyBhsYbmkBufF5SW-nb2tEsHKSV5A6J1_u8"}
          strokeWidth={5}
          strokeColor="red"
        />
      </MapView>
    </View>
  );
};
MapScreen1.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: "MapView",
  };
};
export default MapScreen1;
