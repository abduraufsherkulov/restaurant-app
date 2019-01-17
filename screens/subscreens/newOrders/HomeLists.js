import React, { Component } from "react";

import moment from "moment";
import {
  Text,
  Card,
  Tile,
  ListItem,
  Avatar,
  View,
  Input
} from "react-native-elements";

import { Font } from "expo";
import MainModal from "./MainModal";

class HomeLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      fontLoaded: false,
      items: []
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
      acceptNewOrder: this.props.acceptNewOrder
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
    let listProducts = this.props.allProps.items.map((l, i) => (
      <Text key={l.food_id} style={{ fontFamily: "regular", fontSize: 18 }}>
        {l.food_title}{" "}
        <Text
          style={{
            color: "red"
          }}
        >
          x {l.food_amount}
        </Text>
      </Text>
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
    return (
      <React.Fragment>
        {this.state.fontLoaded ? (
          <React.Fragment>
            <ListItem
              contentContainerStyle={{ flex: 0.7 }}
              onPress={this.handlePress}
              title={<React.Fragment>{listProducts}</React.Fragment>}
              subtitle={this.props.allProps.order_type}
              chevron
              nav={this.props.nav}
              bottomDivider
              buttonGroup={{
                buttons: ["Принят"],
                onPress: this.handleModal,
                buttonStyle: {
                  backgroundColor: "#8ac53f"
                },
                containerStyle: {
                  flex: 0.3,
                  height: 70,
                  borderRadius: 40
                },
                textStyle: {
                  color: "white",
                  fontSize: 20,
                  fontFamily: "regular"
                },
                style: {
                  fontSize: 20,
                  color: "red"
                }
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
