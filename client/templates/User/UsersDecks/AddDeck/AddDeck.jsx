import React from 'react' ;
import FormValidate from "/client/dumbReact/FormValidate/FormValidate.jsx"
import TextFormInput from "/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput.jsx"
import Radios from "/client/dumbReact/FormValidate/Inputs/Radios/Radio.jsx"

export default class AddDeck extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="AddDeckComponent">
                <FormValidate submitMethod="addNewDeckToUsersDecksMethod"
                              triggerEvent={this.props.deckAdded}
                              extraFields={{main : [], sideboard : []}}>
                    <TextFormInput
                        errorMessage ="Need a Name"
                        title ="Deck Name"
                        required ={true}
                        objectName ="name"
                    />
                    <Radios
                        errorMessage ="Need Format"
                        title ="Format"
                        required ={true}
                        objectName="Formats_id"
                        opts={getFormatsForForm()}
                    />
                </FormValidate>
         </div>
        );
    }
}