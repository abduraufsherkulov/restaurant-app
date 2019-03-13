import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import moment from "moment";
import {
  AsyncStorage,
  View,
  StatusBar,
  StyleSheet,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  DatePickerAndroid
} from "react-native";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";
import { Text, Button } from "react-native-elements";
import { Font } from "expo";
import { BarChartMain, PieChart, PieChartMain } from "./Statistics";
const isAndroid = Platform.OS === "android";

import {
  NavigationLogo,
  Phone,
  Lock,
  RectangleDivider,
  HorizontalDivider
} from "../assets/images/MainSvg";

class MyDashboardTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <NavigationLogo />
      </View>
    );
  }
}

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      full_name: "",
      phone: "",
      token: "",
      loading: true,
      showLoading: false,
      today: moment(new Date()).format("DD.MM.YY"),
      year: moment(new Date()).format("YYYY"),
      month: moment(new Date()).format("MM"),
      day: moment(new Date()).format("DD"),
      graphLoading: true,
      pieValue: [
        {
          key: 1,
          amount: 50,
          svg: { fill: "#d499d0" }
        },
        {
          key: 2,
          amount: 50,
          svg: { fill: "#ea8684" }
        },
        {
          key: 3,
          amount: 40,
          svg: { fill: "#f2d283" }
        },
        {
          key: 4,
          amount: 95,
          svg: { fill: "#92ccf1" }
        },
        {
          key: 5,
          amount: 35,
          svg: { fill: "#ecb3ff" }
        },
        {
          key: 6,
          amount: 35,
          svg: { fill: "#5caa57" }
        }
      ],
      graphValue: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../assets/fonts/GoogleSans-Medium.ttf")
    });
    let token = await AsyncStorage.getItem("access_token");

    const data = JSON.stringify({
      year: this.state.year,
      month: this.state.month,
      day: this.state.day
    });

    const getGraph = "https://api.delivera.uz/entity/get-graph-data";
    axios({
      method: "post",
      url: getGraph,
      data: data,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: {
        "content-type": "application/json",
        token: token
      }
    })
      .then(async response => {
        // console.log(response.data);
        let graphVal = await response.data;
        await AsyncStorage.multiGet(["username", "full_name", "phone"]).then(
          response => {
            this.setState({
              username: response[0][1],
              full_name: response[1][1],
              phone: response[2][1],
              token: token,
              graphValue: graphVal
            });
          }
        );
        // console.log(response.data.orders);
      })
      .catch(error => {
        console.log(error, "error");
      });
    const getPie = "https://api.delivera.uz/entity/get-pie-data";
    axios({
      method: "post",
      url: getPie,
      data: data,
      auth: {
        username: "delivera",
        password: "X19WkHHupFJBPsMRPCJwTbv09yCD50E2"
      },
      headers: {
        "content-type": "application/json",
        token: token
      }
    })
      .then(response => {
        if (response.data.length === 0) {
          this.setState({
            loading: false,
            graphLoading: false
          });
        } else {
          this.setState({
            loading: false,
            pieValue: response.data,
            graphLoading: false
          });
        }

        // console.log(response.data.orders);
      })
      .catch(error => {
        console.log(error, "error");
      });
  }

  _signOutAsync = async () => {
    this.setState({
      loading: true
    });
    const urlLogout = "https://api.delivera.uz/entity/logout";
    axios({
      method: "post",
      url: urlLogout,
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
        this.setState(
          {
            loading: false
          },
          async () => {
            await AsyncStorage.clear();
            this.props.navigation.navigate("Auth");
          }
        );
        // console.log(response.data.orders);
      })
      .catch(error => {
        console.log(error, "error");
      });
  };

  static navigationOptions = ({ navigation }) => ({
    headerTitle: <MyDashboardTitle />,
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

  handleDate = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.new Date(2020, 4, 25)
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState(
          {
            today: moment(new Date(year, month, day)).format("DD.MM.YY"),
            year,
            month,
            day,
            graphLoading: true
          },
          () => {
            const data = JSON.stringify({
              year: this.state.year,
              month: this.state.month,
              day: this.state.day
            });
            const urlLogout = "https://api.delivera.uz/entity/get-graph-data";
            axios({
              method: "post",
              url: urlLogout,
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
                this.setState({
                  graphValue: response.data
                });
                // console.log(response.data.orders);
              })
              .catch(error => {
                console.log(error, "error");
              });
            const urlogout = "https://api.delivera.uz/entity/get-pie-data";
            axios({
              method: "post",
              url: urlogout,
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
                this.setState({
                  pieValue: response.data,
                  graphLoading: false
                });
                // console.log(response.data.orders);
              })
              .catch(error => {
                console.log(error, "error");
              });
          }
        );
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };
  render() {
    return (
      <React.Fragment>
        {!this.state.loading ? (
          <SafeAreaView
            style={{ flex: 1 }}
            forceInset={{ horizontal: "always", top: "never" }}
          >
            <ScrollView style={{ flex: 1 }}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontFamily: "medium", fontSize: 20 }}>
                  {this.state.full_name}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingTop: 31,
                  paddingBottom: 43
                }}
              >
                <View style={styles.twoCols}>
                  <Phone />
                  <Text style={styles.lilTitle}>номер</Text>
                  <Text style={styles.infoPart}>{this.state.phone}</Text>
                  <Text style={styles.changeButton}>Изменить</Text>
                </View>
                <View
                  style={{
                    flex: 0.1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <RectangleDivider />
                </View>
                <View style={styles.twoCols}>
                  <Lock />
                  <Text style={styles.lilTitle}>пароль</Text>
                  <Text style={styles.infoPart}>* * * * * * *</Text>
                  <Text style={styles.changeButton}>Изменить</Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <HorizontalDivider />
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 9
                }}
              >
                <Text
                  style={{
                    fontFamily: "medium",
                    fontSize: 16,
                    color: "#707070"
                  }}
                >
                  Статистика
                </Text>
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingTop: 21,
                  paddingBottom: 12
                }}
              >
                <View style={styles.twoCols}>
                  <Text style={styles.subTitle}>лучшая доставка</Text>
                  <Text style={styles.subTitleInfo}>12 минут</Text>
                </View>

                <View
                  style={{
                    flex: 0.1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <RectangleDivider />
                </View>

                <View style={styles.twoCols}>
                  <Text style={styles.subTitle}>худшая доставка</Text>
                  <Text style={styles.subTitleInfo}>58 минут</Text>
                </View>
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingTop: 21,
                  paddingBottom: 45
                }}
              >
                <View style={styles.twoCols}>
                  <Text style={styles.subTitle}>% бонусов</Text>
                  <Text style={styles.subTitleInfo}>12 %</Text>
                </View>

                <View
                  style={{
                    flex: 0.1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <RectangleDivider />
                </View>

                <View style={styles.twoCols}>
                  <Text style={styles.subTitle}>средняя сумма заказа</Text>
                  <Text style={styles.subTitleInfo}>18 000 сум</Text>
                </View>
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f6f6f6"
                }}
              >
                <Button
                  type="solid"
                  title="Статистика продаж"
                  loadingProps={{ size: "small", color: "white" }}
                  buttonStyle={styles.buttonStatStyle}
                  titleStyle={{
                    color: "white",
                    fontSize: 20,
                    fontFamily: "medium"
                  }}
                />
                <Text
                  style={{
                    paddingTop: 25,
                    fontFamily: "regular",
                    fontSize: 14,
                    color: "#333333"
                  }}
                  onPress={this.handleDate}
                >
                  {this.state.today}
                  <Entypo name="chevron-small-down" size={20} color="#333333" />
                </Text>
              </View>
              <BarChartMain
                topValues={this.state.graphValue}
                loading={this.state.graphLoading}
              />
              <PieChartMain pieValues={this.state.pieValue} />
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Button
                  type="solid"
                  title="ВЫЙТИ"
                  onPress={this._signOutAsync}
                  loading={this.state.showLoading}
                  loadingProps={{ size: "small", color: "white" }}
                  buttonStyle={styles.buttonMainStyle}
                  titleStyle={{
                    color: "white",
                    fontSize: 20,
                    fontFamily: "medium"
                  }}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../assets/loader.gif")}
            />
          </View>
        )}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  lilTitle: {
    fontFamily: "regular",
    fontSize: 14,
    color: "#acacac",
    paddingVertical: 10
  },
  infoPart: {
    fontFamily: "medium",
    fontSize: 14,
    color: "#333333",
    paddingBottom: 17
  },
  changeButton: {
    fontFamily: "regular",
    fontSize: 12,
    color: "#acacac"
  },
  subTitle: {
    fontFamily: "regular",
    fontSize: 14,
    color: "#acacac"
  },
  subTitleInfo: {
    fontFamily: "medium",
    fontSize: 14,
    color: "#333333"
  },
  twoCols: {
    flex: 0.45,
    justifyContent: "center",
    alignItems: "center"
  },

  buttonStatStyle: {
    zIndex: 9999,
    marginTop: -25,
    height: 50,
    width: 280,
    backgroundColor: "#5caa57",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 28,
    elevation: 0
  },
  buttonMainStyle: {
    height: 45,
    width: 280,
    backgroundColor: "#fb5607",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 28,
    elevation: 0
  }
});
export default Dashboard;
