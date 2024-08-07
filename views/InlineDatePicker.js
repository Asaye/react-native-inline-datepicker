import React, { Component } from 'react'
import { Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import Constants from '../constants/Constants';
import Colors from '../styles/Colors';

const Months = Constants.Months;
const Quarters = Constants.Quarters;
const Days = Constants.Days;

const Colors_whitish = Colors.Colors_whitish;
const Colors_bluish = Colors.Colors_bluish;
const Colors_greenish = Colors.Colors_greenish;
const Colors_reddish = Colors.Colors_reddish;

var InlineDatePicker = class extends Component {
	state = {}
	constructor(props) {
		super(props);
		if (this.props.skinColor === "red") {
			this._colors = Colors_reddish;
		} else if (this.props.skinColor === "white") {
			this._colors = Colors_whitish;
		} else if (this.props.skinColor === "green") {
			this._colors = Colors_greenish;
		} else if (this.props.skinColor === "blue") {
			this._colors = Colors_bluish;
		} else {
			this._colors = {	
				"datepicker_header": this.props.headerBackgroundColor,
				"datepicker_txt": this.props.textColor,
				"datepicker_txt_active": this.props.activeTextColor,	
				"datepicker_txt_adj": this.props.adjacentTextColor,
				"datepicker_current": this.props.currentMonthBackgroundColor,	
				"datepicker_adj": this.props.adjacentMonthsBackgroundColor,
				"datepicker_active": this.props.selectedDateBackgroundColor,
			};
		}
		if (this.props.startDate !== undefined && 
			Array.isArray(this.props.startDate) && 
			this.props.startDate.length > 2) {
			this.state.year = this.props.startDate[0];
			this.state.month = this.props.startDate[1];
			this.state.date = this.props.startDate[2];
		} else {
			const date = new Date();
			this.state.year = date.getFullYear();
			this.state.month = date.getMonth();
			this.state.date = date.getDate();
		}
		this.state.long = false;
		this._dates = [];
		this._weekDays = ["S", "M", "T", "W", "T", "F", "S"];
	}
	_setYear = (y) => { 
		const m = this.state.month,
			  d = this.state.date;
	    this.setState({ year: y });
	    this.props.onChangeDate(y, m, d);
	}	
	_setDate = (month, date) => {
		var m = month, y = this.state.year, 
		    d = date ? date : this.state.date;
	    if (month < 0) {
       		m = 11;
       		--y;
	    } else if (month > 11) {
	        m = 0;
       		++y;
	    }
	    this.setState({year: y, month: m, date: d});
		this.props.onChangeDate(y, m, d);
	}
	_getNDays = (year, month) => {
		if (month < 0) month = 11;
		else if (month > 11) m = 0;

		var _month_txt = Months[month],
			_n_days = Days[_month_txt];

		if (month === 1 && (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0))) _n_days = 29;

		return _n_days;
	}
	_fillDates = () => {
		var nWeeks = 5, counter = 1;
		const _month_num = this.state.month, 
			  _year = this.state.year,  
			  _date = new Date(_year, _month_num, 1), 
			  _day = _date.getDay(),
			  _n_days = this._getNDays(_year, _month_num);
		
		this._dates = [];

		if ( _month_num === 1 && _n_days === 28 && _day === 0) nWeeks = 4
		else if ( _n_days === 30 && _day === 6 || 
			      _n_days === 31 && _day >= 5 ) nWeeks = 6

		for (var i = 0; i < nWeeks; i++) {

			this._dates.push([]);

			if ( i === 0 ) {
				var n = this._getNDays(_year, _month_num - 1);
				for (var j = (n - _day); j < n; j++) {
					this._dates[0].push({value: j + 1, month: (_month_num - 1)});
				}
				for (var j = _day; j < 7; j++) {
					this._dates[0].push({value: counter++, month: _month_num});
				}
			} else if ( i === (nWeeks - 1) ) {
				var d = new Date(_year, _month_num + 1, 1), 
			  		_d_next = d.getDay(), init = _d_next === 0 ? 7 : _d_next;					
				for (var j = 0; j < init; j++) {
					this._dates[i].push({value: counter++, month: _month_num});
				}
				for (var j = init; j < 7; j++) {
					this._dates[i].push({value: j - init + 1, month: _month_num + 1});
				}
			} else {
				for (var j = 0; j < 7; j++) {
					this._dates[i].push({value: counter++, month: _month_num});
				}
			}
		}
	}	
	_getBodyColors = (month, day, long) => {		   
		if (this.state.month !== month && long === undefined) {
			return {  		
				"fontSize": this.props.fontSize,	
				"color": this._colors.datepicker_txt_adj,
				"backgroundColor": this._colors.datepicker_adj
			};
		} else if (this.state.date === day || long) {
			return {  		
				"fontSize": this.props.fontSize,	
				"color": this._colors.datepicker_txt_active,
				"backgroundColor": this._colors.datepicker_active
		    };
		}
		return {  		
			"fontSize": this.props.fontSize,	
			"color": this._colors.datepicker_txt,
			"backgroundColor": this._colors.datepicker_current
		}
	}	
	_getWeekDaysStyle = () => { 
		return {
		    "color": this._colors.datepicker_txt,
		    "fontSize": this.props.fontSize,
		    "backgroundColor": this._colors.datepicker_header
		};
	}
	_getHeaderStyle = () => { 
		return {
		    "height": "auto",
		    "width": "auto",
		    "marginLeft": 2,
		    "color": this._colors.datepicker_txt,
			"backgroundColor": this._colors.datepicker_header
		};
	}
	_getTitleStyle = () => { 
		return {
		  	"fontWeight": "bold",
			"fontSize": this.props.titleFontSize,
			"color": this._colors.datepicker_txt,
			"backgroundColor": this._colors.datepicker_header
		};
	}	
	_renderWeekDays = (props) => {		
		return (
			<View style = {[styles.main, styles.row]}>
				{
					this._weekDays.map((day, index) => {
						return (
							<View style = {styles.touchable} key = {index}>
								<Text style = {[styles.text, this._getWeekDaysStyle()]}>
									{day}
						   		</Text>
						   	</View>
						);
				 	})
			    }
		    </View>
		);
	}
	_renderDates = (props) => {
		return (
			<View style = {styles.bodyContainer}>
				{
				    this._dates.map((week, index) => {
					    return (
				    		<View style = {[styles.main, styles.row]} key = {index}>
								{
									week.map((day, j) => {
										const _color = this._getBodyColors(day.month, day.value);												
										return(
									       <View key = {j} style = {styles.touchable} 
										        onTouchStart = {() => {this._setDate(day.month, day.value)}}>
												<Text style = {[_color, styles.text]}>{day.value}</Text>
										   </View>
										);
								 	})
							    }
						    </View>
						)
					})
				}
			</View>
		);
	}
	_renderMonths = (props) => {

		return (
			<View style = {styles.bodyContainer}>
				{
				    Quarters.map((quarter, index) => {
					    return (
				    		<View style = {[styles.main, styles.row]} key = {index}>
								{
									quarter.map((m, j) => {												
										const _m_num = Months.indexOf(m),
										      _isCurrent = _m_num === this.state.month,
										      _color = this._getBodyColors(_m_num, 0, _isCurrent);												
										return(
									       <View key = {j} style = {styles.touchable} 
										        onTouchStart = {() => {this._setDate(_m_num);
										        	            this.setState({long: false});}}>
												<Text style = {[_color, styles.text, 
													            {padding: 12, fontSize: this.props.titleFontSize}]}>
													{m.substring(0, 3)}
												</Text>
										   </View>
										);
								 	})
							    }
						    </View>
						)
					})
				}
			</View>
		);
	}
	render() {

		this._fillDates();

		return( 
		    <View style = {styles.headerContainer}>
				<View style = {[styles.main, this._getHeaderStyle()]}>
					  <View style = {[styles.main, styles.increment]}
							onTouchStart = {() => {this._setYear(this.state.year - 1)}}>
							<Text style = {{ fontSize: this.props.iconSize, 
								             color: this._colors.datepicker_txt}}>
								  {`<<`}
							</Text>
			    	  </View>
					{ !this.state.long && 
						<View style = {[styles.main, styles.increment]}
							onTouchStart = {() => {this._setDate(this.state.month - 1)}}>
							<Text style = {{ fontSize: this.props.iconSize, 
								             color: this._colors.datepicker_txt}}>
								  {`<`}
							</Text>
			    	  </View>
					}
					
					<View style = {[styles.main, styles.selectedMonth]} 
						onTouchStart = {() => {this.setState({long: !this.state.long})}}> 
						<Text style = {this._getTitleStyle()}>
							{Months[this.state.month]}{" "}{this.state.year}
						</Text>
					</View>
					     
					{ !this.state.long && 
						<View style = {[styles.main, styles.increment]}
							onTouchStart = {() => {this._setDate(this.state.month + 1)}}>
							<Text style = {{ fontSize: this.props.iconSize, 
								             color: this._colors.datepicker_txt}}>
								  {`>`}
							</Text>
			    	  </View>
					}
					<View style = {[styles.main, styles.increment]}
						  onTouchStart = {() => {this._setYear(this.state.year + 1)}}>
						  <Text style = {{ fontSize: this.props.iconSize, 
						                   color: this._colors.datepicker_txt}}>
								{`>>`}
						  </Text>
			    	</View>
				</View>
				{ !this.state.long &&
					<View>
						<this._renderWeekDays/>
						<this._renderDates/>
					</View>
				}
				{ this.state.long && 
					<View style = {styles.bodyContainer}>
						<this._renderMonths/>
					</View>
				}
		    </View>
		);
	}		  
}

