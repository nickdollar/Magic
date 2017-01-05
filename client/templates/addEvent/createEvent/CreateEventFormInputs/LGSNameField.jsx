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
        if (input.value === "") {
            input.classList.add('error');
            error.textContent = "Add Name To Store";
            return false;
        }
        else {
            input.classList.remove('error');
            error.textContent  = "";

        }
        return true;
    }

    clearInput(){
        this.setState({inputValue : ""});
    }

    getCorrectedValue(){
        return {LGS_id : this.refs["input"].value};

    }

    handleChange(e){
        this.setState({inputValue : e.target.value});
        this.isValid(e.target.name);
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
    }

    render() {
        return (
            <div className="form-group">
                <label> LGS Name: </label>
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