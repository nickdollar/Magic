import React from "react";
import PriceInput from "./formInputs/PriceInput.jsx";
import RoundsInput from "./formInputs/RoundsInput.jsx";
import LGSInput from "./formInputs/LGSInput.jsx";
import DayInput from "./formInputs/DayInput.jsx";
import StartInput from "./formInputs/StartTime.jsx";
import DescriptionInput from "./formInputs/DescriptionInput.jsx";
import FormatsInput from "./formInputs/FormatsInput.jsx";
import EventNameInput from "./formInputs/EventNameInput.jsx";

class LGSAddNewEventToLGSStoreForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            fields : [],
            serverMessage : ""
        };
    }

    handleSubmit (e){
        e.preventDefault();
        var validForm = true;
        this.state.fields.forEach((field)=>{

            if(typeof field.isValid === "function"){
                var validField = field.isValid(field.props.name);
                validForm = validForm && validField;
            }
        });



        
        if(validForm) {
            var form = {};
            this.state.fields.forEach((field)=>{
                form = Object.assign(form, field.getCorrectedValue())
            });

            this.state.fields.forEach((field)=>{
                field.clearInput();
            });

            Meteor.call('addLGSEvents', form , (error, data)=>{
                if(error){
                    return;
                }
            });
        }else{
            console.log("FormValidate wrong");
        }
    }

    register (field){
        var s = this.state.fields;
        s.push(field);
        this.setState({
            fields : s
        })
    }

    render() {
        return (
            <div>
                <form name="contactForm" noValidate  onSubmit={this.handleSubmit.bind(this)}>
                    {/*<EventNameInput required={true} onComponentMounted={this.register.bind(this)} />*/}
                    <LGSInput required={true} onComponentMounted={this.register.bind(this)} />
                    <PriceInput required={true} onComponentMounted={this.register.bind(this)} />
                    <RoundsInput required={true} onComponentMounted={this.register.bind(this)} />
                    <FormatsInput required={true} onComponentMounted={this.register.bind(this)} />
                    <DayInput required={true} onComponentMounted={this.register.bind(this)} />
                    <StartInput required={true} onComponentMounted={this.register.bind(this)} />
                    <DescriptionInput required={true} onComponentMounted={this.register.bind(this)} />
                    <button type="submit" className="btn btn-default">Submit</button>
                </form>
            </div>
        );
    }
}

export default LGSAddNewEventToLGSStoreForm;