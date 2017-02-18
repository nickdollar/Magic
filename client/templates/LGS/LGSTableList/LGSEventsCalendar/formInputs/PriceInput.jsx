import React from "react";

class PriceInput extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : 0
        }
    }

    handleChange (e) {
        if(e.target.value >= 0){
            this.setState({inputValue : e.target.value})
        }else{
            this.setState({inputValue : 0})
        }
        // this.setState({inputValue : 0})
        this.isValid();
    }

    clearInput(){
        this.setState({inputValue : 0});
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];
        if (input.value === "") {
            input.classList.add('error');
            error.textContent = "Number bigger or equal to 0, 0 for free";
            return false;
        }
        else {
            input.classList.remove('error');
            error.textContent  = "";

        }
        return true;
    }

    getCorrectedValue(){
        return {price : parseInt(this.refs["input"].value)};
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
    }

    render() {
        return (
            <div className="form-group">
                <label> Price: </label>
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

export default PriceInput;