import React from "react";

//initialValue
//errorMessage
//title
//required
//objectName

export default class textFormInput extends React.Component{
    constructor(props) {
        super();
        this.state = {outputValue : props.initialValue ? props.initialValue : ""};
    }

    handleChange (e) {
        this.setState({outputValue : e.target.value})
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

    getCorrectedValue(){
        var object = [];
        object[this.props.objectName] = this.state.outputValue;
        return object
    }

    clearInput(){
        this.setState({outputValue : this.props.initialValue ? this.props.initialValue : ""});
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.initialValue != this.state.outputValue ){
            this.state.outputValue = nextProps.initialValue ? nextProps.initialValue : ""
        }
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
                       required={this.props.required}
                       onChange={this.handleChange.bind(this)}
                />
                <span ref="error" className="error"></span>
            </div>
        )
    }
}


