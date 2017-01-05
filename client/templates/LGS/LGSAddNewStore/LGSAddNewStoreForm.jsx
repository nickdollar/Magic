import React from "react";
import LGSAddNewStoreAddNewStoreFormInputs from "./LGSAddNewStoreAddNewStoreFormInputs.jsx";

class LGSAddNewStoreForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            StoreName : "",
            Email : "",
            URL : "",
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
                if(validField){

                }
                validForm = validForm && validField;


            }
        });



        if(validForm) {
            var d = {
                StoreName: this.state.StoreName,
                location: this.refs["GoogleAuto"].state.location,
                URL: this.state.URL,
            }


            Meteor.call('addLGS', d , (error, data)=>{
                if(error){
                    console.log("ERROR ADDING STORE");
                    return;
                }
                this.setState({
                    StoreName : "",
                    Email : "",
                    URL : "",
                    Message : "",
                    Fields : [],
                    ServerMessage : ""
                });

                this.refs["GoogleAuto"].resetState();
            });
        }
    }

    onChangeStoreName(value){
        this.setState({
            StoreName : value
        })
    }

    onChangeEmail(value){
        this.setState({
            Email : value
        })
    }

    onChangeMessage(value){
        this.setState({
            Message : value
        })
    }

    onChangeURL(value){
        this.setState({
            URL : value
        })
    }

    onChangeGoogleAutocomplete(value){
        this.setState({
            GoogleAutocomplete : value
        })
    }

    register (field){
        var s = this.state.Fields;
        s.push(field);
        this.setState({
            Fields : s
        })
    }


    handleSearchChange (e){
        this.setState({search: e.target.value})
    }

    handleSelectSuggest(suggest, coordinate){
        this.setState({search: suggest.description, selectedCoordinate: coordinate})
    }

    render() {
        return (
            <div>
                <form name="contactForm" noValidate  onSubmit={this.handleSubmit.bind(this)}>
                    <LGSAddNewStoreAddNewStoreFormInputs type={'text'}
                             value={this.state.StoreName}
                             label={'Store Name'}
                             name={'Fullname'}
                             ref={'Fullname'}
                             htmlFor={"Fullname"}
                             isRequired={true}
                             onChange={this.onChangeStoreName.bind(this)}
                             onComponentMounted={this.register.bind(this)}
                             messageRequired={'FullName required'}
                    />


                    <LGSAddNewStoreAddNewStoreFormInputs type={'text'}
                             value={this.state.URL}
                             label={'URL'}
                             name={'URL'}
                             ref={'URL'}
                             htmlFor={'URL'}
                             isRequired={false}
                             onChange={this.onChangeURL.bind(this)}
                             onComponentMounted={this.register.bind(this)}
                             messageRequired={'Wrong URL'}
                    />
                    <LGSAddNewStoreAddNewStoreFormInputs type={'GoogleAuto'}
                             ref={'GoogleAuto'}
                             name={'GoogleAuto'}
                             htmlFor={'GoogleAuto'}
                             label={'Address'}
                             isRequired={true}
                             onChange={this.onChangeGoogleAutocomplete.bind(this)}
                             onComponentMounted={this.register.bind(this)}
                             messageRequired={'Choose address from the suggested list'}
                    />
                    <button type="submit" className="btn btn-default">Submmit</button>
                    <p className="servermessage">{this.state.ServerMessage}</p>
                </form>
            </div>
        );
    }
}

export default LGSAddNewStoreForm;