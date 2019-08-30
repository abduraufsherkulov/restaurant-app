import React from "react";
import { SafeAreaView } from "react-navigation";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment";
import {
  AsyncStorage,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Platform,
  RefreshControl,
  FlatList,
  Image
} from "react-native";
import axios from "axios";
import { Text } from "react-native-elements";
import HomeLists from "./newOrders/HomeLists";
import * as Font from 'expo-font';
import { NavigationLogo } from "../../assets/images/MainSvg";
const isAndroid = Platform.OS === "android";

class NewOrdersTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <NavigationLogo />
      </View>
    );
  }
}

class NewOrders extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      openUp: "",
      id: "",
      refreshing: false,
      fontLoaded: false,
      ready: 0,
      overallCount: 0
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../../assets/fonts/GoogleSans-Medium.ttf")
    });
    this.setState({ fontLoaded: true });
  }
  handlePress = () => {
    this.props.navigation.navigate("InfoScreen", {});
  };

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   // Typical usage (don't forget to compare props):
  //   if (
  //     this.props.screenProps.newOrdersList !==
  //     prevProps.screenProps.newOrdersList
  //   ) {
  //     console.log("detected");
  //     console.log(prevProps.screenProps.newOrdersList.length);

  //     // this._createNotificationAsync();

  //     // let test = this.state.newOrdersList.filter(
  //     //   item => prevState.newOrdersList.indexOf(item) == -1
  //     // );
  //     // console.log(test);
  //   } else {
  //     console.log("not detected");
  //   }
  // }
  handleCountUp = () => {
    this.setState({
      overallCount: this.state.overallCount + 1
    });
  };
  _renderItem = ({ item }) => (
    <View style={styles.list}>
      <HomeLists
        handlePress={this.handlePress}
        key={item.id}
        nav={this.props.navigation}
        allProps={item}
        acceptNewOrder={this.props.screenProps.acceptNewOrder}
      />
    </View>
  );
  _keyExtractor = (item, index) => item.id.toString();

  static navigationOptions = ({ navigation }) => ({
    headerTitle: <NewOrdersTitle />,
    headerStyle: {
      backgroundColor: "white",
      paddingTop: 0,
      height: 60
    },
    headerTitleStyle: { color: "rgba(126,123,138,1)" },
    headerLeftContainerStyle: {
      padding: 0
    },
    headerTitleContainerStyle: {
      padding: 0
    },
    headerForceInset: { top: "never", bottom: "never" }
  });

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.screenProps.newOrdersList !==
      prevProps.screenProps.newOrdersList
    ) {
      let ok = this.props.screenProps.newOrdersList.length;
      this.setState({
        ready: ok
      });
    }
  }
  render() {
    return (
      <React.Fragment>
        {this.state.fontLoaded ? (
          <SafeAreaView forceInset={{ horizontal: "always", top: "never" }}>
            <View
              style={{
                width: "100%",
                height: 30,
                backgroundColor: "#fb5607"
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row"
                }}
              >
                <Text>
                  <Ionicons
                    name="ios-information-circle"
                    size={20}
                    color="white"
                  />
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "medium",
                    color: "white"
                  }}
                >
                  {"    "}
                  {this.state.ready} заказов ждут подтверждения
                </Text>
              </View>
            </View>
            <FlatList
              data={this.props.screenProps.newOrdersList}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              initialScrollIndex={0}
              initialNumToRender={3}
              refreshControl={
                <RefreshControl
                  refreshing={this.props.screenProps.refreshState}
                  onRefresh={this.props.screenProps.refreshNewOrders}
                  enabled={true}
                  colors={["#8ac53f"]}
                  progressBackgroundColor="white"
                  size={200}
                  tintColor="yellow"
                  title="loading"
                />
              }
            />
          </SafeAreaView>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../../assets/loader.gif")}
            />
          </View>
        )}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1,
    marginTop: 0,
    borderColor: "#FD6B78",
    backgroundColor: "#fff"
  }
});

export default NewOrders;
