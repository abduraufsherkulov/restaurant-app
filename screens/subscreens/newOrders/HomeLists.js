import React, { Component, PureComponent } from "react";

import moment from "moment";
import {
  Card,
  Tile,
  ListItem,
  Avatar,
  Input,
  Button
} from "react-native-elements";

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

import { Text, View, Stylesheet, Image } from "react-native";

import { Font } from "expo";
import MainModal from "./MainModal";

class HomeLists extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      fontLoaded: false,
      items: [],
      selectedIndex: null,
      date: "",
      time: ""
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
      dummy: false,
      date: this.state.date,
      time: this.state.time
    });
  };
  async componentDidMount() {
    let items = this.props.allProps.items;
    let dateAndTime = this.props.allProps.created_at.split(" ");
    let date = moment(dateAndTime[0]).format("DD.MM.YY");
    let time = moment(dateAndTime[1], "HH:mm:ss").format("HH:mm");

    this.setState({
      items,
      date: date,
      time: time
    });
    await Font.loadAsync({
      regular: require("../../../assets/fonts/GoogleSans-Regular.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }

  render() {
    let itemsString = this.props.allProps.itemsSentence;
    // let listProducts = this.props.allProps.items.map((l, i) => (
    //   <React.Fragment key={l.food_id}>
    //     <Text
    //       style={{ fontFamily: "regular", fontSize: 18, alignSelf: "stretch" }}
    //     >
    //       {l.food_title}{" "}
    //       <Text
    //         style={{
    //           color: "red",
    //           fontFamily: "regular"
    //         }}
    //       >
    //         x {l.food_amount}
    //       </Text>
    //     </Text>
    //     {"\n"}
    //   </React.Fragment>
    // ));
    return (
      <React.Fragment>
        {this.state.fontLoaded ? (
          <View
            style={{
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#ddd",
              marginHorizontal: 20,
              marginTop: 15
            }}
          >
            <ListItem
              onPress={this.handlePressButton}
              containerStyle={{
                paddingHorizontal: 10,
                paddingVertical: 15
              }}
              title={
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    borderColor: "#d9d9d9",
                    borderBottomWidth: 1
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBottom: 15
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          textAlign: "left",
                          fontFamily: "medium",
                          fontSize: 28
                        }}
                      >
                        № {this.props.allProps.id}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          textAlign: "right",
                          fontFamily: "medium",
                          fontSize: 16
                        }}
                      >
                        {this.state.date}{" "}
                        <Text style={{ color: "#939393" }}>|</Text>{" "}
                        {this.state.time}
                      </Text>
                    </View>
                  </View>
                </View>
              }
              subtitle={
                <View
                  style={{ flex: 1, flexDirection: "column", paddingTop: 7 }}
                >
                  {/* <Text>{listProducts}</Text> */}
                  <Text
                    style={{
                      fontFamily: "medium",
                      fontSize: 14,
                      color: "#ACACAC"
                    }}
                  >
                    {itemsString}
                  </Text>
                </View>
              }
              nav={this.props.nav}
            />
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../../../assets/loader.gif")}
            />
          </View>
        )}
      </React.Fragment>
    );
  }
}

export default HomeLists;
