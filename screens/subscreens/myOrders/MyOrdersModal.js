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

class MyOrdersModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      token: "",
      hash: "",
      password: "",
      hash_valid: true
    };
  }
  async componentDidMount() {
    let token = await AsyncStorage.getItem("access_token");
    this.setState({
      token: token
    });
  }
  handleSubmit = event => {
    const valProps = this.props.all;
    this.setState({
      loading: true
    });
    if (valProps.status.code === "in_process") {
      const data = JSON.stringify({
        order_id: this.props.order_id
      });
      const url = "https://api.delivera.uz/drivers/take";

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
          // console.log(response.data);
          if (response.data.reason === "Accepted") {
            this.props.closed();
            this.props.getFromRest();
            this.setState({
              loading: false
            });
          }
        })
        .catch(error => {
          console.log(error.response);
        });

      event.preventDefault();
    } else {
      const data = JSON.stringify({
        code: this.state.hash
      });

      const url = "https://api.delivera.uz/drivers/confirm-order";

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
          token: +this.state.token
        }
      })
        .then(response => {
          if (response.data.status === "Success") {
            this.props.closed();
            this.props.getFromRest();
            this.setState({
              loading: false
            });
          } else if (response.data.status === "Fail") {
            this.setState({
              hash_valid: false,
              loading: false
            });
          }
        })
        .catch(error => {
          console.log(error.response);
        });

      event.preventDefault();
    }
  };
  render() {
    const { hash, hash_valid } = this.state;
    let code = this.props.all.status.code;
    let confirm_input =
      code === "on_way" ? (
        <Input
          leftIcon={
            <FontAwesome
              name="qrcode"
              color="rgba(171, 189, 219, 1)"
              size={25}
            />
          }
          containerStyle={{ marginVertical: 10 }}
          onChangeText={hash => this.setState({ hash })}
          value={hash}
          inputStyle={{ marginLeft: 10, color: "rgba(47,44,60,1)" }}
          keyboardAppearance="light"
          keyboardType="numeric"
          placeholder="Код"
          autoFocus={false}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholderTextColor="rgba(126,123,138,1)"
          errorStyle={{ textAlign: "center", fontSize: 12 }}
          errorMessage={
            hash_valid ? null : "Пожалуйста, введите правильный код"
          }
        />
      ) : null;
    let text_ask =
      code === "in_process" ? (
        <Text style={{ fontSize: 20 }}>
          Вы уверены, что вы получили заказ от {this.props.entity_name}?{" "}
        </Text>
      ) : (
        <Text style={{ fontSize: 20 }}>Подтвердите доставку по коду:</Text>
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
              title={okay_btn}
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

export default MyOrdersModal;
