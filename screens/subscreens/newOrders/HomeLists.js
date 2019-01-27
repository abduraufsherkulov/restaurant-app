import React, { Component, PureComponent } from "react";

import moment from "moment";
import {
  Text,
  Card,
  Tile,
  ListItem,
  Avatar,
  Input,
  Button
} from "react-native-elements";

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

import { View } from "react-native";

import { Font } from "expo";
import MainModal from "./MainModal";

class HomeLists extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      fontLoaded: false,
      items: [],
      selectedIndex: null
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
    console.log(allProps);
    this.props.nav.navigate("InfoScreen", {
      all: allProps,
      nav: this.props.nav,
      acceptNewOrder: this.props.acceptNewOrder,
      dummy: true
    });
  };
  handlePressButton = () => {
    const { allProps } = this.props;
    console.log(allProps);
    this.props.nav.navigate("InfoScreen", {
      all: allProps,
      nav: this.props.nav,
      acceptNewOrder: this.props.acceptNewOrder,
      dummy: false
    });
  };
  async componentDidMount() {
    let items = this.props.allProps.items;

    this.setState({
      items
    });
    await Font.loadAsync({
      georgia: require("../../../assets/fonts/Georgia.ttf"),
      regular: require("../../../assets/fonts/Montserrat-Regular.ttf"),
      light: require("../../../assets/fonts/Montserrat-Light.ttf"),
      bold: require("../../../assets/fonts/Montserrat-Bold.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }

  render() {
    let tickBool = this.props.allProps.payment_type.code;
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

    let modalPart = this.state.opened ? (
      <MainModal
        openUp={this.state.opened}
        closed={this.handleClose}
        order_id={this.props.allProps.id}
        acceptNewOrder={this.props.acceptNewOrder}
        // getFromRest={this.props.getFromRest}
        all={this.props.allProps}
        items={this.state.items}
      />
    ) : null;

    const component1 = () => (
      <Button
        onPress={this.handleModal}
        title={null}
        buttonStyle={{
          backgroundColor: "#8ac53f",
          width: 300,
          height: 45,
          borderColor: "transparent",
          borderWidth: 0,
          borderRadius: 5
        }}
        icon={
          tickBool === "cash" ? (
            <MaterialIcons name="done-all" size={32} color="white" />
          ) : (
            <FontAwesome name="check" size={32} color="white" />
          )
        }
      />
    );

    const component2 = () => (
      <Button
        onPress={this.handlePressButton}
        title={null}
        buttonStyle={{
          backgroundColor: "rgba(199, 43, 98, 1)",
          width: 300,
          height: 45,
          borderColor: "transparent",
          borderWidth: 0,
          borderRadius: 5
        }}
        icon={<FontAwesome name="remove" size={32} color="white" />}
      />
    );
    const buttons = [{ element: component1 }, { element: component2 }];
    return (
      <React.Fragment>
        {this.state.fontLoaded ? (
          <React.Fragment>
            <ListItem
              //      contentContainerStyle={{ flex: 0.7 }}
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
                  {this.props.allProps.payment_type.title === "PAYME" ? (
                    <FontAwesome name="credit-card" size={25} />
                  ) : (
                    <FontAwesome name="money" size={25} color="#8ac53f" />
                  )}{" "}
                  {this.props.allProps.payment_type.title}
                </Text>
              }
              nav={this.props.nav}
              bottomDivider
              buttonGroup={{
                buttons: buttons,
                buttonStyle: {
                  backgroundColor: "white",
                  borderWidth: 0
                },
                containerStyle: {
                  height: 100,
                  flex: 0.3,
                  flexDirection: "column",
                  borderColor: "white"
                  //  borderRadius: 40
                },
                textStyle: {
                  color: "white",
                  fontSize: 20,
                  fontFamily: "regular"
                },
                underlayColor: "red"
              }}
            />
            {modalPart}
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default HomeLists;
