import React from "react";

var formats = ["standard", "modern", "legacy", "vintage"];

class formatInput extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : []
        }
    }

    handleChange (e) {
        var formatsArray = [];
        this.state.inputValue = $(this.refs["input"]).find(":checked").each(function(){
            formatsArray.push(this.value)
        });
        this.state.inputValue = formatsArray;
        this.isValid(e.target.name);
    }

    clearInput(){
        $(this.refs["input"]).find(":checked").removeAttr('checked');
        this.setState({inputValue : []});
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];
        if (this.state.inputValue.length == 0) {
            input.classList.add('error'); //add class error
            error.textContent = this.props.errorMessage;
            return false;
        }
        else {
            input.classList.remove('error');
            this.refs["error"].textContent  = "";
        }
        return true;
    }

    getCorrectedValue(){
        var object = {};
        object[this.props.objectName] = $(this.refs["input"]).find(":checked")[0].value;
        return object;
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
    }

    render() {
        var formatCheckboxes = formats.map((format)=>{
            return <label className="radio-inline" key={format} >
                    <input type="radio" name="days" value={format}/>{format}
                </label>
        });

        return (
            <div className="form-group">
                <label> {this.props.title} </label>
                <div className="form-control" onChange={this.handleChange.bind(this)} ref={"input"} required={this.props.isRequired}>
                    {formatCheckboxes.map((daysObj)=>{
                        return daysObj
                    })}
                </div>
                <span ref="error" className="error"></span>
            </div>
        )
    }
}

export default formatInput;