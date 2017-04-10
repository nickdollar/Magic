import React from 'react';
import FormValidate from "/client/dumbReact/FormValidate/FormValidate.jsx";
import TextInput from "/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput.jsx";
import Select2Container from "/client/dumbReact/FormValidate/Inputs/Select2/Select2Container.jsx";
import CheckBox from "/client/dumbReact/FormValidate/Inputs/Checkbox/Checkbox";


export default class CustomAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {Formats_id : "standard"};
    }

    componentDidMount(){

    }

    defaultRadio(opt){
        if(opt == this.state.Formats_id){
            return true
        }
        return false;
    }

    Formats_idChange(opt){
        this.setState({Formats_id : opt});
    }

    render(){
        return (
            <div className="AddDecksNamesComponent">
                <h3>Add A New Deck Name</h3>
                <FormValidate submitMethod="addDeckName" id={this.props.Formats_id} extraFields={{Formats_id : this.props.Formats_id}}>
                    <TextInput objectName={"name"}
                               title={"Deck Name"}
                               errorMessage="Need Name."
                               required={true}
                    />
                    <CheckBox objectName={"colors"}
                            opts={[  {value : "B", text : "B"},
                                    {value : "C", text : "C"},
                                    {value : "G", text : "G"},
                                    {value : "R", text : "R"},
                                    {value : "U", text : "U"},
                                    {value : "W", text : "W"}
                                ]}
                            title="Colors"
                            errorMessage="Minimum Required Not Meet"
                            minimunRequired={0}
                    />
                    <Select2Container objectName={"DecksArchetypes_id"}
                                      title={"Decks Archetype"}
                                      collection="DecksArchetypes"
                                      errorMessage="Deck Archetype Missing"
                                      subscription="DecksArchetypesFormat"
                                      serverQuery={[this.props.Formats_id]}
                                      clientQuery={{Formats_id : this.props.Formats_id}}
                                      projection={{fields : {_id : 1, name : 1}}}
                                      fieldUnique="_id"
                                      fieldText="name"
                    />
                </FormValidate>
            </div>
        )
    }
}
