import React from "react";

class LGSNameField extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : ""
        }
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];

        if (!this.validateURL(this.state.inputValue)) {
            input.classList.add('error');
            input.nextSibling.textContent = "Need a URL";
            return false;
        }
        else {
            input.classList.remove('error');
            input.nextSibling.textContent = "";
        }
        return true;
    }

    getCorrectedValue(){
        return {URL : this.state.inputValue};
    }

    handleChange(e){
        this.setState({inputValue : e.target.value});
        this.isValid();
    }

    clearInput(){
        this.setState({inputValue : ""});
    }

    validateURL(value){
        return /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i.test( value );
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
    }

    render() {
        return (
            <div className="form-group">
                <label> LGS Website: </label>
                <input type={"text"}
                       value={this.state.inputValue}
                       ref={"input"}
                       className='form-control'
                       onChange={this.handleChange.bind(this)} />
                <span ref="error" className="error"></span>
            </div>
        )
    }
}

export default LGSNameField;