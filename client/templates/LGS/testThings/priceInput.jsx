import React from "react";
import TrackerReact from 'meteor/ultimatejs:tracker-react';

class priceInput extends TrackerReact(React.Component){
    constructor() {
        super();
    }

    handleChange (e) {
        this.props.onChange(e.target.value);
        var isValidField = this.isValid(e.target.name);
    }

    isValid() {
        if (input.value ==0) {
            input.classList.add('error');
            input.nextSibling.textContent = this.props.messageRequired;
            return false;
        }
        else {
            input.classList.remove('error');
            this.refs["error"].textContent  = "";

        }
        return true;
    }

    getValue(){

    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
    }

    render() {
        console.log("BBBBBBBBBBBBB");
        return (
            <div className="form-group">
                <label htmlFor={this.props.htmlFor}> {this.props.label}: </label>
                <input type={"number"}
                       ref={"input"}
                       className='form-control'
                       required={this.props.required}
                       onChange={this.handleChange.bind(this)} />
                <span ref="error" className="error"></span>
            </div>
        )
    }
}

export default priceInput;