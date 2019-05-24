# react-native-inline-datepicker
This is a datepicker component for react-native apps which will be rendered inline with other components. 
Note that this component is applicable for android apps only.

# Getting Started

## Installation
$ npm install react-native-inline-datepicker --save

# Usage

## Import

```import InlineDatePicker from 'react-native-inline-datepicker';```

# Example

```
import InlineDatePicker from 'react-native-inline-datepicker';
import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class DatePickerDemo extends Component {
  state = {
    year: 2019,
    month: 4,
    date: 24
  };
  setDate = (y, m, d) => {
    this.setState({year: y, month: m, date: d});
  }
  render() {
    return (
            <View>
              <InlineDatePicker onChangeDate = {this.setDate}/>
              <Text>The selected date is:</Text>
              <Text>{this.state.year}{-}{this.state.month}{-}{this.state.date}</Text>    
            </View>
    );
  }
}
```

# Props 

Prop | Default | Type | Description
------------ | ------------- | ------------- | -------------
onChangeDate | setDate | func | Callback function when the user selects a date.
startDate | undefined | Array | An array containing three numbers to set the current date of the datepicker. The first element is the year, the second element is the month number ( 0 = January ... 11 = December). If this prop is not defined, the current date on the datepicker will be set to the current date on the user's device.
