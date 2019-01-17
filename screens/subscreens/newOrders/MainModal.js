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
import { Button } from "react-native-elements";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

class MainModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      token: "",
      rejectItems: ""
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

    // if (typeof this.props.items !== "undefined") {
    //   let numb = this.props.items.find(j => j.checked === false);
    //   status = typeof numb === "object" ? "reject" : "accept";
    //   let myArr = [];
    //   this.props.items.forEach(function(element) {
    //     if (element.checked === false) {
    //       myArr.push(element.food_id);
    //     }
    //   });
    //   let rejectItems = myArr.join();
    //   console.log(rejectItems);
    // }

    if (stat === "reject") {
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
      const data = JSON.stringify({
        order_id: this.state.order_id
      });
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

    event.preventDefault();
  };
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    console.log(this.state);
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
          <Text style={{ fontSize: 20 }}>
            Вы уверены, что хотите принять заказ от {this.props.entity_name}?{" "}
          </Text>

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
