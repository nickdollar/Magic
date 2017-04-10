import React from "react";
import 'react-date-picker/index.css'
import {DateField, TransitionView, Calendar} from "react-date-picker";
import Moment from "moment";
//initialValue
//minimunRequired
//errorMessage
//selected
//objectName

export default class DataHoursInput extends React.Component{
    constructor(props) {
        super();

        this.state = {
            outputValue: props.initialValue ? props.initialValue : new Date()
        }

    }

    handleChange(dateString){
        this.setState({outputValue : Moment(dateString).toDate()})
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];
        if (this.state.outputValue == ""){
            input.classList.add('error');
            error.textContent = this.props.errorMessage ? this.props.errorMessage : "Missing Field";
            return false;
        }else {
            input.classList.remove('error');
            error.textContent  = "";
        }
        return true;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.initialValue != this.state.outputValue ){
            this.state.outputValue = nextProps.initialValue ? nextProps.initialValue : new Date();
        }
    }

    clearInput(){
        this.setState({outputValue : this.props.selected ? this.props.selected : new Date()});
    }

    getCorrectedValue(){
        var object = [];
        object[this.props.objectName] = this.state.outputValue;
        return object
    }

    componentDidMount() {
        this.props.register(this);
    }

    render() {
        let date = new Date();

        return (
            <div className="CheckBoxComponent">
                <div className="form-group">
                    <label> {this.props.title}</label>
                    <div ref="input">
                        <DateField
                            forceValidDate
                            dateFormat="YYYY-MM-DD HH:mm"
                            defaultValue={date}
                            onChange={this.handleChange.bind(this)}
                        >
                        </DateField>
                    </div>
                    <span ref="error" className="error"></span>
                </div>
            </div>
        )
    }
}