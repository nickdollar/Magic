import React from "react";

class EventEmailInput extends React.Component{
    constructor() {
        super();
        this.state = {
            outputValue : "",
            inputValueCheck : ""
        }
    }

    isValid() {
        var input = this.refs["input"];
        var inputValueCheck = this.refs["inputValueCheck"];
        var error = this.refs["error"];

        if (input.value === "") {
            input.classList.add('error');
            inputValueCheck.classList.add('error');
            error.textContent = "";
            return true;
        }else if (input.value != inputValueCheck.value){
            input.classList.add('error');
            inputValueCheck.classList.add('error');
            error.textContent = "Password Don't Match";
            return false;
        }else {
            input.classList.remove('error');
            inputValueCheck.classList.remove('error');
            error.textContent  = "";
        }
        return true;
    }

    clearInput(){
        this.setState({inputValue : ""});
    }

    getCorrectedValue(){
        var object = {};
        object[this.props.objectName] = this.state.outputValue;
        return object;
    }

    clearInput(){
        this.setState({outputValue : this.props.initialValue ? this.props.initialValue : ""});
    }

    handleChange(e){
        this.setState({outputValue : this.refs["input"].value});
        this.setState({inputValueCheck : this.refs["inputValueCheck"].value});

        this.isValid();
    }

    componentDidMount() {
        this.props.register(this);
    }

    render() {
        return (
            <div className="form-group">
                <label> {this.props.title} </label>
                <input type={"password"}
                       value={this.state.inputValue}
                       ref={"input"}
                       className='form-control'
                       onChange={this.handleChange.bind(this)} />
                <input type={"password"}
                       value={this.state.inputValueCheck}
                       ref={"inputValueCheck"}
                       className='form-control'
                       onChange={this.handleChange.bind(this)} />
                <span ref="error" className="error"></span>
            </div>
        )
    }
}

export default EventEmailInput;