import React from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";
import { Font, Permissions, Notifications } from "expo";
import axios from "axios";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const BG_IMAGE = require("../assets/images/wallpaper_3.jpg");

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }

  // Get the token that uniquely identifies this device
  // POST the token to your backend server from where you can retrieve it to send push notifications.
  // return fetch(PUSH_ENDPOINT, {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     token: {
  //       value: token,
  //     },
  //     user: {
  //       username: 'Brent',
  //     },
  //   }),
  // });
}

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      username: "",
      password: "",
      username_valid: true,
      login_failed: false,
      showLoading: false,
      platform: Platform.OS,
      app_version: Platform.Version,
      device_info: Expo.Constants.deviceName,
      device_uuid: Expo.Constants.installationId
    };
  }

  handleSubmit = event => {
    const {
      showLoading,
      platform,
      app_version,
      device_info,
      device_uuid,
      token
    } = this.state;

    this.setState({
      showLoading: !showLoading,
      username_valid: true
    });

    const data = JSON.stringify({
      // username: this.state.username,
      // password: this.state.password,
      username: "admin",
      password: "delivera.uz",
      info: {
        platform: platform,
        app_version: app_version,
        device_info: device_info,
        device_uuid: device_uuid,
        push_token: token
      }
    });

    const url = "https://api.delivera.uz/entity/login";

    axios({
      method: "post",
      url: url,
      data: data,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: { "content-type": "application/json" }
    })
      .then(async response => {
        if (response.status === 200) {
          if (response.data.status === "Fail") {
            this.setState({
              username_valid: false,
              showLoading: false
            });
          } else {
            let token = response.data;
            await AsyncStorage.setItem("access_token", token.access_token);
            let entity_info = token.entity_info;
            await AsyncStorage.multiSet([
              ["id", entity_info.id.toString()],
              ["username", entity_info.username],
              ["entity_title", entity_info.entity]
            ]);
            this.props.navigation.navigate("App");
          }
        } else {
          console.log(response, "unknown error");
        }
      })
      .catch(function(error) {
        console.log(error.response);
      });
    event.preventDefault();
  };
  _createNotificationAsync = () => {
    Expo.Notifications.presentLocalNotificationAsync({
      title: "Reminder",
      body: "This is an important reminder!!!!",
      android: {
        channelId: "new",
        color: "#8ac53f",
        icon: "../assets/notification_icon.png"
      }
    });
  };
  async componentDidMount() {
    this._createNotificationAsync();
    if (Platform.OS === "android") {
      Expo.Notifications.createChannelAndroidAsync("new", {
        name: "Delivera Business",
        priority: "max",
        vibrate: [0, 250, 250, 250],
        sound: true
      });
    }
    registerForPushNotificationsAsync();
    let token = await Notifications.getExpoPushTokenAsync();

    await Font.loadAsync({
      regular: require("../assets/fonts/Montserrat-Regular.ttf")
    });
    this.setState({ fontLoaded: true, token: token });
  }

  render() {
    const { username, password, username_valid, showLoading } = this.state;
    return (
      <View style={styles.container}>
        <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
          {this.state.fontLoaded ? (
            <View style={styles.loginView}>
              <View style={styles.loginTitle}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.travelText}>Вход </Text>
                  <Text style={styles.plusText}>в</Text>
                </View>
                <View style={{ marginTop: -10 }}>
                  <Text style={styles.travelText}>Кабинет</Text>
                </View>
              </View>
              <View style={styles.loginInput}>
                <Input
                  leftIcon={
                    <Icon
                      name="user-o"
                      color="rgba(171, 189, 219, 1)"
                      size={25}
                    />
                  }
                  containerStyle={{ marginVertical: 10 }}
                  onChangeText={username =>
                    this.setState({ username: username, username_valid: true })
                  }
                  value={username}
                  inputStyle={{
                    marginLeft: 10,
                    color: "white",
                    fontFamily: "regular"
                  }}
                  keyboardAppearance="light"
                  placeholder="Username"
                  autoFocus={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  ref={input => (this.usernameInput = input)}
                  onSubmitEditing={() => {
                    this.passwordInput.focus();
                  }}
                  blurOnSubmit={false}
                  placeholderTextColor="white"
                  errorStyle={{ textAlign: "center", fontSize: 12 }}
                  errorMessage={
                    username_valid
                      ? null
                      : "Пожалуйста введите действительное имя пользователя"
                  }
                />
                <Input
                  leftIcon={
                    <Icon
                      name="lock"
                      color="rgba(171, 189, 219, 1)"
                      size={25}
                    />
                  }
                  containerStyle={{ marginVertical: 10 }}
                  onChangeText={password =>
                    this.setState({ password: password, username_valid: true })
                  }
                  value={password}
                  inputStyle={{
                    marginLeft: 10,
                    color: "white",
                    fontFamily: "regular"
                  }}
                  secureTextEntry={true}
                  keyboardAppearance="light"
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="done"
                  ref={input => (this.passwordInput = input)}
                  blurOnSubmit={true}
                  placeholderTextColor="white"
                />
              </View>
              <Button
                title="Войти в систему"
                activeOpacity={1}
                underlayColor="transparent"
                onPress={this.handleSubmit}
                loading={showLoading}
                loadingProps={{ size: "small", color: "white" }}
                disabled={!username_valid && password.length < 8}
                buttonStyle={styles.buttonMainStyle}
                containerStyle={{ marginVertical: 10 }}
                titleStyle={{
                  color: "white",
                  fontSize: 20,
                  fontFamily: "regular"
                }}
              />
            </View>
          ) : (
            <Text>Loading...</Text>
          )}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center"
  },
  loginView: {
    marginTop: -150,
    backgroundColor: "transparent",
    width: 250,
    height: 400
  },
  loginTitle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  travelText: {
    color: "white",
    fontSize: 30,
    fontFamily: "regular"
  },
  plusText: {
    color: "white",
    fontSize: 30
  },
  loginInput: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  footerView: {
    marginTop: 20,
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonMainStyle: {
    height: 50,
    width: 250,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 30
  }
});
