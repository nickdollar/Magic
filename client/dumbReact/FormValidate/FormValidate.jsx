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


    shouldComponentUpdate(nextProps, nextState){
        if(this.props.update){
            return true;
        }

        if(this.props.id != nextProps.id){
            return true;
        }
        return false;
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

            if(this.props.extraFields){
                Object.assign(form, this.props.extraFields);
            }
            Meteor.call(this.props.submitMethod, form, (error, {confirm, response})=>{
                if(error){
                    logError("Error Submitting Form");
                    return;
                }

                console.log(confirm, response);

                if(!confirm){
                    this.setState({
                        ServerMessage: response
                    });
                }else{
                    this.state.Fields.forEach((field)=>{
                        field.clearInput();
                    });
                    if(this.props.callback){
                        this.props.callback(response);
                    }
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


