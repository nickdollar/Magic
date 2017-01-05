import React from "react";

var weekDays = {0 : "Sun", 1 : "Mon", 2 : "Tues", 3 : "Wed", 4 : "Thurs", 5 : "Fri", 6 : "Sat" };

class dayInput extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : 0
        }
    }

    handleChange (e) {
        this.isValid(e.target.name);
    }

    clearInput(){
        $(this.refs["input"]).find(":checked").removeAttr('checked');
        this.setState({inputValue : 0});
    }
    
    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];
        if ($(input).find(":checked").length == 0) {

            input.classList.add('error'); //add class error
            error.textContent = "Choose a Day";
            // show error message
            return false;
        }
        else {
            input.classList.remove('error');
            this.refs["error"].textContent  = "";

        }
        return true;
    }

    getCorrectedValue(){
        return {dow : $(this.refs["input"]).find(":checked")[0].value};
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }
    }

    render() {
        var days = [];
        for(var day in weekDays){
            days.push(
                <label className="radio-inline" key={weekDays[day]} >
                    <input type="radio" name="days" value={day}/>{weekDays[day]}
                </label>
            )
        }

        return (
            <div className="form-group">
                <label> Day: </label>
                <div onChange={this.handleChange.bind(this)} ref={"input"} required={this.props.isRequired}>
                    {days.map((daysObj)=>{
                        return daysObj
                    })}
                </div>
                <span ref="error" className="error"></span>
            </div>
        )
    }
}

export default dayInput;