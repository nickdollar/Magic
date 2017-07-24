import React from "react";

export default class PreferredNameInput extends React.Component{
    constructor(props) {
        super();

        this.state = {
            inputValue : props.name ? props.name : ""
        }
    }

    handleChange (e) {
        this.setState({inputValue : e.target.value})
        this.isValid();
    }

    isValid(){
        return true;
    }

    clearInput(){
        this.setState({inputValue : ""});
    }

    getCorrectedValue(){
        var object = {};
        object[this.props.objectName] = this.refs["input"].value;
        return object;
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
    }

    render() {
        return (
            <div className="form-group">
                <label> {this.props.title}: </label>
                <input type={"text"}
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
