import React from 'react';
import ModalFirstPage from '/client/dumbReact/Modal/ModalFirstPage.jsx';
import FormValidation from '/client/dumbReact/FormValidate/FormValidate.jsx'
import textFormInput from '/client/dumbReact/FormValidate/inputs/textFormInput/textFormInput.jsx'
import URLTextInput from '/client/dumbReact/FormValidate/inputs/URLTextInput/URLTextInput.jsx'
import URLTextInput from '/client/dumbReact/FormValidate/inputs/URLTextInput/URLTextInput.jsx'
import GoogleAddressAutoComplete from '/client/dumbReact/FormValidate/inputs/GoogleAddressAutoComplete/GoogleAddressAutoComplete.jsx'





export default class LGSAddNewStore extends React.Component {
    constructor(){
        super();

    }

    handleHideModal(){
        this.setState({showModal: false})
    }

    render(){
        return(
            <div className="LGSAddNewStoreComponent">
                <button className="btn btn-default btn-block" onClick={this.handleShowModal.bind(this)}>Add Store</button>

                <ModalFirstPage showModal={this.state.showModal}
                                handleHideModal={this.handleHideModal.bind(this)}

                >
                    <FormValidation >
                        <textFormInput
                            objectName={"name"}
                            title="LGS Name"
                            errorMessage="LGS Name is Missing"
                            required={true}
                        />
                        <URLTextInput
                            objectName={"url"}
                            title="LGS Format"
                            errorMessage="URL is not in right format."
                        />
                        <GoogleAddressAutoComplete/>

                    </FormValidation>
                </ModalFirstPage>
            </div>
        );
    }
}