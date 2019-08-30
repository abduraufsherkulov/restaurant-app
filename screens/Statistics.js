import React from "react";
import {
  BarChart,
  Grid,
  PieChart,
  XAxis,
  YAxis
} from "react-native-svg-charts";
import { Circle, G, Line, Text } from 'react-native-svg'
import * as Font from 'expo-font';

import {Text as MainText, View, ScrollView, Image } from "react-native";
import * as scale from "d3-scale";

export class BarChartMain extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      regular: require("../assets/fonts/GoogleSans-Regular.ttf"),
      medium: require("../assets/fonts/GoogleSans-Medium.ttf")
    });
    this.setState({
      loading: false
    });
  }
  render() {
    const hours = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24
    ];
    const contentInset = { top: 20, bottom: 20 };
    const CUT_OFF = 20;
    const Labels = ({ x, y, bandwidth, data }) =>
      this.props.topValues.map((value, index) => (
        <Text
          fontFamily={"regular"}
          key={index}
          x={x(index) + bandwidth / 2}
          y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
          fontSize={14}
          fill={value >= CUT_OFF ? "white" : "black"}
          alignmentBaseline={"middle"}
          textAnchor={"middle"}
        >
          {value>0 && (value/1000).toString()+"K"}
        </Text>
      ));
    const xMainAxis = [
      {
        title: "Время"
      }
    ];
    return (
      <React.Fragment>
        {!this.props.loading ? (
          <View style={{ flex: 1 }}>
            <ScrollView
              horizontal={true}
              style={{ backgroundColor: "#f6f6f6" }}
            >
              <View
                style={{ width: 1000, flexDirection: "column", paddingTop: 40 }}
              >
                <View style={{ height: 400, flexDirection: "row" }}>
                  {/* <YAxis
              data={data}
              contentInset={contentInset}
              svg={{
                fill: "grey",
                fontSize: 10
              }}
              numberOfTicks={10}
              formatLabel={value => `${value}`}
            /> */}

                  <BarChart
                    style={{ flex: 1 }}
                    data={this.props.topValues}
                    gridMin={1}
                    svg={{ fill: "#5caa57" }}
                  >
                    {/* <Grid/> */}
                    <Labels />
                  </BarChart>
                </View>

                <XAxis
                  style={{ marginTop: 10 }}
                  data={hours}
                  scale={scale.scaleBand}
                  formatLabel={(value, index) => (index+1)*3}
                  labelStyle={{ color: "red", fontFamily: "regular" }}
                />
              </View>
            </ScrollView>
            <XAxis
              style={{ marginTop: 10 }}
              data={xMainAxis}
              xAccessor={({ item }) => item}
              scale={scale.scaleBand}
              formatLabel={(value, index) => xMainAxis[index].title}
              labelStyle={{ color: "red", fontFamily: "regular" }}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              height: 468.7,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f6f6f6"
            }}
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

export class PieChartMain extends React.PureComponent {
  render() {
    console.log(this.props.pieValues);
    const desc = this.props.pieValues.map((x, y)=>(
      <View style={{height: 50, width: "100%"}} key={x.key}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 30, height: 30, backgroundColor: x.svg.fill}}></View>
            <MainText style={{fontFamily: 'regular', fontSize: 14}}>{"  "}{x.title}</MainText>
            <MainText style={{fontFamily: 'regular', fontSize: 14}}> - {x.totalValue} сум</MainText>
          </View>
      </View>
    ))
    const Labels = ({ slices }) => {
      return slices.map((slice, index) => {
          const { labelCentroid, pieCentroid, data } = slice;
          return (
              <G key={ index }>
                  <Line
                      x1={ labelCentroid[ 0 ] }
                      y1={ labelCentroid[ 1 ] }
                      x2={ pieCentroid[ 0 ] }
                      y2={ pieCentroid[ 1 ] }
                      stroke={ data.svg.fill }
                  />
                  <Circle
                      cx={ labelCentroid[ 0 ] }
                      cy={ labelCentroid[ 1 ] }
                      r={ 30 }
                      fill={ data.svg.fill }
                  />
                  <Text
                      x={labelCentroid[ 0 ]}
                      y={labelCentroid[ 1 ]}
                      fill={'black'}
                      textAnchor={'middle'}
                      alignmentBaseline={'middle'}
                      fontSize={14}
                      stroke={'black'}
                      strokeWidth={0.2}
                  >
                      {data.value !== undefined ? data.value.toString() + "%": data.value}
                  </Text>
              </G>
          )
      })
  }

    return (
      <View
        style={{
          paddingTop: 20,
          marginTop: 50,
          height: 650,
          backgroundColor: "#f6f6f6"
        }}
      >
          <PieChart
                style={ { height: 300 } }
                valueAccessor={({ item }) => item.value}
                data={ this.props.pieValues }
                innerRadius={ 40 }
                outerRadius={ 70 }
                labelRadius={ 120 }
            >
          <Labels />
        </PieChart>
        <View style={{paddingHorizontal: 50, paddingBottom: 40}}>
          {desc}
        </View>
      </View>
    );
  }
}
