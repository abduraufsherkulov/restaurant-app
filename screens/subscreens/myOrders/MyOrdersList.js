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
import { Font } from "expo";

import { LinearGradient } from "expo";
import { TouchableHighlight } from "react-native";

import MyOrdersModal from "./MyOrdersModal";

class MyOrdersList extends Component {
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
    console.log(allProps);
    this.props.nav.navigate("MyInfoScreen", {
      all: allProps,
      nav: this.props.nav,
      getFromRest: this.props.getFromRest
    });
  };

  async componentDidMount() {
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

    // let code = allProps.status.code;
    // const btn_status = code === "in_process" ? "Получил" : "Доставлен";
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
            {/* <MyOrdersModal
              openUp={this.state.opened}
              closed={this.handleClose}
              order_id={this.props.allProps.id}
              acceptNewOrder={this.props.acceptNewOrder}
              getFromRest={this.props.getFromRest}
              all={this.props.allProps}
            /> */}
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default MyOrdersList;
