import React from "react";


class StartInput extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : "12:00"
        }
    }

    handleChange (e) {
        this.state = {
            inputValue : e.value.target
        }
         this.isValid();

    }

    clearInput(){
        this.setState({inputValue : "12:00"});

    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];
        if (input.value === "") {
            input.classList.add('error');
            error.textContent = "Choose a Hour";
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
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
    }

    render() {
        return (
            <div className="form-group">
                <label> Day of Week: </label>
                <input type={"time"}
                       value={this.state.inputValue}
                       ref={"input"}
                       className='form-control'
                       required={this.props.required}
                       onChange={this.handleChange.bind(this)} />
                <span ref="error" className="error"></span>
            </div>
        )
    }
}

export default StartInput;