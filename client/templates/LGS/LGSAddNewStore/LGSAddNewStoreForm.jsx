import React from "react";
import LGSNameField from "./LGSAddNewStoreFormFields/LGSNameField.jsx";
import URLInput from "./LGSAddNewStoreFormFields/URLInput.jsx";
import GoogleAutocompleteInput from "./LGSAddNewStoreFormFields/GoogleAutocompleteInput.jsx";


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


            Meteor.call('addLGS', form , (error, data)=>{
                if(error){
                    console.log("Error Adding Store");
                    return;
                }
                console.log(data);
                if(data!=true){
                    this.setState({
                        ServerMessage: data
                    });
                }else{
                    this.state.Fields.forEach((field)=>{
                        field.clearInput();
                    });

                    this.setState({
                        ServerMessage: "LGS Added"
                    });
                }
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
                    <LGSNameField onComponentMounted={this.register.bind(this)} />
                    <URLInput onComponentMounted={this.register.bind(this)} />
                    <GoogleAutocompleteInput onComponentMounted={this.register.bind(this)} />

                    <button type="submit" className="btn btn-default">Submmit</button>
                    <p ref="serverMessage" className="servermessage error">{this.state.ServerMessage}</p>
                </form>
            </div>
        );
    }
}

export default LGSAddNewStoreForm;
