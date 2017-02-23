import React from "react";


//submitMethod
//extraFields

export default class FormValidate extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            Fields : [],
            ServerMessage : ""
        };
    }

    componentDidUpdate(){
    }

    handleSubmit (e){
        e.preventDefault();
        console.log("handleSubmit");
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

            if(this.props.extraFields){
                Object.assign(form, this.props.extraFields);
            }

            Meteor.call(this.props.submitMethod, form, (error, data)=>{
                if(error){
                    console.log("Error Adding Store");
                    return;
                }

                if(data!=true){
                    this.setState({
                        ServerMessage: data
                    });
                }else{
                    this.state.Fields.forEach((field)=>{
                        field.clearInput();
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

    clone(component){
        return React.cloneElement(component, {register : this.register.bind(this)});
    }

    render() {
        return (
            <div className="FormValidateComponent">
                <form name="contactForm" noValidate onSubmit={this.handleSubmit.bind(this)}>
                    {React.Children.map(this.props.children, this.clone.bind(this))}
                    <button type="submit" className="btn btn-default">Submit</button>
                    <p ref="serverMessage" className="servermessage error">{this.state.ServerMessage}</p>
                </form>
            </div>
        );
    }
}


