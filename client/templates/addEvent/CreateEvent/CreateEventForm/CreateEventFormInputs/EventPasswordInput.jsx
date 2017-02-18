import React from "react";

class EventEmailInput extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : "",
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
        object[this.props.objectName] = this.refs["input"].value;
        return object;

    }

    handleChange(e){
        this.setState({inputValue : this.refs["input"].value});
        this.setState({inputValueCheck : this.refs["inputValueCheck"].value});

        this.isValid();
    }

    handleChangeCheck(e){
        this.setState({inputValueCheck : e.target.value});
        this.isValid();
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