import React from "react";


export default class LGSInput extends React.Component{
    constructor() {
        super();

        this.state = {
        }
    }

    clearInput(){
        this.setState({inputValue : 0});
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];
        if (input.value === "") {
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
        var object = {};
        object[this.props.objectName] = this.refs["input"].value;
        return object;
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }

        $(this.refs["input"]).select2({
            placeholder: 'Select an option'
        }).on("change", (e)=>{
            this.setState({inputValue : e.target.value})
            this.isValid(e.target.name);
        });
    }

    render() {
        return (
            <div className="form-group">
                <label> {this.props.title} </label>
                <div>
                    <select ref="input" style={{width: 100 +"%"}} className="select2-container form-control">
                        <option></option>
                        {LGS.find({}).map((LGSObjects)=>{
                            return <option key={LGSObjects._id} value={LGSObjects._id}>{LGSObjects.name} ({LGSObjects.location.city})</option>
                        })}
                    </select>
                </div>
                <span ref="error" className="error"></span>
            </div>
        )
    }
}