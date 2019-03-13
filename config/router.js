import React, { Component, PureComponent } from "react";
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

const OrderInfo = createStackNavigator({
  MainOrders: {
    screen: NewOrders
  },
  InfoScreen: {
    screen: InfoScreen,
    navigationOptions: {
      tabBarVisibility: false
    }
  }
});

const MyOrderInfo = createStackNavigator({
  MyMainOrders: {
    screen: MyOrders
  },
  MyInfoScreen: { screen: MyInfoScreen }
});

const MainDashboard = createStackNavigator({
  MyMainDashboard: {
    screen: Dashboard
  }
});

OrderInfo.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (routeName === "InfoScreen") {
    navigationOptions.tabBarVisible = false;
    navigationOptions.swipeEnabled = false;
  }

  return navigationOptions;
};

MyOrderInfo.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (routeName === "MyInfoScreen") {
    navigationOptions.tabBarVisible = false;
    navigationOptions.swipeEnabled = false;
  }

  return navigationOptions;
};

class NewOrdersTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../assets/fonts/GoogleSans-Regular.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text style={{ flex: 1, textAlign: "center", paddingTop: 4 }}>
        {this.state.fontLoaded ? (
          <Text
            style={{
              flex: 1,
              fontFamily: "regular",
              fontSize: 12,
              color: this.props.focusColor,
              alignSelf: "center"
            }}
          >
            {"Главная"}
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
      regular: require("../assets/fonts/GoogleSans-Regular.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text style={{ flex: 1, textAlign: "center", paddingTop: 4 }}>
        {this.state.fontLoaded ? (
          <Text
            style={{
              flex: 1,
              fontFamily: "regular",
              fontSize: 12,
              color: this.props.focusColor,
              alignSelf: "center"
            }}
          >
            {"Мои заказы"}
          </Text>
        ) : null}
      </Text>
    );
  }
}

class MyDashboardTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../assets/fonts/GoogleSans-Regular.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    return (
      <Text style={{ flex: 1, textAlign: "center", paddingTop: 4 }}>
        {this.state.fontLoaded ? (
          <Text
            style={{
              flex: 1,
              fontFamily: "regular",
              fontSize: 12,
              color: this.props.focusColor,
              alignSelf: "center"
            }}
          >
            {"Профиль"}
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
        tabBarLabel: ({ tintColor, focused, horizontal }) => (
          <NewOrdersTitle focusColor={focused ? "#5caa57" : "#000000"} />
        ),
        tabBarIcon: ({ tintColor, focused, horizontal }) => {
          return (
            <FontAwesome
              name={focused ? "circle" : "circle-thin"}
              size={horizontal ? 20 : 26}
              style={{ color: tintColor }}
            />
          );
        }
      }
    },
    MyOrders: {
      screen: MyOrderInfo,
      navigationOptions: {
        tabBarLabel: ({ tintColor, focused, horizontal }) => (
          <MyOrdersTitle focusColor={focused ? "#5caa57" : "#000000"} />
        ),
        tabBarIcon: ({ tintColor, focused, horizontal }) => {
          return (
            <FontAwesome
              name={focused ? "circle" : "circle-thin"}
              size={horizontal ? 20 : 26}
              style={{ color: tintColor }}
            />
          );
        }
      }
    },
    MyDashboard: {
      screen: MainDashboard,
      navigationOptions: {
        tabBarLabel: ({ tintColor, focused, horizontal }) => (
          <MyDashboardTitle focusColor={focused ? "#5caa57" : "#000000"} />
        ),
        tabBarIcon: ({ tintColor, focused, horizontal }) => {
          return (
            <FontAwesome
              name={focused ? "circle" : "circle-thin"}
              size={horizontal ? 20 : 26}
              style={{ color: tintColor }}
            />
          );
        }
      }
    }
  },
  {
    tabBarPosition: "bottom",
    tabBarOptions: {
      renderIndicator: () => null,
      activeTintColor: "#5caa57",
      inactiveTintColor: "gray",
      style: {
        backgroundColor: "#ffffff"
      },
      showIcon: true
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
        console.log(error.response.data, "error");
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
      regular: require("../assets/fonts/GoogleSans-Regular.ttf")
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
      regular: require("../assets/fonts/GoogleSans-Regular.ttf")
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
      regular: require("../assets/fonts/GoogleSans-Regular.ttf")
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
      App: MaterialTopTabs,
      Auth: Login
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
