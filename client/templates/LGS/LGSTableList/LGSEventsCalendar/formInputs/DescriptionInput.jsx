import React from "react";

class DescriptionInput extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : ""
        }
    }

    handleChange (e) {
        this.setState({inputValue : e.target.value})
    }

    isValid() {
        return true;
    }

    clearInput(){
        this.setState({inputValue : ""});
    }

    getCorrectedValue(){
        return {description : this.state.inputValue};
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
    }

    render() {
        return (
            <div className="form-group">
                <label> Extra Information: </label>
                <textarea
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

export default DescriptionInput;