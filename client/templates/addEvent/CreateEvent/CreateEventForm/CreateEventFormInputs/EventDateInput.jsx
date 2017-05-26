import React from "react";
import {DateField, TransitionView, Calendar} from "react-date-picker";

export default class EventDateInput extends React.Component{
    constructor() {
        super();
        var date = new Date()
        date.setHours(0,0,0,0);
        this.state = {
            inputValue : date
        }
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];

        if (this.state.inputValue === "") {
            input.classList.add('error');
            error.textContent = this.props.errorMessage;
            return false;
        }
        else {
            input.classList.remove('error');
            error.textContent  = "";

        }
        return true;
    }

    handleChange(dateString){
        this.setState({outputValue : Moment(dateString).toDate()})
    }

    clearInput(){
        this.setState({inputValue : ""});
    }

    getCorrectedValue(){
        var object = {};
        object[this.props.objectName] = this.state.inputValue;
        return object;
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
        var date = new Date();
    }

    render() {
        return (
            <div className="CheckBoxComponent">
                <div className="form-group">
                    <label> {this.props.title}</label>
                    <div ref="input">
                        <DateField
                            forceValidDate
                            dateFormat="YYYY-MM-DD"
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




// return (
//     <div className="form-group">
//         <label> {this.props.title} </label>
//         <input type={"text"}
//                ref={"input"}
//                className='form-control'
//                onChange={this.handleChange.bind(this)} />
//         <span ref="error" className="error"></span>
//     </div>
// )