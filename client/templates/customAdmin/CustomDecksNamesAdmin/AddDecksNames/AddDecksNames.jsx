import React from 'react';
import FormValidate from "/client/dumbReact/FormValidate/FormValidate.jsx";
import TextInput from "/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput.jsx";
import Select2Container from "/client/dumbReact/FormValidate/Inputs/Select2/Select2Container.jsx";
import Radio from "/client/dumbReact/FormValidate/Inputs/Radios/Radio.jsx";


export default class CustomAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {format : "standard"};
    }

    componentDidMount(){

    }

    defaultRadio(opt){
        if(opt == this.state.format){
            return true
        }
        return false;
    }

    formatChange(opt){
        this.setState({format : opt});
    }

    render(){

        var formats = ["standard", "modern", "legacy", "vintage"];
        return (
            <div>
                <div ref="input">
                    {formats.map((opt)=>{
                        return  <label key={opt} className="radio-inline">
                                    <input onChange={this.formatChange.bind(this, opt)}
                                           checked={this.defaultRadio(opt)}
                                           type="radio"
                                           value={opt}
                                           name={this.props.objectName}/>
                                    {opt}
                                </label>
                    })}
                </div>
                <FormValidate submitMethod="addDeckName" collection="DecksNames" extraFields={{format : this.state.format}}>
                    <TextInput objectName={"name"}
                               title={"Deck Name"}
                               errorMessage="E-mail is not Valid."
                               required={true}
                    />

                    <Select2Container objectName={"DecksArchetypes_id"}
                                      title={"Decks Archetype"}
                                      errorMessage="Deck Archetype Missing"
                                      subscription="DecksArchetypesQueryProjection"
                                      query={{format : this.state.format}}
                                      projection={{fields : {_id : 1, name : 1}}}
                                      fieldValue="_id"
                                      fieldText="name"

                    />
                </FormValidate>
            </div>
        )
    }
}
