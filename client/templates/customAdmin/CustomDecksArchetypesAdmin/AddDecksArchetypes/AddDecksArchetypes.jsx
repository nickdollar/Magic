import React from 'react';
import FormValidate from "/client/dumbReact/FormValidate/FormValidate.jsx";
import TextInput from "/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput.jsx";
import Radio from "/client/dumbReact/FormValidate/Inputs/Radios/Radio.jsx";
import Checkbox from "/client/dumbReact/FormValidate/Inputs/Checkbox/Checkbox.jsx";


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
                <h3>Add New Archetypes</h3>
                <FormValidate submitMethod="addArchetypeMethod">
                    <TextInput objectName={"name"}
                               title={"Deck Archetype"}
                               errorMessage="Archetype is Missing."
                               required={true}
                    />
                    <Radio  objectName={"Formats_id"}
                            title={"Format"}
                            errorMessage="Choose A Format."
                            required={true}
                            opts={getFormatsForForm()}
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
                    <Checkbox  objectName={"colors"}
                                title={"Type"}
                                errorMessage="Choose A Type."
                                required={true}
                                opts={[ {value : "b", text : "b"},
                                        {value : "c", text : "c"},
                                        {value : "g", text : "g"},
                                        {value : "r", text : "r"},
                                        {value : "u", text : "u"},
                                        {value : "w", text : "w"},
                                     ]}
                                defaultOption="aggro"
                    />
                </FormValidate>
            </div>
        )
    }
}
