import React from "react";

export default class Radio extends React.Component{
    constructor(props) {
        super();

        this.state = {
            outputValue : []
        }
    }

    handleChange (option) {

        var tempOutValue = Object.assign({}, this.state.outputValue);
        var index = tempOutValue.findIndex((opt)=>{
           return option == option
        });

        if(index == -1){
            tempOutValue.push(option);
        }else{
            tempOutValue.splice(index, 1);
        }
        this.setState({outputValue : tempOutValue})
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
                        return <label key={opt} className="radio-inline">
                            <input onChange={this.handleChange.bind(this, opt)}
                                   checked={this.defaultRadio(opt)}
                                   type="checkbox"
                                   value={opt}
                                   name={this.props.objectName}/>{opt}
                           </label>
                    })}
                </div>
                <span ref="error" className="error"></span>
            </div>
        )
    }
}