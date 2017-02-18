import React from 'react';
import FormValidate from "/client/dumbReact/FormValidate/FormValidate.jsx";
import TextInput from "/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput.jsx";
import Select2Container from "/client/dumbReact/FormValidate/Inputs/Select2/Select2Container.jsx";


export default class CustomAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {format : "standard"};
    }

    componentDidMount(){

    }

    defaultRadio(opt){
        if(opt == this.state.format){
            return true
        }
        return false;
    }

    formatChange(opt){
        this.setState({format : opt});
    }

    render(){
        return (
            <div>
                <FormValidate submitMethod="addDeckName" extraFields={{format : this.props.format}}>
                    <TextInput objectName={"name"}
                               title={"Deck Name"}
                               errorMessage="E-mail is not Valid."
                               required={true}
                    />

                    <Select2Container objectName={"DecksArchetypes_id"}
                                      title={"Decks Archetype"}
                                      collection="DecksArchetypes"
                                      errorMessage="Deck Archetype Missing"
                                      subscription="DecksArchetypesFormat"
                                      serverQuery={[this.props.format]}
                                      clientQuery={{format : this.props.format}}
                                      projection={{fields : {_id : 1, name : 1}}}
                                      fieldUnique="_id"
                                      fieldText="name"
                    />
                </FormValidate>
            </div>
        )
    }
}
