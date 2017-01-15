import React from "react";
import LGSNameFieldContainer from "./SubmitTokenForm/LGSNameFieldContainer.jsx";
import TokenField from "./SubmitTokenForm/TokenField.jsx";
import PlayerNameInput from "./SubmitTokenForm/PlayerNameInput.jsx";



class SubmitTokenForm extends React.Component{

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

            Meteor.call("checkIfEventExists", {token : form.token, LGS_id : form.LGS_id}, (err, data)=>{

                if(data == false){
                    console.log(this.refs["serverMessage"]);
                    this.refs["serverMessage"].textContent = "Token doesn't exist for that Store."
                    return;
                }
                Object.assign(data, form);
                this.props.tokenConfirmed(data);
            })
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
                <h3>Add Deck To Event</h3>
                <form noValidate  onSubmit={this.handleSubmit.bind(this)}>
                    <LGSNameFieldContainer onComponentMounted={this.register.bind(this)}
                                           objectName={"LGS_id"}
                                           title={"LGS"}
                                           errorMessage="Select A Store."/>
                    <TokenField onComponentMounted={this.register.bind(this)}
                                objectName={"token"}
                                title={"Token"}
                                errorMessage="Type Token."/>
                    <PlayerNameInput onComponentMounted={this.register.bind(this)}
                                objectName={"player"}
                                title={"Player Name"}
                                errorMessage="Type Player Name."/>

                    <button type="submit" className="btn btn-default">Submit</button>
                    <span className="error" ref="serverMessage"></span>
                </form>
            </div>
        );
    }
}

export default SubmitTokenForm;