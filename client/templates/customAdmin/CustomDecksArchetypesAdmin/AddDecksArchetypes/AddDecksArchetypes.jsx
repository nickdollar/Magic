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
            <div>
                <FormValidate submitMethod="insertToCollection" collection="DecksArchetypes">
                    <TextInput objectName={"name"}
                               title={"Deck Name"}
                               errorMessage="E-mail is not Valid."
                               required={true}
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
