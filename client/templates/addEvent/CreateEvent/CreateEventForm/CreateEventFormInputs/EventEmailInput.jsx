import React from "react";

class EventEmailInput extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : ""
        }
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];
        if (input.value === "") {
            return true;
        }else if (!this.validateEmail(input.value)){
            input.classList.add('error');
            error.textContent = this.props.errorMessage;
            return false;
        }else {
            input.classList.remove('error');
            error.textContent  = "";

        }

        return true;
    }

    clearInput(){
        this.setState({inputValue : ""});
    }

    getCorrectedValue(){
        var object = {};
        object[this.props.objectName] = this.refs["input"].value;
        return object;

    }

    validateEmail(value) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    }

    handleChange(e){
        this.setState({inputValue : e.target.value});
        this.isValid(e.target.name);
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
    }

    render() {
        return (
            <div className="form-group">
                <label> {this.props.title} </label>
                <input type={"text"}
                       value={this.state.inputValue}
                       ref={"input"}
                       className='form-control'
                       onChange={this.handleChange.bind(this)} />
                <span ref="error" className="error"></span>
            </div>
        )
    }
}

export default EventEmailInput;