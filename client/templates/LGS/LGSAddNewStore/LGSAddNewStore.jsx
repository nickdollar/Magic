import React from 'react';
import ModalFirstPage from '/client/dumbReact/Modal/ModalFirstPage.jsx';
import FormValidation from '/client/dumbReact/FormValidate/FormValidate.jsx'
import TextFormInput from '/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput.jsx'
import URLTextInput from '/client/dumbReact/FormValidate/Inputs/URLTextInput/URLTextInput.jsx'
import GoogleAddressAutoComplete from '/client/dumbReact/FormValidate/Inputs/GoogleAddressAutoComplete/GoogleAddressAutoComplete.jsx'





export default class LGSAddNewStore extends React.Component {
    constructor(){
        super();

        this.state = {
            showModal : false
        }
    }

    handleHideModal(){
        this.setState({showModal: false})
    }

    handleShowModal(){
        this.setState({showModal: true})
    }

    render(){
        return(
            <div className="LGSAddNewStoreComponent">
                <button className="btn btn-default btn-block" onClick={this.handleShowModal.bind(this)}>Add Store</button>

                <ModalFirstPage showModal={this.state.showModal}
                                handleHideModal={this.handleHideModal.bind(this)}

                >
                    <FormValidation submitMethod="addLGS">
                        <TextFormInput
                            objectName={"name"}
                            title={"Local Game Store Name"}
                            errorMessage={"LGS Name is Missing"}
                            required={true}
                        />
                        <URLTextInput
                            objectName={"url"}
                            title="LGS URL with its calendar, (Need to add events to calendar)"
                            errorMessage="URL is not in right format."
                        />
                        <GoogleAddressAutoComplete objectName="location"/>

                    </FormValidation>
                </ModalFirstPage>
            </div>
        );
    }
}