import React, { Component } from "react";
import { StatusBar, Platform, AsyncStorage } from "react-native";
import { Text } from "react-native-elements";
import {
  createBottomTabNavigator,
  createStackNavigator,
  createMaterialTopTabNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import axios from "axios";

import Dashboard from "../screens/Dashboard";
import Login from "../screens/Login";
import AuthLoading from "../screens/AuthLoading";
import MyOrders from "../screens/subscreens/MyOrders";
import NewOrders from "../screens/subscreens/NewOrders";
import InfoScreen from "../screens/InfoScreen";
import MyInfoScreen from "../screens/MyInfoScreen";
import { Font } from "expo";
import MyHistory from "../screens/subscreens/MyHistory";
import DummyInfoScreen from "../screens/DummyInfoScreen";

import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
const isAndroid = Platform.OS === "android";

// static navigationOptions = ({ navigation }) => ({
//   tabBarLabel: "Номер заказа: " + navigation.getParam("all").id,
//   headerStyle: {
//     backgroundColor: "white",
//     paddingTop: 0,
//     height: 60
//   },
//   headerTitleStyle: { color: "rgba(126,123,138,1)" },
//   headerLeftContainerStyle: {
//     padding: 0
//   },
//   headerTitleContainerStyle: {
//     padding: 0
//   },
//   headerForceInset: { top: "never", bottom: "never" }
// });

class InfoScreenTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text>
        {this.state.fontLoaded ? (
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 18,
              color: "white"
            }}
          >
            {"Номер заказа: " + this.props.navigation.getParam("all").id}
          </Text>
        ) : null}
      </Text>
    );
  }
}

const OrderInfo = createStackNavigator({
  MainOrders: {
    screen: NewOrders,
    navigationOptions: {
      title: "Главная",
      header: null
    }
  },
  InfoScreen: {
    screen: InfoScreen
    // navigationOptions: {
    //   headerTitle: <Text>"Главная"</Text>
    // }
  }
});

const MyOrderInfo = createStackNavigator({
  MyMainOrders: {
    screen: MyOrders,
    navigationOptions: {
      title: "1233",
      header: null
    }
  },
  MyInfoScreen: { screen: MyInfoScreen }
});

class NewOrdersTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text>
        {this.state.fontLoaded ? (
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 18,
              color: "white"
            }}
          >
            {"Новые".toUpperCase()}
          </Text>
        ) : null}
      </Text>
    );
  }
}

class MyOrdersTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text>
        {this.state.fontLoaded ? (
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 18,
              color: "white"
            }}
          >
            {"Оплаченные".toUpperCase()}
          </Text>
        ) : null}
      </Text>
    );
  }
}
const HomeTabs = createMaterialTopTabNavigator(
  {
    NewOrders: {
      screen: OrderInfo,
      navigationOptions: {
        tabBarLabel: <NewOrdersTitle />
      }
    },
    MyOrders: {
      screen: MyOrderInfo,
      navigationOptions: {
        tabBarLabel: <MyOrdersTitle />
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: "#8ac53f",
        paddingVertical: 10
      },
      labelStyle: { fontSize: 18 }
    }
  }
);

class MaterialTopTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrdersList: [],
      myOrdersList: [],
      refreshing: false,
      fontLoaded: false
    };
  }

  _onRefreshNewOrders = async () => {
    this.setState({ refreshing: true });

    let token = await AsyncStorage.getItem("access_token");
    const urlOrders = "https://api.delivera.uz/entity/new-orders";
    axios({
      method: "get",
      url: urlOrders,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: {
        "content-type": "application/json",
        token: token
      }
    })
      .then(response => {
        console.log("done");
        this.setState({
          newOrdersList: response.data.orders,
          refreshing: false
        });
      })
      .catch(error => {
        console.log(error, "error");
      });
  };

  _onRefreshMyOrders = async () => {
    this.setState({ refreshing: true });

    let token = await AsyncStorage.getItem("access_token");
    const urlOrders = "https://api.delivera.uz/entity/paid-orders";
    axios({
      method: "get",
      url: urlOrders,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: {
        "content-type": "application/json",
        token: token
      }
    })
      .then(response => {
        this.setState({
          myOrdersList: response.data.orders,
          refreshing: false
        });
      })
      .catch(error => {
        console.log(error, "error");
      });
  };
  async componentDidMount() {
    this.loadToAction();
    this.intervaller = setInterval(() => {
      this.loadToAction();
    }, 20000);
  }
  componentWillUnmount() {
    clearInterval(this.intervaller);
  }
  loadToAction = async () => {
    this.setState({ refreshing: true });
    let token = await AsyncStorage.getItem("access_token");
    const urlOrders = "https://api.delivera.uz/entity/new-orders";
    axios({
      method: "get",
      url: urlOrders,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: {
        "content-type": "application/json",
        token: token
      }
    })
      .then(response => {
        //  console.log(response.data.orders);
        this.setState({
          newOrdersList: response.data.orders
        });
      })
      .catch(error => {
        console.log(error, "error");
      });

    const urlMyOrders = "https://api.delivera.uz/entity/paid-orders";
    axios({
      method: "get",
      url: urlMyOrders,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: {
        "content-type": "application/json",
        token: token
      }
    })
      .then(response => {
        //console.log(response.data);
        this.setState({
          myOrdersList: response.data.orders,
          refreshing: false
        });
        // console.log(response.data.orders);
      })
      .catch(error => {
        console.log(error, "error");
      });
  };
  loadToMyOrders = async () => {
    let token = await AsyncStorage.getItem("access_token");
    const urlMyOrders = "https://api.delivera.uz/entity/paid-orders";
    axios({
      method: "get",
      url: urlMyOrders,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: {
        "content-type": "application/json",
        token: token
      }
    })
      .then(response => {
        this.setState({
          myOrdersList: response.data.orders
        });
        // console.log(response.data.orders);
      })
      .catch(error => {
        console.log(error, "error");
      });
  };

  static router = HomeTabs.router;

  render() {
    return (
      <HomeTabs
        screenProps={{
          refreshState: this.state.refreshing,
          refreshNewOrders: this._onRefreshNewOrders,
          refreshMyOrders: this._onRefreshMyOrders,
          newOrdersList: this.state.newOrdersList,
          myOrdersList: this.state.myOrdersList,
          acceptNewOrder: this.loadToAction,
          getFromRest: this.loadToMyOrders
        }}
        navigation={this.props.navigation}
      />
    );
  }
}

class MaterialTopTabsTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text style={{ flex: 1, textAlign: "center" }}>
        {this.state.fontLoaded ? (
          <Text
            style={{
              flex: 1,
              fontFamily: "regular",
              fontSize: 15,
              color: this.props.focusColor,
              alignSelf: "center"
            }}
          >
            {"Главная".toUpperCase()}
          </Text>
        ) : null}
      </Text>
    );
  }
}

class HistoryTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text style={{ flex: 1, textAlign: "center" }}>
        {this.state.fontLoaded ? (
          <Text
            style={{
              flex: 1,
              fontFamily: "regular",
              fontSize: 15,
              color: this.props.focusColor,
              alignSelf: "center"
            }}
          >
            {"Архив".toUpperCase()}
          </Text>
        ) : null}
      </Text>
    );
  }
}
class DashboardTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text style={{ flex: 1, textAlign: "center" }}>
        {this.state.fontLoaded ? (
          <Text
            style={{
              flex: 1,
              fontFamily: "regular",
              fontSize: 15,
              color: this.props.focusColor,
              alignSelf: "center"
            }}
          >
            {"Настройки".toUpperCase()}
          </Text>
        ) : null}
      </Text>
    );
  }
}

const MyHistoryInfo = createStackNavigator({
  MyMainHistory: {
    screen: MyHistory,
    navigationOptions: {
      title: "1233",
      header: null
    }
  },
  DummyInfoScreen: { screen: DummyInfoScreen }
});

const TabNavigator = createBottomTabNavigator(
  {
    Main: {
      screen: MaterialTopTabs,
      navigationOptions: {
        tabBarLabel: ({ tintColor, focused, horizontal }) => (
          <MaterialTopTabsTitle focusColor={focused ? "#8ac53f" : "grey"} />
        ),
        tabBarIcon: ({ tintColor, focused, horizontal }) => (
          <MaterialCommunityIcons
            name={focused ? "home-map-marker" : "home-outline"}
            size={horizontal ? 20 : 26}
            style={{ color: tintColor }}
          />
        )
      }
    },
    History: {
      screen: MyHistoryInfo,
      navigationOptions: {
        tabBarLabel: ({ tintColor, focused, horizontal }) => (
          <HistoryTitle focusColor={focused ? "#8ac53f" : "grey"} />
        ),
        tabBarIcon: ({ tintColor, focused, horizontal }) => {
          return (
            <FontAwesome
              name={focused ? "folder-open" : "folder-open-o"}
              size={horizontal ? 20 : 26}
              style={{ color: tintColor }}
            />
          );
        }
      }
    },
    Dashboard: {
      screen: Dashboard,
      navigationOptions: {
        tabBarLabel: ({ tintColor, focused, horizontal }) => (
          <DashboardTitle focusColor={focused ? "#8ac53f" : "grey"} />
        ),
        tabBarIcon: ({ tintColor, focused, horizontal }) => {
          return (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              size={horizontal ? 20 : 26}
              style={{ color: tintColor }}
            />
          );
        }
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: "#8ac53f",
      inactiveTintColor: "gray"
    }
  }
);

//const AuthStack = createStackNavigator({ Login: Login });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      App: TabNavigator,
      Auth: Login
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
