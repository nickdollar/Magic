import React from "react";

class PlayerNameInput extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : ""
        }
    }

    handleChange (e) {
        this.setState({inputValue : e.target.value})
        this.isValid();
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

    clearInput(){
        this.setState({inputValue : ""});
    }

    getCorrectedValue(){
        var object = {};
        object[this.props.objectName] = this.refs["input"].value;
        return object;
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
    }

    render() {
        return (
            <div className="form-group">
                <label> {this.props.title}: </label>
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

export default PlayerNameInput;