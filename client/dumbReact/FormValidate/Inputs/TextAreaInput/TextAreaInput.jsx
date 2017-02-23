import React from "react";

//objectName
//title
//Default Value
class DescriptionInput extends React.Component{
    constructor() {
        super();
        this.state = {
            outputValue : ""
        }
    }

    handleChange (e) {
        this.setState({outputValue : e.target.value})
    }

    isValid() {
        return true;
    }

    clearInput(){
        this.setState({outputValue : ""});
    }

    getCorrectedValue(){
        var object = [];
        object[this.props.objectName] = this.state.outputValue;
        return object
    }

    componentDidMount() {
        this.props.register(this);
    }

    render() {
        return (
            <div className="form-group">
                <label> {this.props.title} </label>
                <textarea
                    value={this.state.outputValue}
                    ref={"input"}
                    className='form-control'
                    onChange={this.handleChange.bind(this)} />
                <span ref="error" className="error"></span>
            </div>
        )
    }
}

export default DescriptionInput;