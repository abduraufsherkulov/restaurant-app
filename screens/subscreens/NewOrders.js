import React from "react";
import { SafeAreaView } from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import {
  AsyncStorage,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Platform,
  RefreshControl
} from "react-native";
import axios from "axios";
import { Text } from "react-native-elements";
import HomeLists from "./newOrders/HomeLists";

const isAndroid = Platform.OS === "android";

class NewOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      openUp: "",
      id: "",
      refreshing: false
    };
  }

  handlePress = () => {
    this.props.navigation.navigate("InfoScreen", {});
  };

  render() {
    let homeMainRender =
      this.props.screenProps.newOrdersList.length > 0 ? (
        this.props.screenProps.newOrdersList.map((l, i) => (
          <HomeLists
            handlePress={this.handlePress}
            key={l.id}
            nav={this.props.navigation}
            allProps={l}
            acceptNewOrder={this.props.screenProps.acceptNewOrder}
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
              onRefresh={this.props.screenProps.refreshNewOrders}
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

export default NewOrders;
