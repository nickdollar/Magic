import React from 'react';
import FormValidate from "/client/dumbReact/FormValidate/FormValidate.jsx";
import TextInput from "/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput.jsx";
import Select2Container from "/client/dumbReact/FormValidate/Inputs/Select2/Select2Container.jsx";
import Radio from "/client/dumbReact/FormValidate/Inputs/Radios/Radio.jsx";


export default class AddArchetypeName extends React.Component{
    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){
        return (
            <div className="AddDecksArchetypesContainer">
                <FormValidate submitMethod="addArchetype">
                    <TextInput objectName={"name"}
                               title={"Deck Archetype"}
                               errorMessage="Archetype is Missing."
                               required={true}
                    />
                    <Radio  objectName={"format"}
                            title={"Format"}
                            errorMessage="Choose A Format."
                            required={true}
                            opts={[ {value : "standard", text : "standard"},
                                    {value : "modern", text : "modern"},
                                    {value : "legacy", text : "legacy"},
                                    {value : "vintage", text : "vintage"}]}
                            defaultOption="standard"
                    />
                    <Radio  objectName={"type"}
                            title={"Type"}
                            errorMessage="Choose A Type."
                            required={true}
                            opts={[ {value : "aggro", text : "aggro"},
                                {value : "combo", text : "combo"},
                                {value : "control", text : "control"}]}
                            defaultOption="aggro"
                    />
                </FormValidate>
            </div>
        )
    }
}
