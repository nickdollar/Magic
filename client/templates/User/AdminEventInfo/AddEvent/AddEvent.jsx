import React from 'react' ;
import FormValidate from '/client/dumbReact/FormValidate/FormValidate.jsx';
import TextFormInput from '/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput.jsx';
import Radio from '/client/dumbReact/FormValidate/Inputs/Radios/Radio.jsx';
import Select2 from '/client/dumbReact/FormValidate/Inputs/Select2/Select2.jsx'
import Date from '/client/dumbReact/FormValidate/Inputs/Date/Date.jsx'


export default class AddEvent extends React.Component {
    constructor(){
        super();


    }

    render(){
        return(
            <div className="AddEventComponent">
                <h4>Create A Event</h4>
                <FormValidate submitMethod={"addALGSEventMethod"} update={true} callback={this.props.getUsersCreatedEvent}>
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