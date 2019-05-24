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
