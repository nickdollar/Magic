import React from "react";

import FormValidate from '/client/dumbReact/FormValidate/FormValidate.jsx';
import TextFormInput from '/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput.jsx';
import Radio from '/client/dumbReact/FormValidate/Inputs/Radios/Radio.jsx';
import Select2 from '/client/dumbReact/FormValidate/Inputs/Select2/Select2.jsx'
import Password from '/client/dumbReact/FormValidate/Inputs/Password/Password.jsx'
import Date from '/client/dumbReact/FormValidate/Inputs/Date/Date.jsx'



export default class LGSAddNewStoreForm extends React.Component{

    constructor(props){
        super();
    }

    render() {
        return (
            <div className="LGSAddNewStoreFormComponent">
                <FormValidate submitMethod={"addALGSEventMethod"} callback={this.props.receiveCreatedEventInfo} update={true}>
                    <Select2
                        objectName={"LGS_id"}
                        title="LGS"
                        errorMessage="LGS Name is Missing"
                        required={true}
                        fieldUnique="_id"
                        fieldText="text"
                        options={getLGSForFor()}
                    />

                    <TextFormInput
                        errorMessage = {"Missing Event Name"}
                        title = {"Event Name"}
                        required = {true}
                        objectName = {"name"}
                    />
                    <TextFormInput
                        errorMessage = {"Missing Token"}
                        title = {"Token"}
                        required = {true}
                        objectName = {"token"}
                    />
                    <Radio
                        errorMessage = {"Missing Event Token"}
                        title = {"Format:"}
                        required = {true}
                        objectName = {"Formats_id"}
                        opts = {Formats.find({active : 1}).map((format)=>{
                            return {text : format.name, value : format._id}
                        })}
                    />
                    <Date
                        errorMessage={true}
                        objectName={"date"}
                    />
                </FormValidate>
            </div>
        );
    }
}

getLGSForFor = ()=>{
    var lgs = LGS.find().map(lgs=> Object.assign(lgs, {text : `${lgs.name} (${lgs.location.city})`}));
    return lgs;
}