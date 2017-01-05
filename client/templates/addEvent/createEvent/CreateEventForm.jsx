import React from "react";
import LGSNameFieldContainer from "./CreateEventFormInputs/LGSNameFieldContainer.jsx";
import EventNameField from "./CreateEventFormInputs/EventNameField.jsx";
import EventEmailInput from "./CreateEventFormInputs/EventEmailInput.jsx";
import FormatsInput from "./CreateEventFormInputs/FormatsInput.jsx";
import EventToken from "./CreateEventFormInputs/EventToken.jsx";
import EventPasswordInput from "./CreateEventFormInputs/EventPasswordInput.jsx";




class LGSAddNewStoreForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            Fields : [],
            ServerMessage : ""
        };
    }

    handleSubmit (e){
        e.preventDefault();
        var validForm = true;
        this.state.Fields.forEach((field)=>{
            if(typeof field.isValid === "function"){
                var validField = field.isValid(field.refs[field.props.name]);
                validForm = validForm && validField;
            }
        });

        if(validForm) {
            var form = {};
            this.state.Fields.forEach((field)=>{
                form = Object.assign(form, field.getCorrectedValue())
            });

            Meteor.call('addALGSEvent', form , (error, data)=>{
                if(error){
                    console.log("ERROR ADDING STORE");
                    return;
                }

                this.props.receiveCreatedEventInfo(data);
                // this.state.Fields.forEach((field)=>{
                //     field.clearInput();
                // });
            });
        }
    }

    register (field){
        var s = this.state.Fields;
        s.push(field);
        this.setState({
            Fields : s
        })
    }

    render() {
        return (
            <div>
                <form name="contactForm" noValidate  onSubmit={this.handleSubmit.bind(this)}>
                    <LGSNameFieldContainer onComponentMounted={this.register.bind(this)} objectName={"lgs_id"} title={"LGS"} errorMessage="Select A Store."/>
                    <EventNameField onComponentMounted={this.register.bind(this)} objectName={"eventName"} title={"Event Name"}  errorMessage="Name Required."/>
                    <EventToken onComponentMounted={this.register.bind(this)} objectName={"token"} title={"Event Token (No spaces, code that will be used to submit decks)"}  errorMessage="Token is Required."/>
                    <EventEmailInput onComponentMounted={this.register.bind(this)} objectName={"email"} title={"Email to send token and link, and password. (Optional)"}  errorMessage="E-mail is not Valid."/>
                    <FormatsInput onComponentMounted={this.register.bind(this)} objectName={"format"} title={"Format: "}  errorMessage="Format is Needed."/>
                    <EventPasswordInput onComponentMounted={this.register.bind(this)} objectName={"password"} title={"Password: "}  errorMessage="Password is needed."/>

                    <button type="submit" className="btn btn-default">Submit</button>
                    <p className="servermessage">{this.state.ServerMessage}</p>
                </form>
            </div>
        );
    }
}

export default LGSAddNewStoreForm;
