import React from "react";
import TrackerReact from 'meteor/ultimatejs:tracker-react';


class LGSInput extends TrackerReact(React.Component){
    constructor() {
        super();
        // navigator.geolocation.getCurrentPosition((location)=> {
        //     this.state = {
        //         subscription: {
        //             LGS: Meteor.subscribe("LGS", [location.coords.longitude ,location.coords.latitude])
        //         },
        //         coords : [location.coords.longitude, location.coords.latitude],
        //         inputValue : 0
        //     }
        // });
    }

    clearInput(){
        this.setState({inputValue : 0});
    }

    componentWillUnmount(){
        this.state.subscription.LGS.stop();
    }

    isValid() {
        var input = this.refs["input"];
        var error = this.refs["error"];
        if (input.value === "") {
            input.classList.add('error');
            error.textContent = "Choose One Store";
            return false;
        }
        else {
            input.classList.remove('error');
            error.textContent  = "";

        }

        return true;
    }

    getCorrectedValue(){
        return {LGS_id : this.refs["input"].value};
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
                <label> LGS: </label>
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

export default LGSInput;