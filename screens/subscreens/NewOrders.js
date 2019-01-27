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
  RefreshControl,
  FlatList
} from "react-native";
import axios from "axios";
import { Text } from "react-native-elements";
import HomeLists from "./newOrders/HomeLists";
import { Font } from "expo";
const isAndroid = Platform.OS === "android";

class NewOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      openUp: "",
      id: "",
      refreshing: false,
      fontLoaded: false
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../../assets/fonts/Montserrat-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }
  handlePress = () => {
    this.props.navigation.navigate("InfoScreen", {});
  };

  _renderItem = ({ item }) => (
    <View style={styles.list}>
      <HomeLists
        handlePress={this.handlePress}
        key={item.id}
        nav={this.props.navigation}
        allProps={item}
        acceptNewOrder={this.props.screenProps.acceptNewOrder}
      />
      <Text />
    </View>
  );

  _keyExtractor = (item, index) => item.id.toString();
  render() {
    return (
      <SafeAreaView forceInset={{ horizontal: "always", top: "always" }}>
        <FlatList
          data={this.props.screenProps.newOrdersList}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          initialScrollIndex={0}
          initialNumToRender={3}
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
    flex: 1,
    marginTop: 0,
    borderColor: "#FD6B78",
    backgroundColor: "red"
  }
});

export default NewOrders;
