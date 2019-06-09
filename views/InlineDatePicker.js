import React, { Component } from 'react'
import { Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DatePickerStyles from '../styles/DatePickerStyles.json';
import Constants from '../constants/Constants.js';

const Months = Constants.Months;
const Quarters = Constants.Quarters;
const Days = Constants.Days;

var InlineDatePicker = class extends Component {
	state = {}
	constructor(props) {
		super(props);

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

		const _month_txt = Months[month],
			  _n_days = Days[_month_txt];

		if ( month === 1 && year % 4 === 0 ) _n_days = 29;

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
	_getHeaderColors = (month, day) => {
		return  {
					color: this.props.headerTextColor,
					backgroundColor: this.props.headerBackgroundColor
				};
	}
	_getTitleStyles = () => {
		return  {					
					fontWeight: "bold",
					fontSize: this.props.titleFontSize,
					color: this.props.headerTextColor,
					backgroundColor: this.props.headerBackgroundColor
				};
	}
	_getBodyColors = (month, day, long) => {
		var _color = {
			color: this.props.currentMonthTextColor,
			backgroundColor: this.props.currentMonthBackgroundColor
		};
		if (this.state.month !== month && long === undefined) {
			_color = {
				color: this.props.adjacentMonthsTextColor,
				backgroundColor: this.props.adjacentMonthsBackgroundColor
			};
		} else if (this.state.date === day || long) {
			_color = {
				color: this.props.selectedDateTextColor,
				backgroundColor: this.props.selectedDateBackgroundColor
			};
		}	
		_color.fontSize = this.props.fontSize;

		return _color;
	}
	_renderIncrement = (props) => {
		return (
				<TouchableOpacity style = {[styles.main, styles.increment]} activeOpacity = {1}
					onPress = {() => {props.callback(props.value)}}>
						<Text>
							<FontAwesome name = {props.name}
								  color = {this.props.incrementIconTextColor} 
								  size = {this.props.incrementIconTextSize}/>
						</Text>
				</TouchableOpacity>
				);
	}
	_renderWeekDays = (props) => {
		const _text_styles = { 
			                   color: this.props.weekDaysTextColor,
							   fontSize: this.props.fontSize,
		                       backgroundColor: this.props.weekDaysBackgroundColor 
		                     };
		return (
			<View style = {[styles.main, styles.row]}>
				{
					this._weekDays.map((day, index) => {
						return (
								<View style = {styles.touchable} key = {index}>
									<Text style = {[styles.text, _text_styles]}>
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
												       <TouchableOpacity key = {j} style = {styles.touchable} 
												       		activeOpacity = {1}
													        onPress = {() => {this._setDate(day.month, day.value)}}>
															<Text style = {[_color, styles.text]}>{day.value}</Text>
													   </TouchableOpacity>
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
												      _color = this._getBodyColors(_m_num, 0, _m_num === this.state.month);												
												return(
												       <TouchableOpacity key = {j} style = {styles.touchable} 
												       		activeOpacity = {1}
													        onPress = {() => {this._setDate(_m_num);
													        	              this.setState({long: false});}}>
															<Text style = {[_color, styles.text, {padding: 10}]}>
																{m.substring(0, 3)}
															</Text>
													   </TouchableOpacity>
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
					<View style = {[this._getHeaderColors(), styles.main, styles.header]}>
						<this._renderIncrement name = "angle-double-left" 
						     callback = {this._setYear} value = {this.state.year - 1}/>
						{ !this.state.long && 
							<this._renderIncrement name = "angle-left" 
							     callback = {this._setDate} value = {this.state.month - 1}/>
						}
						
						<TouchableOpacity style = {[styles.main, styles.selectedMonth]} 
							onPress = {() => {this.setState({long: !this.state.long})}} activeOpacity = {1}> 
							<Text style = {this._getTitleStyles()}>
								{Months[this.state.month]}{" "}{this.state.year}
							</Text>
						</TouchableOpacity>
						     
						{ !this.state.long && 
							<this._renderIncrement name = "angle-right" 
								callback = {this._setDate} value = {this.state.month + 1}/>
						}
						<this._renderIncrement name = "angle-double-right" 
						     callback = {this._setYear} value = {this.state.year + 1}/>
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

const styles = StyleSheet.create(DatePickerStyles);

InlineDatePicker.defaultProps = {		
	"fontSize": 18,	
    "titleFontSize": 20,
	"headerTextColor": "#ccc",
	"headerBackgroundColor": "#222",	
	"incrementIconTextColor": "#ccc",
	"incrementIconTextSize": 22,	
	"weekDaysTextColor": "#ccc",
	"weekDaysBackgroundColor": "#222",
	"currentMonthTextColor": "#ccc",
	"currentMonthBackgroundColor": "#555",
	"adjacentMonthsTextColor": "#aaa",
	"adjacentMonthsBackgroundColor": "#888",
	"selectedDateTextColor": "#ddd",
	"selectedDateBackgroundColor": "#000",
};

module.exports.InlineDatePicker = InlineDatePicker;
