import React, { Component } from "react";
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  Alert,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { Button, Input } from "react-native-elements";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

class MainModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      token: "",
      rejectItems: "",
      time: "",
      password: "",
      time_valid: true,
      order_id: ""
    };

    _isMounted = false;
  }
  async componentDidMount() {
    this._isMounted = true;
    let token = await AsyncStorage.getItem("access_token");
    if (typeof this.props.items !== "undefined") {
      let myArr = [];
      this.props.items.forEach(function(element) {
        if (element.checked === false) {
          myArr.push(element.food_id);
        }
      });
      let rejectItems = myArr.join();
      this.setState({
        rejectItems: rejectItems,
        order_id: this.props.all.id,
        token: token
      });
    }
  }
  handleSubmit = event => {
    this.setState({
      loading: true
    });
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
            this.props.acceptNewOrder();
            this.setState({
              loading: false
            });
            this.props.nav.navigate("MainOrders");
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else if (stat === "accept") {
      if (
        this.props.all.payment_type.code === "cash" &&
        this.props.all.status.code === "new"
      ) {
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
            if (response.data.reason === "Accepted") {
              // this.props.closed();
              this.props.acceptNewOrder();

              this.setState({
                loading: false
              });
              this.props.nav.navigate("MainOrders");
            }
          })
          .catch(error => {
            console.log(error.response);
          });
      } else if (
        this.props.all.payment_type.code === "cash" &&
        this.props.all.status.code === "paid"
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
                this.props.acceptNewOrder();

                this.setState({
                  loading: false
                });
                this.props.nav.navigate("MainOrders");
              }
            })
            .catch(error => {
              console.log(error.response);
            });
        }
      } else if (
        this.props.all.payment_type.code === "payme" &&
        this.props.all.status.code === "paid"
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
                this.props.acceptNewOrder();

                this.setState({
                  loading: false
                });
                this.props.nav.navigate("MainOrders");
              }
            })
            .catch(error => {
              console.log(error.response);
            });
        }
      } else {
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
            console.log(response.data, "sec");
            if (response.data.reason === "Accepted") {
              // this.props.closed();
              this.props.acceptNewOrder();

              this.setState({
                loading: false
              });
              this.props.nav.navigate("MainOrders");
            }
          })
          .catch(error => {
            console.log(error.response);
          });
      }
    }

    event.preventDefault();
  };
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    // console.log(this.props.all);
    const { time, time_valid } = this.state;
    let code = this.props.all.payment_type.code;
    let status = this.props.all.status.code;
    let confirm_input =
      code === "cash" || status === "paid" ? (
        <Input
          leftIcon={
            <FontAwesome
              name="clock-o"
              color="rgba(171, 189, 219, 1)"
              size={25}
            />
          }
          containerStyle={{ marginVertical: 10 }}
          onChangeText={time => this.setState({ time: time, time_valid: true })}
          value={time}
          inputStyle={{ marginLeft: 10, color: "rgba(47,44,60,1)" }}
          keyboardAppearance="light"
          keyboardType="numeric"
          placeholder="32"
          autoFocus={false}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholderTextColor="rgba(126,123,138,1)"
          errorStyle={{ textAlign: "center", fontSize: 12 }}
          errorMessage={time_valid ? null : "Время должно быть больше нуля!"}
        />
      ) : null;
    let text_ask =
      code === "payme" && status === "new" ? (
        <Text style={{ fontSize: 20 }}>
          Вы уверены, что вы получили заказ от {this.props.entity_name}?{" "}
        </Text>
      ) : (
        <Text style={{ fontSize: 20 }}>
          Расчетное время, когда еда будет готова.:
        </Text>
      );
    let okay_btn = code === "in_process" ? "Получил" : "Доставил";
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.openUp}
        onRequestClose={this.props.closed}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20
          }}
        >
          {text_ask}
          {confirm_input}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
              marginTop: 20
            }}
          >
            <Button
              title="Отмена"
              onPress={this.props.closed}
              icon={<FontAwesome name="close" size={15} color="white" />}
              iconContainerStyle={{ marginRight: 10 }}
              titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
                backgroundColor: "rgba(199, 43, 98, 1)",
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 30
              }}
              containerStyle={{ width: 130 }}
            />
            <Button
              title="Принят"
              onPress={this.handleSubmit}
              loading={this.state.loading}
              loadingProps={{ size: "large", color: "rgba(111, 202, 186, 1)" }}
              icon={<FontAwesome name="check" size={15} color="white" />}
              iconRight
              iconContainerStyle={{ marginLeft: 10 }}
              titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
                backgroundColor: "rgba(90, 154, 230, 1)",
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 30
              }}
              containerStyle={{ width: 150 }}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

export default MainModal;
