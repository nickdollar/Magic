import React from "react";

export default class NumberInput extends React.Component{
    constructor() {
        super();
        this.state = {
            outputValue : ""
        }
    }

    handleChange (e) {
        this.setState({outputValue : e.target.value})
    }


    clearInput(){
        this.setState({outputValue : ""});
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
        object[this.props.objectName] = parseInt(this.state.outputValue);
        return object
    }

    componentDidMount() {
        this.props.register(this);
    }

    render() {
        return (
            <div className="numberInputComponent">
                <div className="form-group">
                    <label> {this.props.title} </label>
                    <input type={"number"}
                           value={this.state.outputValue}
                           ref={"input"}
                           className='form-control'
                           required={this.props.required}
                           onChange={this.handleChange.bind(this)}
                           min={this.props.min ? false : this.props.min}
                           max={this.props.max ? false : this.props.max}
                    />
                    <span ref="error" className="error"></span>
                </div>
            </div>
        )
    }
}


{/*<NumberInput*/}
    {/*objectName={"name"}*/}
    {/*title="Event Name"*/}
    {/*errorMessage="Name is Missing"*/}
    {/*required={true}*/}
    {/*min={0}*/}
    {/*max={0}*/}
{/*/>*/}