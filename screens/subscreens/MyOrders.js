import React from "react";
import { SafeAreaView } from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
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
import { Text } from "react-native-elements";
import axios from "axios";
import MyOrdersList from "./myOrders/MyOrdersList";
import { Font } from "expo";
import { NavigationLogo } from "../../assets/images/MainSvg";
const isAndroid = Platform.OS === "android";

class MyOrdersTitle extends React.Component {
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

class MyOrders extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      myorders: [],
      openUp: "",
      id: "",
      refreshing: false,
      fontLoaded: false,
      ready: "",
      leftBehind: 0
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../../assets/fonts/GoogleSans-Medium.ttf")
    });
    this.setState({ fontLoaded: true });
  }
  countUp = () => {
    this.setState({
      leftBehind: this.state.leftBehind + 1
    });
  };
  handlePress = () => {
    this.props.navigation.navigate("MyInfoScreen", {});
  };

  _renderItem = ({ item }) => (
    <View style={styles.list}>
      <MyOrdersList
        handlePress={this.handlePress}
        key={item.id}
        nav={this.props.navigation}
        allProps={item}
        acceptNewOrder={this.props.screenProps.acceptNewOrder}
        updateUp={this.countUp}
      />
    </View>
  );
  _keyExtractor = (item, index) => item.id.toString();

  static navigationOptions = ({ navigation }) => ({
    headerTitle: <MyOrdersTitle />,
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
  render() {
    // let homeMainRender =
    //   this.props.screenProps.myOrdersList.length > 0 ? (
    //     this.props.screenProps.myOrdersList.map((l, i) => (
    //       <MyOrdersList
    //         getFromRest={this.props.screenProps.getFromRest}
    //         handlePress={this.handlePress}
    //         key={l.id}
    //         nav={this.props.navigation}
    //         allProps={l}
    //       />
    //     ))
    //   ) : (
    //     <View
    //       style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    //     >
    //       <Text style={{ flex: 1 }}>На данный момент нет заказов.</Text>
    //     </View>
    //   );
    return (
      <React.Fragment>
        {this.state.fontLoaded ? (
          <SafeAreaView
            forceInset={{ horizontal: "always", top: "never", bottom: "never" }}
          >
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
                  {this.state.leftBehind} заказов отстаёт от графика
                </Text>
              </View>
            </View>
            <FlatList
              data={this.props.screenProps.myOrdersList}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              initialScrollIndex={0}
              initialNumToRender={3}
              refreshControl={
                <RefreshControl
                  refreshing={this.props.screenProps.refreshState}
                  onRefresh={this.props.screenProps.refreshMyOrders}
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

export default MyOrders;
