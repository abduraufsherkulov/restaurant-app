import React, { Component } from "react";
import { Text, Button, CheckBox } from "react-native-elements";

import {
  Platform,
  StyleSheet,
  Image,
  View,
  Linking,
  Dimensions,
  ScrollView
} from "react-native";

import { Font } from "expo";

import MainModal from "./subscreens/newOrders/MainModal";

import axios from "axios";

const SCREEN_WIDTH = Dimensions.get("window").width;

class MyInfoScreenTitle extends Component {
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

class MyInfoScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: { coords: { latitude: 0, longitude: 0 } },
      errorMessage: null,
      fontLoaded: false,
      opened: false,
      asyncing: false,
      duration: {
        text: "",
        value: +""
      },
      checked: false,
      items: []
    };
  }

  _isMounted = false;

  _pressCall = () => {
    let allVal = this.props.navigation.getParam("all");
    const url = `tel://${allVal.user.phone}`;
    Linking.openURL(url);
  };

  handleModal = () => {
    this.setState({
      opened: true
    });
  };
  handleClose = () => {
    this.setState({
      opened: false
    });
  };

  async componentDidMount() {
    let allVal = await this.props.navigation.getParam("all");
    //console.log(allVal.items);
    this._isMounted = true;
    let items = allVal.items;

    this.setState({
      items
    });

    await Font.loadAsync({
      georgia: require("../assets/fonts/Georgia.ttf"),
      regular: require("../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../assets/fonts/Montserrat-Bold.ttf")
    });

    this.setState({ fontLoaded: true });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: "Номер заказа: " + navigation.getParam("all").id,
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

  checkItems(id, i) {
    const changedCheckbox = this.state.items.find(j => j.food_id === id);
    changedCheckbox.checked = !changedCheckbox.checked;
    const checkboxes = Object.assign({}, this.state.items, changedCheckbox);
    this.setState({
      checkboxes
    });
  }

  render() {
    let allVal = this.props.navigation.getParam("all");
    let nav = this.props.navigation.getParam("nav");
    let getFromRest = this.props.navigation.getParam("getFromRest");
    // console.log(this.state.items);
    let listProducts = this.state.fontLoaded
      ? allVal.items.map((l, i) => (
          <View key={l.food_id}>
            <CheckBox
              title={
                <Text
                  style={{
                    color: "red",
                    flex: 1,
                    fontFamily: "regular",
                    fontSize: 20
                  }}
                >
                  {l.food_title}
                </Text>
              }
              containerStyle={{
                flex: 1,
                justifyContent: "space-between",
                padding: 20
              }}
              iconRight
              right
              iconType="ionicon"
              checkedIcon="ios-checkbox-outline"
              uncheckedIcon="ios-square-outline"
              checkedColor="#8ac53f"
              onPress={() => this.checkItems(l.food_id, i)}
              checked={this.state.items[i].checked}
            />
          </View>
        ))
      : null;

    let modalPart = this.state.opened ? (
      <MainModal
        nav={nav}
        openUp={this.state.opened}
        closed={this.handleClose}
        order_id={allVal.id}
        getFromRest={getFromRest}
        //  getFromRest={this.props.getFromRest}
        all={allVal}
        items={this.state.items}
      />
    ) : null;
    return (
      <ScrollView>
        <View style={{ flex: 1 }}>
          {this.state.fontLoaded ? (
            <View style={{ flex: 1, marginTop: 5 }}>
              <View>{listProducts}</View>
              <View
                style={{
                  flex: 0.4,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Button
                  containerStyle={{ marginVertical: 20 }}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  buttonStyle={{
                    height: 45,
                    width: SCREEN_WIDTH - 80,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#8ac53f"
                  }}
                  // linearGradientProps={{
                  //   colors: ["rgba(214,116,112,1)", "rgba(233,174,87,1)"],
                  //   start: [1, 0],
                  //   end: [0.2, 0]
                  // }}
                  title={"Отправить"}
                  titleStyle={{
                    fontFamily: "regular",
                    fontSize: 20,
                    color: "white",
                    textAlign: "center"
                  }}
                  onPress={this.handleModal}
                  activeOpacity={0.5}
                />
              </View>
              {modalPart}
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Button title="log out" onPress={this._signOutAsync} />
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  infoTypeLabel: {
    fontSize: 15,
    textAlign: "right",
    color: "rgba(126,123,138,1)",
    fontFamily: "regular",
    paddingBottom: 10
  },
  infoAnswerLabel: {
    fontSize: 15,
    color: "rgba(47,44,60,1)",
    fontFamily: "regular",
    paddingBottom: 10
  }
});

export default MyInfoScreen;
