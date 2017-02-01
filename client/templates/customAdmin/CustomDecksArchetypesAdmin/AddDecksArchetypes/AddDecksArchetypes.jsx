import React from 'react';
import FormValidate from "/client/dumbReact/FormValidate/FormValidate.jsx";
import TextInput from "/client/dumbReact/FormValidate/inputs/textFormInput/textFormInput.jsx";
import Select2Container from "/client/dumbReact/FormValidate/inputs/Select2/Select2Container.jsx";
import Radio from "/client/dumbReact/FormValidate/inputs/Radios/Radio.jsx";


export default class AddArchetypeName extends React.Component{
    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){
        return (
            <div>
                <FormValidate submitMethod="insertToCollection" collection="DecksNames">
                    <TextInput objectName={"name"}
                               title={"Deck Name"}
                               errorMessage="E-mail is not Valid."
                               required={true}
                    />
                    <Select2Container objectName={"DecksArchetypes_id"}
                                      title={"Decks Archetype"}
                                      errorMessage="Deck Archetype Missing"
                                      subscription="DecksArchetypesQueryProjection"
                                      query={{format : "modern"}}
                                      projection={{fields : {_id : 1, name : 1}}}
                                      fieldValue="_id"
                                      fieldText="name"

                    />
                    <Radio  objectName={"format"}
                            title={"Format"}
                            errorMessage="Choose A Format."
                            required={true}
                            opts={["standard", "modern", "legacy", "vintage"]}
                            defaultOption="standard"
                    />

                </FormValidate>
            </div>
        )
    }
}
