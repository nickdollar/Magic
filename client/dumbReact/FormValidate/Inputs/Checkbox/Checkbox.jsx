import React from "react";
//initialValue
//minimunRequired
//errorMessage
//selected
//objectName

export default class Radio extends React.Component{
    constructor(props) {
        super();

        this.state = {
            outputValue: props.initialValue ? props.initialValue : []
        }

    }

    handleChange(option){
        var tempOutValue = this.state.outputValue.concat();
        var index = tempOutValue.findIndex((opt)=>{
           return option == opt
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
        if (this.state.outputValue.length < this.props.minimunRequired ? this.props.minimunRequired : 0) {
            input.classList.add('error');
            error.textContent = this.props.errorMessage ? this.props.errorMessage : "Missing Field";
            return false;
        }else {
            input.classList.remove('error');
            error.textContent  = "";
        }
        return true;
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps.initialValue,  this.state.outputValue)
        if(nextProps.initialValue != this.state.outputValue ){
            this.state.outputValue = nextProps.initialValue ? nextProps.initialValue : [];
        }
    }

    clearInput(){
        this.setState({outputValue : this.props.selected ? this.props.selected : []});
    }

    getCorrectedValue(){
        var object = [];
        object[this.props.objectName] = this.state.outputValue.sort();
        return object
    }

    componentDidMount() {
        this.props.register(this);
    }

    defaultRadio(opt){

        var index = this.state.outputValue.findIndex((value)=>{
            return opt == value
        })

        if(index == -1){
            return false;
        }

        return true;
    }

    render() {
        return (
            <div className="CheckBoxComponent">
                <div className="form-group">
                    <label> {this.props.title}</label>
                    <div ref="input">
                        {this.props.opts.map((opt)=>{
                            return <label key={opt.value} className="radio-inline">
                                <input onChange={this.handleChange.bind(this, opt.value)}
                                       checked={this.defaultRadio(opt.value)}
                                       type="checkbox"
                                       value={opt.value}
                                       name={this.props.objectName}/>{opt.text}
                               </label>
                        })}
                    </div>
                    <span ref="error" className="error"></span>
                </div>
            </div>
        )
    }
}