import React from "react";
import moment from "moment";


class EventDateInput extends React.Component{
    constructor() {
        super();
        var date = new Date()
        date.setHours(0,0,0,0);
        this.state = {
            inputValue : date
        }
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];

        if (this.state.inputValue === "") {
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

    clearInput(){
        this.setState({inputValue : ""});
    }

    getCorrectedValue(){
        var object = {};
        object[this.props.objectName] = this.state.inputValue;
        return object;
    }

    handleChange(e){

    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
        var date = new Date();

        date.setHours(0,0,0,0);
        $(this.refs["input"]).datetimepicker({
            format: 'L',
            defaultDate : date
        }).on("dp.change", (e)=>{
            console.log("GGGGGGGGGGGG");
            console.log(e);
            this.setState({inputValue : new Date(e.timeStamp)});
            this.isValid();
        });

    }

    render() {
        return (
            <div className="form-group">
                <label> {this.props.title} </label>
                <input type={"text"}
                       ref={"input"}
                       className='form-control'
                       onChange={this.handleChange.bind(this)} />
                <span ref="error" className="error"></span>
            </div>
        )
    }
}

export default EventDateInput;