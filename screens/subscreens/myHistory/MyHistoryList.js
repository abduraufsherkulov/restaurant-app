import React, { Component } from "react";

import moment from "moment";
import {
  Text,
  Card,
  Tile,
  ListItem,
  Avatar,
  View,
  Input,
  Button
} from "react-native-elements";
import * as Font from 'expo-font';

import { LinearGradient } from "expo";
import { TouchableHighlight } from "react-native";

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
//import MyOrdersModal from "./MyOrdersModal";

class MyHistoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      fontLoaded: false
    };
  }
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

  handlePress = () => {
    const { allProps } = this.props;
    // console.log(allProps);
    this.props.nav.navigate("DummyInfoScreen", {
      all: allProps,
      nav: this.props.nav,
      showAllData: this.props.showAllData
    });
  };

  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../../../assets/fonts/GoogleSans-Regular.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  render() {
    let listProducts = this.props.allProps.items.map((l, i) => (
      <React.Fragment key={l.food_id}>
        <Text
          style={{ fontFamily: "regular", fontSize: 18, alignSelf: "stretch" }}
        >
          {l.food_title}{" "}
          <Text
            style={{
              color: "red",
              fontFamily: "regular"
            }}
          >
            x {l.food_amount}
          </Text>
        </Text>
        {"\n"}
      </React.Fragment>
    ));
    return (
      <React.Fragment>
        {this.state.fontLoaded ? (
          <React.Fragment>
            <ListItem
              onPress={this.handlePress}
              title={
                <React.Fragment>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontFamily: "regular",
                      fontSize: 20
                    }}
                  >
                    {this.props.allProps.id}
                  </Text>
                  <Text
                    style={{
                      paddingTop: 15,
                      paddingBottom: 15,
                      borderTopWidth: 1,
                      borderTopColor: "#a7bdb6",
                      borderBottomWidth: 1,
                      borderBottomColor: "#a7bdb6"
                    }}
                  >
                    {listProducts}
                  </Text>
                </React.Fragment>
              }
              subtitle={
                <Text
                  style={{
                    fontFamily: "regular",
                    color: "gray",
                    paddingTop: 10
                  }}
                >
                  {this.props.allProps.payment_type.code === "payme" ? (
                    <FontAwesome name="credit-card" size={25} />
                  ) : (
                    <FontAwesome name="money" size={25} color="#8ac53f" />
                  )}{" "}
                  {this.props.allProps.payment_type.title}
                </Text>
              }
              nav={this.props.nav}
              bottomDivider
              rightElement={
                <Text>
                  <Text style={{ fontFamily: "regular", color: "red" }}>
                    Статус заказа:
                  </Text>
                  {"\n"}
                  <Text style={{ fontFamily: "regular" }}>
                    {this.props.allProps.status.title}
                  </Text>
                </Text>
              }
            />
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default MyHistoryList;
