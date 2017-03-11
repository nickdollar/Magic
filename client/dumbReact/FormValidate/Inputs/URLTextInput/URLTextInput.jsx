import React from "react";

//errorMessage
//objectName
//title

class LGSNameField extends React.Component{
    constructor() {
        super();
        this.state = {
            outputValue : ""
        }
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];

        if (!this.validateURL(this.state.outputValue)) {
            input.classList.add('error');
            input.nextSibling.textContent = this.props.errorMessage;
            return false;
        }
        else {
            input.classList.remove('error');
            error.textContent  = "";
        }
        return true;
    }

    getCorrectedValue(){
        var object = [];
        object[this.props.objectName] = this.state.outputValue;
        return object
    }

    handleChange(e){
        this.setState({outputValue : e.target.value})
        this.isValid();
    }

    clearInput(){
        var object = [];
        object[this.props.objectName] = this.state.outputValue;
        return object
    }

    validateURL(value){
        return /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i.test( value );
    }

    componentDidMount() {
        this.props.register(this);
    }

    render() {
        return (
            <div className="form-group">
                <label> {this.props.title} </label>
                <input type={"text"}
                       value={this.state.outputValue}
                       ref={"input"}
                       className='form-control'
                       onChange={this.handleChange.bind(this)} />
                <span ref="error" className="error"></span>
            </div>
        )
    }
}

export default LGSNameField;