import React, { Component } from "react";
import { Text, Button, CheckBox, ListItem } from "react-native-elements";

import {
  Platform,
  StyleSheet,
  Image,
  View,
  Linking,
  Dimensions,
  ScrollView,
  AsyncStorage
} from "react-native";

import * as Font from 'expo-font';

import MainModal from "./subscreens/newOrders/MainModal";

import axios from "axios";

const SCREEN_WIDTH = Dimensions.get("window").width;

class InfoScreenTitle extends Component {
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
      <Text>
        {this.state.fontLoaded ? (
          <Text
            style={{
              fontFamily: "regular",
              fontSize: 18,
              color: "black"
            }}
          >
            {"Номер заказа: " + this.props.main_id}
          </Text>
        ) : null}
      </Text>
    );
  }
}

class InfoScreen extends Component {
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
      items: [],
      loading: false,
      rejectItems: "",
      tickAll: true
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
  handleSubmit = () => {
    this.setState({
      loading: true
    });

    const { params } = this.props.navigation.state;
    let stat = this.state.rejectItems.length > 0 ? "reject" : "accept";

    if (stat === "reject") {
      console.log("rejected");
      const data = JSON.stringify({
        order_id: this.state.order_id,
        removedItems: this.state.rejectItems
      });
      console.log(data);
      const url = "https://api.delivera.uz/entity/reject";
      axios({
        method: "post",
        url: url,
        data: data,
        auth: {
          username: "delivera",
          password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
        },
        headers: {
          "content-type": "application/json",
          token: this.state.token
        }
      })
        .then(response => {
          if (response.data.reason === "Accepted") {
            params.acceptNewOrder();
            this.setState({
              loading: false
            });
            this.props.navigation.goBack();
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else if (stat === "accept") {
      if (
        this.state.payment_status === "new" &&
        this.state.payment_type === "payme"
      ) {
        const data = JSON.stringify({
          order_id: this.state.order_id
        });
        console.log(data);
        const url = "https://api.delivera.uz/entity/accept";
        axios({
          method: "post",
          url: url,
          data: data,
          auth: {
            username: "delivera",
            password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
          },
          headers: {
            "content-type": "application/json",
            token: this.state.token
          }
        })
          .then(response => {
            if (response.data.reason === "Accepted") {
              params.acceptNewOrder();
              this.setState({
                loading: false
              });
              this.props.navigation.goBack();
            }
          })
          .catch(error => {
            console.log(error.response);
          });
      } else if (
        this.state.payment_type === "payme" &&
        this.state.status === "paid"
      ) {
        if (this.state.time.length === 0 || this.state.time === 0) {
          this.setState({
            time_valid: false,
            loading: false
          });
        } else {
          let numb = parseInt(this.state.time);

          const data = JSON.stringify({
            order_id: this.props.order_id,
            period: numb
          });
          const url = "https://api.delivera.uz/entity/accept-to-process";
          axios({
            method: "post",
            url: url,
            data: data,
            auth: {
              username: "delivera",
              password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
            },
            headers: {
              "content-type": "application/json",
              token: this.state.token
            }
          })
            .then(response => {
              console.log(response.data, "first");
              if (response.data.reason === "Accepted") {
                // this.props.closed();
                params.acceptNewOrder();

                this.setState({
                  loading: false
                });
                this.props.navigation.goBack();
              }
            })
            .catch(error => {
              console.log(error.response);
            });
        }
      }
    }
  };
  async componentDidMount() {
    let allVal = await this.props.navigation.getParam("all");
    let nav = await this.props.navigation.getParam("nav");
    let acceptNewOrder = await this.props.navigation.getParam("acceptNewOrder");
    //console.log(allVal.items);
    this._isMounted = true;
    let items = allVal.items;

    let token = await AsyncStorage.getItem("access_token");
    await Font.loadAsync({
      regular: require("../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../assets/fonts/GoogleSans-Medium.ttf"),
      bold: require("../assets/fonts/GoogleSans-Bold.ttf")
    });

    this.setState({
      items: items,
      fontLoaded: true,
      token: token,
      order_id: allVal.id,
      payment_type: allVal.payment_type.code,
      payment_status: allVal.status.code
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  // componentDidUpdate(prevProps, prevState) {
  //   // Typical usage (don't forget to compare props):
  //   if (this.state.items !== prevState.items) {
  //     console.log("okay");
  //   } else {
  //     console.log("not okay");
  //   }
  // }
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <InfoScreenTitle
        navigation={navigation}
        main_id={navigation.getParam("all").id}
      />
    ),
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
    const changedCheckbox = this.state.items.find(j => j.basket_id === id);
    changedCheckbox.checked = !changedCheckbox.checked;
    const checkboxes = Object.assign({}, this.state.items, changedCheckbox);
    let myCheck = [];
    let myUnCheck = [];
    this.state.items.map(obj => {
      if (obj.checked === false) {
        myCheck.push(obj.checked);
        console.log(this.state.items.length, myCheck.length);
        if (this.state.items.length === myCheck.length) {
          this.setState({
            tickAll: false
          });
        }
      } else {
        myUnCheck.push(obj.checked);
        if (this.state.items.length === myUnCheck.length) {
          this.setState({
            tickAll: true
          });
        }
      }
    });

    if (typeof this.state.items !== "undefined") {
      let myArr = [];
      this.state.items.forEach(function(element) {
        if (element.checked === false) {
          myArr.push(element.basket_id);
        }
      });
      let rejectItems = myArr.join();
      this.setState({
        rejectItems: rejectItems,
        checkboxes
      });
    }
  }

  handleCheckboxes = () => {
    let myArr = [];

    if (this.state.tickAll === true) {
      this.state.items.map(obj => {
        // let keys = Object.keys(obj);
        obj.checked = false;
        myArr.push(obj);
      });
      let rejectItems;
      if (typeof this.state.items !== "undefined") {
        let myArr = [];
        this.state.items.forEach(function(element) {
          if (element.checked === false) {
            myArr.push(element.basket_id);
          }
        });
        rejectItems = myArr.join();
      }
      this.setState({
        myArr,
        tickAll: false,
        rejectItems: rejectItems
      });
    } else {
      this.state.items.map(obj => {
        // let keys = Object.keys(obj);
        obj.checked = true;
        myArr.push(obj);
      });

      let rejectItems;
      if (typeof this.state.items !== "undefined") {
        let myArr = [];
        this.state.items.forEach(function(element) {
          if (element.checked === false) {
            myArr.push(element.basket_id);
          }
        });
        rejectItems = myArr.join();
      }
      this.setState({
        myArr,
        tickAll: true,
        rejectItems: rejectItems
      });
    }
  };
  render() {
    console.log(this.state.rejectItems);
    let allVal = this.props.navigation.getParam("all");
    let nav = this.props.navigation.getParam("nav");
    let dummy = this.props.navigation.getParam("dummy");
    let acceptNewOrder = this.props.navigation.getParam("acceptNewOrder");
    let date = this.props.navigation.getParam("date");
    let time = this.props.navigation.getParam("time");
    let overall = allVal.totalPrice.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    let listProducts = this.state.fontLoaded
      ? allVal.items.map((l, i) => (
          <View key={l.basket_id} style={{ flex: 1 }}>
            <CheckBox
              title={
                <Text
                  style={
                    l.checked === true
                      ? styles.checkedText
                      : styles.uncheckedText
                  }
                >
                  {l.food_title}{" "}
                  {l.attributes.map((x, k) => (
                    <React.Fragment key={k}>
                      <Text style={{fontFamily: 'regular'}}>
                        {"\n"}
                        {x}
                      </Text>
                    </React.Fragment>
                  ))}
                  {" "}x{" "}{l.food_amount}
                </Text>
              }
              containerStyle={{
                flex: 1,
                justifyContent: "space-between",
                backgroundColor: "white",
                borderWidth: 0,
                padding: 0,
                paddingVertical: 13,
                paddingHorizontal: 0,
                marginLeft: 0,
                marginRight: 0,
                marginHorizontal: 0,
                margin: 0
              }}
              iconLeft
              center
              iconType="ionicon"
              checkedIcon="md-checkbox"
              uncheckedIcon="md-square-outline"
              checkedColor="#5caa57"
              onPress={() => this.checkItems(l.basket_id, i)}
              checked={this.state.items[i].checked}
            />
          </View>
        ))
      : null;

    let listDummyProducts = this.state.fontLoaded
      ? allVal.items.map((l, i) => (
          <View key={l.basket_id}>
            <ListItem
              title={
                <Text style={styles.dummyCheckedText}>
                  {l.food_title} (x{l.food_amount})
                </Text>
              }
              containerStyle={{
                flex: 1,
                justifyContent: "space-between",
                backgroundColor: "white",
                borderWidth: 0,
                padding: 0,
                paddingVertical: 13,
                paddingHorizontal: 0,
                marginLeft: 0,
                marginRight: 0,
                marginHorizontal: 0,
                margin: 0
              }}
              center
            />
          </View>
        ))
      : null;
    let showProducts =
      allVal.status.code === "new" ? listProducts : listDummyProducts;
    let modalPart = this.state.opened ? (
      <MainModal
        nav={nav}
        openUp={this.state.opened}
        closed={this.handleClose}
        order_id={allVal.id}
        acceptNewOrder={acceptNewOrder}
        //  getFromRest={this.props.getFromRest}
        all={allVal}
        items={this.state.items}
      />
    ) : null;
    let mainButton;
    if (this.state.rejectItems.length > 0) {
      mainButton = (
        <Button
          containerStyle={{ marginVertical: 20 }}
          loading={this.state.loading}
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
            backgroundColor: "#FB5607",
            elevation: 0
          }}
          title={"Ответить"}
          titleStyle={{
            fontFamily: "regular",
            fontSize: 20,
            color: "white",
            textAlign: "center"
          }}
          onPress={this.handleSubmit}
          loadingProps={{ size: "small", color: "white" }}
        />
      );
    } else if (
      this.state.payment_status === "new" &&
      this.state.payment_type === "payme"
    ) {
      mainButton = (
        <Button
          containerStyle={{ marginVertical: 20 }}
          loading={this.state.loading}
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
            backgroundColor: "#5caa57",
            elevation: 0
          }}
          title={"Далее"}
          titleStyle={{
            fontFamily: "regular",
            fontSize: 20,
            color: "white",
            textAlign: "center"
          }}
          onPress={this.handleSubmit}
          loadingProps={{ size: "small", color: "white" }}
        />
      );
    } else {
      mainButton = (
        <Button
          containerStyle={{ marginVertical: 20 }}
          loading={this.state.loading}
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
            backgroundColor: "#5caa57",
            elevation: 0
          }}
          title={"Далее"}
          titleStyle={{
            fontFamily: "regular",
            fontSize: 20,
            color: "white",
            textAlign: "center"
          }}
          onPress={this.handleModal}
          loadingProps={{ size: "small", color: "white" }}
        />
      );
    }
    let removeAll;
    if (
      this.state.payment_status === "paid" &&
      this.state.payment_type === "payme"
    ) {
      removeAll = null;
    } else {
      removeAll = (
        <Text
          style={
            this.state.tickAll === true ? styles.untickStyle : styles.tickStyle
          }
          onPress={this.handleCheckboxes}
        >
          {this.state.tickAll === true ? "снять все" : "отметить все"}
        </Text>
      );
    }
    return (
      <ScrollView>
        <View
          style={{
            flex: 1,
            margin: 20,
            borderWidth: 1,
            borderColor: "rgba(172, 172, 172, 0.25)"
          }}
        >
          {this.state.fontLoaded ? (
            <View
              style={{ flex: 1, paddingHorizontal: 27, paddingVertical: 14 }}
            >
              <View
                style={{
                  flex: 1,
                  paddingBottom: 15,
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderColor: "rgba(172, 172, 172, 0.25)"
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      textAlign: "left",
                      fontFamily: "medium",
                      fontSize: 16
                    }}
                  >
                    {date} <Text style={{ color: "#939393" }}>|</Text> {time}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>{removeAll}</View>
              </View>
              <View>{showProducts}</View>
              <View style={{ paddingTop: 52, flex: 1, flexDirection: "row" }}>
                <Text
                  style={{
                    fontFamily: "medium",
                    fontSize: 14,
                    color: "#848484",
                    alignSelf: "center"
                  }}
                >
                  Сумма заказа:
                </Text>
                <Text
                  style={{
                    fontFamily: "bold",
                    fontSize: 20,
                    color: "#333333",
                    paddingLeft: 20
                  }}
                >
                  {overall} сум
                </Text>
              </View>
              <View
                style={{
                  flex: 0.4,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {mainButton}
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
              <Image
                style={{ width: 100, height: 100 }}
                source={require("../assets/loader.gif")}
              />
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
  },
  checkedText: {
    color: "#333333",
    flex: 1,
    fontFamily: "medium",
    paddingLeft: 27,
    fontSize: 18
  },
  uncheckedText: {
    color: "rgba(172, 172, 172, 0.47)",
    flex: 1,
    paddingLeft: 27,
    fontFamily: "medium",
    fontSize: 18,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid"
  },
  dummyCheckedText: {
    color: "#333333",
    flex: 1,
    fontFamily: "medium",
    fontSize: 18
  },
  tickStyle: {
    textAlign: "right",
    fontFamily: "medium",
    fontSize: 14,
    color: "#5caa57"
  },
  untickStyle: {
    textAlign: "right",
    fontFamily: "medium",
    fontSize: 14,
    color: "#FB5607"
  }
});

export default InfoScreen;
