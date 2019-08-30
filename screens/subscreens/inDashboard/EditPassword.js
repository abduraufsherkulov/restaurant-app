import React, { Component } from "react";
import {
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
import Modal from "react-native-modal";
import * as Font from 'expo-font';

class EditPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      token: "",
      rejectItems: "",
      time: "",
      old_pass: "",
      new_pass: "",
      old_pass_valid: true,
      new_pass_valid: true,
      password: "",
      time_valid: true,
      order_id: "",
      fontLoaded: false,
      showLoading: false,
      errorMessage: null
    };

    _isMounted = false;
  }
  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../../../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../../../assets/fonts/GoogleSans-Medium.ttf"),
      roboto: require("../../../assets/fonts/Roboto-Regular.ttf")
    });

    this._isMounted = true;
    let token = await AsyncStorage.getItem("access_token");
    this.setState({
      token: token,
      fontLoaded: true
    });
  }
  handleSubmit = event => {
    this.setState({
      loading: true
    });
    const data = JSON.stringify({
      old_password: this.state.old_pass,
      new_password: this.state.new_pass
    });
    const url = "https://api.delivera.uz/entity/change-password";
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
        // console.log(response.data.reason);
        if (response.data.reason === "Password changed") {
          this.setState({
            loading: false
          });
          this.props.closed();
        } else if (response.data.reason === "Change Password failed") {
          this.setState({
            loading: false,
            old_pass_valid: false
          });
        }
      })
      .catch(error => {
        console.log(error);
      });

    event.preventDefault();
  };
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    // console.log(this.props.all);
    const { old_pass, old_pass_valid, new_pass, new_pass_valid } = this.state;
    return (
      <Modal
        isVisible={this.props.openUp}
        onBackButtonPress={this.props.closed}
        animationOut="slideOutDown"
        // onRequestClose={this.props.closed}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: 22,
            borderRadius: 4,
            borderColor: "rgba(0, 0, 0, 0.1)"
          }}
        >
          {this.state.fontLoaded ? (
            <React.Fragment>
              <Text style={{ fontSize: 20, fontFamily: "medium" }}>
                Изменить пароль{" "}
              </Text>
              <Input
                leftIcon={
                  <FontAwesome
                    name="lock"
                    color="rgba(171, 189, 219, 1)"
                    size={25}
                  />
                }
                containerStyle={{ marginVertical: 10 }}
                onChangeText={old_pass =>
                  this.setState({ old_pass: old_pass, old_pass_valid: true })
                }
                value={old_pass}
                inputStyle={{
                  fontFamily: "medium",
                  marginLeft: 10,
                  color: "rgba(47,44,60,1)"
                }}
                keyboardAppearance="light"
                keyboardType="default"
                placeholder="Прежний пароль"
                autoFocus={false}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholderTextColor="rgba(126,123,138,1)"
                errorStyle={{
                  fontFamily: "regular",
                  textAlign: "center",
                  fontSize: 12
                }}
                errorMessage={old_pass_valid ? null : "Старый пароль неверный!"}
              />
              <Input
                leftIcon={
                  <FontAwesome
                    name="lock"
                    color="rgba(171, 189, 219, 1)"
                    size={25}
                  />
                }
                containerStyle={{ marginVertical: 10 }}
                onChangeText={new_pass =>
                  this.setState({ new_pass: new_pass, new_pass_valid: true })
                }
                value={new_pass}
                inputStyle={{
                  fontFamily: "medium",
                  marginLeft: 10,
                  color: "rgba(47,44,60,1)"
                }}
                keyboardAppearance="light"
                keyboardType="default"
                placeholder="Новый пароль"
                autoFocus={false}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholderTextColor="rgba(126,123,138,1)"
                errorStyle={{
                  fontFamily: "regular",
                  textAlign: "center",
                  fontSize: 12
                }}
                errorMessage={
                  new_pass_valid ? null : "Время должно быть больше нуля!"
                }
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%"
                }}
              >
                <Button
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  buttonStyle={{
                    height: 45,
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                    elevation: 0
                  }}
                  title={"НАЗАД"}
                  titleStyle={{
                    fontSize: 14,
                    color: "#ee4646",
                    fontFamily: "roboto"
                  }}
                  onPress={this.props.closed}
                />

                <Button
                  loading={this.state.loading}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  buttonStyle={{
                    height: 45,
                    width: 150,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                    elevation: 0
                  }}
                  title={"ПОДТВЕРДИТЬ"}
                  titleStyle={{
                    fontSize: 14,
                    color: "#5caa57",
                    fontFamily: "roboto"
                  }}
                  onPress={this.handleSubmit}
                  loadingProps={{ size: "small", color: "#5caa57" }}
                />
              </View>
            </React.Fragment>
          ) : null}
        </View>
      </Modal>
    );
  }
}

export default EditPassword;
