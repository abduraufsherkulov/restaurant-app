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

import { Text, View, StyleSheet, Image } from "react-native";

import { Font } from "expo";

class MyOrdersList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      fontLoaded: false,
      items: [],
      selectedIndex: null,
      date: "",
      time: +"",
      leftout: false,
      added: false,
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
    this.props.nav.navigate("MyInfoScreen", {
      all: allProps,
      nav: this.props.nav,
      acceptNewOrder: this.props.acceptNewOrder,
      dummy: true
    });
  };
  handlePressButton = () => {
    const { allProps } = this.props;
    // console.log(allProps);
    this.props.nav.navigate("MyInfoScreen", {
      all: allProps,
      nav: this.props.nav,
      acceptNewOrder: this.props.acceptNewOrder,
      dummy: false,
      date: this.state.date,
      time: this.state.time
    });
  };

    tick() {
      let items = this.props.allProps.items;
      let dateAndTime = this.props.allProps.created_at.split(" ");
      let date = moment(dateAndTime[0]).format("DD.MM.YY");
      let time = moment(dateAndTime[1], "HH:mm:ss").format("HH:mm");
  
      const { id, handlePress, entity_name, allProps } = this.props;
      const { updated_at, period } = allProps;
      //current time
      let now = moment();
      //the time when the food will be ready
      let readyTime = moment(updated_at).add(+period, "minutes");
      //the difference between readyTime and Now
      let pickTime = moment.duration(readyTime.diff(now));
      //timeLeft in minutes
      let timeLeft = +pickTime.asMinutes().toFixed(0);
      // if time left is less than 0, print order ready
      // console.log(timeLeft, "top");
      if (timeLeft === 0 || timeLeft < 0) {
        this.setState({
          date: date,
          time: time,
          timeLeft: +timeLeft,
        }, ()=>{
          if(this.state.leftout === false ){
            this.props.updateUp();
            this.setState({ 
              leftout: true
            })
          }
        });
      } else {
        this.setState({
          date: date,
          time: time,
          timeLeft: +timeLeft,
          ready: true
        });
      }
  }


  async componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      60000
    );
    let items = this.props.allProps.items;
    let dateAndTime = this.props.allProps.created_at.split(" ");
    let date = moment(dateAndTime[0]).format("DD.MM.YY");
    let time = moment(dateAndTime[1], "HH:mm:ss").format("HH:mm");

    const { id, handlePress, entity_name, allProps } = this.props;
    const { updated_at, period } = allProps;
    //current time
    let now = moment();
    //the time when the food will be ready
    let readyTime = moment(updated_at).add(+period, "minutes");
    //the difference between readyTime and Now
    let pickTime = moment.duration(readyTime.diff(now));
    //timeLeft in minutes
    let timeLeft = +pickTime.asMinutes().toFixed(0);
    // if time left is less than 0, print order ready
    // console.log(timeLeft, "top");
    await Font.loadAsync({
      regular: require("../../../assets/fonts/GoogleSans-Regular.ttf")
    });
    if (timeLeft === 0 || timeLeft < 0) {
      this.setState({
        items,
        date: date,
        time: time,
        fontLoaded: true,
        timeLeft: +timeLeft,
        leftout: true
      });
      this.props.updateUp();
    } else {
      this.setState({
        items,
        date: date,
        time: time,
        fontLoaded: true,
        timeLeft: +timeLeft,
        ready: true
      });
    }
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  render() {
    const { timeLeft } = this.state;
    let time_status;
    if (timeLeft > 0) {
      time_status = (
        <Text
          style={{
            fontFamily: "medium",
            fontSize: 40,
            color: "#333333",
            alignSelf: "center",
            textAlign: "center"
          }}
        >
          {timeLeft}
        </Text>
      );
    } else {
      time_status = (
        <Text
          style={{
            fontFamily: "medium",
            fontSize: 40,
            color: "white",
            alignSelf: "center",
            textAlign: "center"
          }}
        >
          {Math.abs(timeLeft)}
        </Text>
      );
    }

    let itemsString = this.props.allProps.itemsSentence;
    let listProducts = this.props.allProps.items.map((l, i) => (
      <React.Fragment key={l.basket_id}>
        <Text
          style={{ fontFamily: "medium", fontSize: 14, alignSelf: "stretch" }}
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

                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBottom: 5
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "regular",
                          color: "#acacac",
                          fontSize: 16
                        }}
                      >
                        заказ
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "regular",
                          color: "#acacac",
                          fontSize: 16,
                          textAlign: "center"
                        }}
                      >
                        осталось
                      </Text>
                    </View>
                  </View>
                </View>
              }
              subtitle={
                <View style={{ flex: 1, flexDirection: "row", paddingTop: 20 }}>
                  <View style={{ flex: 1 }}>
                    <Text>{listProducts}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={this.state.ready ? styles.ready : styles.notReady}
                    >
                      {time_status}
                    </View>
                    <Text
                      style={{
                        fontFamily: "medium",
                        fontSize: 16,
                        color: "#acacac"
                      }}
                    >
                      минут
                    </Text>
                  </View>
                  {/* <Text
                    style={{
                      fontFamily: "medium",
                      fontSize: 14,
                      color: "#ACACAC"
                    }}
                  >
                    {itemsString}
                  </Text> */}
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

const styles = StyleSheet.create({
  ready: {
    borderWidth: 1,
    borderRadius: 100,
    width: 60,
    height: 60
  },
  notReady: {
    borderWidth: 1,
    borderRadius: 100,
    width: 60,
    height: 60,
    backgroundColor: "#fb5607"
  }
});
export default MyOrdersList;
