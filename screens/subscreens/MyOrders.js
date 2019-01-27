import React from "react";
import { SafeAreaView } from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import {
  AsyncStorage,
  Text,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Platform,
  RefreshControl
} from "react-native";

import axios from "axios";
import MyOrdersList from "./myOrders/MyOrdersList";

const isAndroid = Platform.OS === "android";

class MyOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myorders: [],
      openUp: "",
      id: "",
      refreshing: false
    };
  }

  handlePress = () => {
    this.props.navigation.navigate("MyInfoScreen", {});
  };
  render() {
    let homeMainRender =
      this.props.screenProps.myOrdersList.length > 0 ? (
        this.props.screenProps.myOrdersList.map((l, i) => (
          <MyOrdersList
            getFromRest={this.props.screenProps.getFromRest}
            handlePress={this.handlePress}
            key={l.id}
            nav={this.props.navigation}
            allProps={l}
          />
        ))
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ flex: 1 }}>На данный момент нет заказов.</Text>
        </View>
      );
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        forceInset={{ horizontal: "always", top: "always" }}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.props.screenProps.refreshState}
              onRefresh={this.props.screenProps.refreshMyOrders}
              enabled={true}
              colors={["#8ac53f"]}
              progressBackgroundColor="white"
              size={200}
              tintColor="yellow"
              title="loading"
            />
          }
        >
          <View style={styles.list}>{homeMainRender}</View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1,
    marginTop: 0,
    borderColor: "#FD6B78",
    backgroundColor: "#fff"
  }
});

export default MyOrders;
