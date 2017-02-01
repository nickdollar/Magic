import React from "react";


export default class HoursInput extends React.Component{
    constructor() {
        super();
        this.state = {
            outputValue : "12:00"
        }
    }

    handleChange (e) {
        this.setState({outputValue : e.target.value})
    }

    clearInput(){
        this.setState({outputValue : "12:00"});
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];
        if (this.state.outputValue === "") {
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

    timeRegexTester(hours){
        var inputFieldHoursRegex = /([01]?[0-9]|2[0-3]):[0-5][0-9]/;
        return /([01]?[0-9]|2[0-3]):[0-5][0-9]/.test(hours)
    }

    getCorrectedValue(){
        return {start : this.refs["input"].value};
    }

    componentDidMount() {
        this.props.register(this);
    }

    render() {
        return (
            <div className="form-group">
                <label> {this.props.title} </label>
                <input type={"time"}
                       value={this.state.outputValue}
                       ref={"input"}
                       className='form-control'
                       onChange={this.handleChange.bind(this)} />
                <span ref="error" className="error"></span>
            </div>
        )
    }
}