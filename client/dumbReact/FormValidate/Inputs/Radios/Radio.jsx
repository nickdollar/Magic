import React from "react";

export default class textFormInput extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : ""
        }
    }

    handleChange (e) {
        this.setState({inputValue : e.target.value})
    }

    isValid() {

        var input = this.refs["input"];
        var error = this.refs["error"];
        if (this.state.inputValue === "") {
            input.classList.add('error');
            error.textContent = "Name is Required";
            return false;
        }
        else {
            input.classList.remove('error');
            error.textContent  = "";

        }
        return true;
    }

    clearInput(){

        this.setState({inputValue : ""});
    }

    getCorrectedValue(){
        var object = [];
        object[this.props.objectName] = this.state.inputValue;
        return object
    }

    componentDidMount() {
        this.props.register(this);
    }

    render() {
        return (
            <div className="form-group">
                <label> Event Name: </label>
                <input type={"text"}
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