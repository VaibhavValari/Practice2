import React,{ useState,useEffect} from "react";
import { StyleSheet } from 'react-native';
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import messaging from '@react-native-firebase/messaging';
import Color from './core/colors';
import {
  SplashScreen,
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  Dashboard,
  Profile,
  SetupProfile,
  UpdateProfile,
  DetailScreen,
  MessageInboxScreen,
  PendingScreen,
  MapScreen,
  MapScreen1,
  Appointments,
  CompletedScreen
} from "./screens";

const AppNav = createStackNavigator({
  Home: { screen: Dashboard },
},
  {
    headerMode: 'float',
    HeaderTitle: "null"
  }
);
const AppointmentsNav = createStackNavigator({
  Appointments: { screen: Appointments },
  
},
  {
    headerMode: 'float',
    HeaderTitle: "null"
  }
);
const appoint = createStackNavigator({
  PendingScreen,
  MapScreen
});
const appoint1 = createStackNavigator({
  CompletedScreen
});

const inbox = createStackNavigator({
  MessageInboxScreen,
},
  {
    headerMode: 'none',
    headerLayoutPreset: "center",
    HeaderTitleStyle: {
      color: "white"
    }

  });
const chat = createStackNavigator({
  DetailScreen,
  MapScreen1
});




const ProfileNav = createStackNavigator({
  Profile: { screen: Profile },
},
  {
    initialRouteName: "Profile",
    activeColor: Color.primary,
    inactiveColor: "grey",
    barStyle: { backgroundColor: "white" },
    shifting: true
  }
);

const BottomTabNav = createMaterialBottomTabNavigator(
  {
    App: {
      screen: AppNav,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({tintColor}) => {
          return <Icon color={tintColor} name="md-home" size={25} />;
        }
      }
    },
    ap: {
      screen: AppointmentsNav,
      navigationOptions: {
        tabBarLabel: 'Appointments',
        tabBarIcon: ({tintColor}) => {
          return <Icon color={tintColor} name="ios-clipboard" size={25} />;
        }
      }
    },

    Profile: {
      screen: ProfileNav,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({tintColor}) => {
          return <Icon color={tintColor} name="md-person" size={25} />;
        },
      }
    }
  },
  {
    activeColor: Color.primary,
    inactiveColor: "grey",
    barStyle: { backgroundColor: "white" },
    shifting: true,
    activeTintColor:Color.primary

  }
);
const Updat = createStackNavigator({
  UpdateProfile
},
  {
    headerMode:"none",
    headerLayoutPreset: "center"
  }
);

const Update = createStackNavigator({
  BottomTabNav,
  inbox,
  Updat,
  appoint,
  chat,
  appoint1
},
  {
    headerMode: 'none'
  }
);

const AuthNav = createStackNavigator(
  {
    HomeScreen,
    LoginScreen,
    RegisterScreen,
    ForgotPasswordScreen,
    Update,
    SetupProfile,
  },
  {
    initialRouteName: "HomeScreen",
    headerMode: "none",
  }
);

const Main = createSwitchNavigator({
  SplashScreen,
  App: BottomTabNav,
  Auth: AuthNav,
});


const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 120
  },
})
export default createAppContainer(Main);