module.exports = InlineDatePicker;

const styles = StyleSheet.create({
  "main": {
    "width": "100%",
    "height": "100%",
    "margin": 0,
    "padding": 0,
    "flexDirection": "row",
    "alignContent": "stretch",
    "alignItems": "center",  
    "textAlign": "center",  
    "justifyContent": "space-between", 
  },  
  "row": { 
    "height": "auto",
    "width": "auto",
    "marginTop": 1,
    "marginLeft": 1,
  },  
  "text": {
    "padding": 5,
    "width": "auto",
    "marginRight": 0,
    "marginBottom": 0,
    "textAlign": "center",
  },
  "touchable": {
    "flex": 1,
    "marginLeft": 1,
    "width": "100%",
    "height": "100%",
    "textAlign": "center",
  },
  "headerContainer": {
    "flexDirection": "column",
    "margin": 5, 
    "marginTop": 5,
  },  
  "bodyContainer": {
    "flexDirection": "column",
    "justifyContent":"space-between"
  },  
  "increment": {
    "flex": 1, 
    "padding": 7,
    "justifyContent": "space-around", 
  },
  "selectedMonth": {
    "flex": 4,
    "padding": 7,
    "width": "auto",
    "justifyContent": "space-around", 
  },  
});

InlineDatePicker.defaultProps = {		
	"fontSize": 18,	
    "titleFontSize": 20,
	"textColor": "#ddd",
	"activeTextColor": "#ddd",
	"adjacentTextColor": "#ccc",
	"headerBackgroundColor": "#222",
	"iconSize": 22,	
	"currentMonthBackgroundColor": "#555",
	"adjacentMonthsBackgroundColor": "#888",
	"selectedDateBackgroundColor": "#000",
};