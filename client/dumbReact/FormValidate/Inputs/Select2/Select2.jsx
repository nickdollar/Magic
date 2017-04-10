import React from "react";


export default class LGSInput extends React.Component{
    constructor() {
        super();
        this.state = {clearInput : false};
    }

    clearInput(){
        this.state.clearInput = true;
        $(this.refs["input"]).select2("val", "all");
        this.state.inputValue = "";
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];

     if (input.value === "") {
            input.classList.add('error');
            error.textContent = this.props.errorMessage;
            return false;
        }else {
            input.classList.remove('error');
            error.textContent  = "";
        }
        return true;
    }

    getCorrectedValue(){
        var object = {};
        object[this.props.objectName] = this.refs["input"].value;
        return object;
    }

    componentDidUpdate(){
        $(this.refs["input"]).val(this.props.initialValue).trigger("change");

    }

    componentDidMount() {
        this.props.register(this);
        $(this.refs["input"]).select2({
            placeholder: 'Select an option'
        }).on("change", (e)=>{
            if(!this.state.clearInput){
                this.state.outputValue = $(e.currentTarget).val();
                this.isValid();
            }
            this.state.clearInput = false
        });
    }

    shouldComponentUpdate(nextProps, nextStates){
        if(nextProps.listLoading){
            return false;
        }
        return true;
    }

    render() {
        return (
            <div className="form-group">
                <label> {this.props.title} </label>
                <div>
                    <select ref="input" style={{width: 100 +"%"}} className="select2-container form-control">
                        <option></option>
                        {this.props.options.map((option)=>{
                            return <option key={option[this.props.fieldUnique]} value={option[this.props.fieldUnique]} >{option[this.props.fieldText]}</option>
                        })}
                    </select>
                </div>
                <span ref="error" className="error"></span>
            </div>
        )
    }
}