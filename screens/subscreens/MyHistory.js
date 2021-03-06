import React from "react";
import { SafeAreaView } from "react-navigation";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment";
import {
  AsyncStorage,
  Text,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Platform,
  RefreshControl,
  FlatList
} from "react-native";
import * as Font from 'expo-font';

import { SearchBar } from "react-native-elements";

import axios from "axios";
import MyHistoryList from "./myHistory/MyHistoryList";

const isAndroid = Platform.OS === "android";

const dummySearchBarProps = {
  showLoading: false,
  onFocus: () => console.log("focus"),
  onBlur: () => console.log("blur"),
  onCancel: () => console.log("cancel"),
  onClearText: () => console.log("cleared")
};

class MyHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myorders: [],
      openUp: "",
      id: "",
      archiveLoadList: [],
      refreshing: false,
      fontLoaded: false,
      searchID: "",
      searchedList: []
    };
  }

  _onRefreshArchive = async () => {
    this.setState({ refreshing: true });

    let token = await AsyncStorage.getItem("access_token");
    const urlOrders = "https://api.delivera.uz/entity/archive";
    axios({
      method: "get",
      url: urlOrders,
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
        this.setState({
          archiveLoadList: response.data.orders,
          refreshing: false
        });
      })
      .catch(error => {
        console.log(error, "error");
      });
  };

  updateWithInterval = () => {};
  async componentDidMount() {
    this.loadToArchive();

    this.intervaller = setInterval(() => {
      this.loadToArchive();
    }, 20000);

    await Font.loadAsync({
      regular: require("../../assets/fonts/GoogleSans-Regular.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }
  componentWillUnmount() {
    clearInterval(this.intervaller);
  }
  loadToArchive = async () => {
    this.setState({ refreshing: true });
    let token = await AsyncStorage.getItem("access_token");
    const urlOrders = "https://api.delivera.uz/entity/archive";
    axios({
      method: "get",
      url: urlOrders,
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
        this.setState({
          archiveLoadList: response.data.orders,
          refreshing: false
        });
      })
      .catch(error => {
        console.log(error, "error");
      });
  };
  handlePress = () => {
    this.props.navigation.navigate("DummyInfoScreen", {});
  };

  isID = words => {
    return words.id === parseInt(this.state.searchID);
  };
  handleSearch = searchID => {
    this.setState({
      searchID
    });
  };
  _keyExtractor = (item, index) => item.id.toString();
  
  _renderItem = ({ item }) => (
    <View style={styles.list}>
    <MyHistoryList
      showAllData={this.loadToArchive}
      key={item.id}
      nav={this.props.navigation}
      allProps={item}
    />
    </View>
  );
  render() {
    let newArr = [];
    let newObj = this.state.archiveLoadList.find(this.isID);

    if (newObj !== undefined) {
      newArr.push(newObj);
    }
    let allLists;
    if (newArr.length === 0 && this.state.searchID > 0) {
      allLists = (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontFamily: "regular" }}>Ничего не найдено</Text>
        </View>
      );
    } else if (newArr.length === 0) {
      allLists = this.state.archiveLoadList.map((l, i) => (
        <MyHistoryList
          showAllData={this.loadToArchive}
          key={l.id}
          nav={this.props.navigation}
          allProps={l}
        />
      ));
    } else {
      allLists = newArr.map((l, i) => (
        <MyHistoryList
          showAllData={this.loadToArchive}
          key={l.id}
          nav={this.props.navigation}
          allProps={l}
        />
      ));
    }
    // let allLists =
    //   newArr.length === 0
    //     ? this.state.archiveLoadList.map((l, i) => (
    //         <MyHistoryList
    //           showAllData={this.loadToArchive}
    //           key={l.id}
    //           nav={this.props.navigation}
    //           allProps={l}
    //         />
    //       ))
    //     : newArr.map((l, i) => (
    //         <MyHistoryList
    //           showAllData={this.loadToArchive}
    //           key={l.id}
    //           nav={this.props.navigation}
    //           allProps={l}
    //         />
    //       ));
    return (
      <SafeAreaView forceInset={{ horizontal: "always", top: "always" }}>
        
        <FlatList
              contentContainerStyle={{paddingBottom:59}}
              data={this.state.archiveLoadList}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              initialScrollIndex={0}
              initialNumToRender={3}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefreshArchive}
                  enabled={true}
                  colors={["#8ac53f"]}
                  progressBackgroundColor="white"
                  size={200}
                  tintColor="yellow"
                  title="loading"
                />
              }
            />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    marginTop: 0,
    borderColor: "#FD6B78",
    backgroundColor: "#fff"
  }
});

export default MyHistory;
