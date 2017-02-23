import React from "react";

//initialValue
//errorMessage
//objectName
//title
//opts {value : "", text : ""}

export default class Radio extends React.Component{
    constructor(props) {
        super();

        this.state = {
            outputValue : props.initialValue ? props.initialValue : ""
        }
    }

    handleChange (value) {
        this.setState({outputValue : value})
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

    componentWillReceiveProps(nextProps){
        if(nextProps.initialValue != this.state.outputValue ){
            this.state.outputValue = nextProps.initialValue
        }
    }

    clearInput(){
        this.setState({outputValue : this.props.defaultOption});
    }

    getCorrectedValue(){
        var object = [];
        object[this.props.objectName] = this.state.outputValue;
        return object
    }

    componentDidMount() {
        this.props.register(this);
    }

    defaultRadio(opt){
        if(opt == this.state.outputValue){
            return true
        }
        return false;
    }

    render() {
        return (
            <div className="form-group">
                <label> {this.props.title}</label>
                <div ref="input">
                    {this.props.opts.map((opt)=>{
                        return <label key={opt.value}
                                      className="radio-inline">
                            <input onChange={this.handleChange.bind(this, opt.value)}
                                   checked={this.defaultRadio(opt.value)}
                                   type="radio"
                                   value={opt.value}
                                   name={this.props.objectName}/>{opt.text}</label>
                    })}
                </div>
                <span ref="error" className="error"></span>
            </div>
        )
    }
}