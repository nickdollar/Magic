import React from "react";
import LGSNameFieldContainer from "./CreateEventFormInputs/LGSNameFieldContainer.jsx";
import EventNameField from "./CreateEventFormInputs/EventNameField.jsx";
import EventEmailInput from "./CreateEventFormInputs/EventEmailInput.jsx";
import FormatsInput from "./CreateEventFormInputs/FormatsInput.jsx";
import EventToken from "./CreateEventFormInputs/EventToken.jsx";
import EventPasswordInput from "./CreateEventFormInputs/EventPasswordInput.jsx";
import EventDateInput from "./CreateEventFormInputs/EventDateInput.jsx";
import FormValidate from '/client/dumbReact/FormValidate/FormValidate.jsx';
import TextFormInput from '/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput.jsx';
import URLTextInput from '/client/dumbReact/FormValidate/Inputs/URLTextInput/URLTextInput.jsx';
import TextAreaInput from '/client/dumbReact/FormValidate/Inputs/TextAreaInput/TextAreaInput.jsx';
import DateHoursInput from '/client/dumbReact/FormValidate/Inputs/DateHoursInput/DataHoursInput.jsx';
import CheckBox from '/client/dumbReact/FormValidate/Inputs/Checkbox/Checkbox.jsx';
import GoogleAddresAutoComplete from '/client/dumbReact/FormValidate/Inputs/GoogleAddressAutoComplete/GoogleAddressAutoComplete.jsx'
import Select2 from '/client/dumbReact/FormValidate/Inputs/Select2/Select2.jsx'



export default class LGSAddNewStoreForm extends React.Component{

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
                    return;
                }

                if(!data){
                    this.refs["serverMessage"].textContent = "Token Already Exists for that Store";
                    return;
                }
                this.refs["serverMessage"].textContent = "";

                this.props.receiveCreatedEventInfo(data);

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
                <form name="contactForm" noValidate onSubmit={this.handleSubmit.bind(this)}>
                    <LGSNameFieldContainer onComponentMounted={this.register.bind(this)} objectName={"LGS_id"} title={"LGS"} errorMessage="Select A Store."/>
                    <EventNameField onComponentMounted={this.register.bind(this)} objectName={"name"} title={"Event Name"}  errorMessage="Name Required."/>
                    <EventToken onComponentMounted={this.register.bind(this)} objectName={"token"} title={"Event Token (No spaces, code that will be used to submit decks)"}  errorMessage="Token is Required."/>
                    <EventDateInput onComponentMounted={this.register.bind(this)} objectName={"date"} title={"Date"}  errorMessage="Missing Date"/>
                    <EventEmailInput onComponentMounted={this.register.bind(this)} objectName={"email"} title={"Email to send token and link, and password. (Optional)"}  errorMessage="E-mail is not Valid."/>
                    <FormatsInput onComponentMounted={this.register.bind(this)} objectName={"Formats_id"} title={"Format: "}  errorMessage="Format is Needed."/>
                    <EventPasswordInput onComponentMounted={this.register.bind(this)} objectName={"password"} title={"Password: "}  errorMessage="Password is needed."/>
                    <button type="submit" className="btn btn-default">Submit</button>
                    <div ref="serverMessage"></div>
                </form>

                {/*<FormValidate submitMethod={"addBigEvent"} update={true}>*/}
                    {/*<Select2*/}
                        {/*objectName={"title"}*/}
                        {/*title="LGS"*/}
                        {/*errorMessage="LGS Name is Missing"*/}
                        {/*required={true}*/}
                        {/*fieldUnique="_id"*/}
                        {/*fieldText="text"*/}
                        {/*options={getLGSForFor()}*/}
                    {/*/>*/}
                {/*</FormValidate>*/}
            </div>
        );
    }
}

getLGSForFor = ()=>{
    var lgs = LGS.find().map(lgs=> Object.assign(lgs, {text : `${lgs.name} (${lgs.location.city})`}));
    return lgs;
}