import React from "react";

class RoundsInput extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : 1
        }
    }

    handleChange (e) {
        if(e.target.value >= 1){
            this.setState({inputValue : e.target.value})
        }
        this.isValid(e.target.name);
    }

    clearInput(){
        this.setState({inputValue : 1});
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];
        if (input.value === "") {
            input.classList.add('error');
            error.textContent = "Number is needed, 0 for free";
            return false;
        }
        else {
            input.classList.remove('error');
            error.textContent  = "";

        }
        return true;
    }

    getCorrectedValue(){
        return {rounds : parseInt(this.refs["input"].value)};
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
    }

    render() {
        return (
            <div className="form-group">
                <label> Number of Rounds: </label>
                <input type={"number"}
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

export default RoundsInput;