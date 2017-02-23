import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import FormValidate from "/client/dumbReact/FormValidate/FormValidate";
import TextFormInput from "/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput";
import Radio from "/client/dumbReact/FormValidate/Inputs/Radios/Radio";

export default class DecksNamesList extends React.Component {
    constructor(){
        super();

    }

    expandComponent(row){
        return  <FormValidate submitMethod="updateDeckArchetype" extraFields={{_id : row._id}}>
                    <TextFormInput defaultValue={row.name}
                                   title="Name"
                                   objectName="name"
                    />
                    <Radio defaultValue = {row.format}
                           title="Format"
                           objectName="format"
                           opts={[{value : "standard", text : "Standard"},
                               {value : "modern", text : "Modern"},
                               {value : "vintage", text : "Vintage"},
                               {value : "legacy", text : "Legacy"}, ]}
                    />
                    <Radio defaultValue = {row.type}
                           title="Type"
                           objectName="type"
                           opts={[{value : "aggro", text : "Aggro"},
                                   {value : "combo", text : "Combo"},
                                   {value : "control", text : "Control"},
                             ]}
                    />
                </FormValidate>
    }


    removeDeckName(event, DecksNames_id){
        event.stopPropagation();
        Meteor.call("removeDecksArchetypes", DecksNames_id);
    }

    isExpandableRow(){
        return true;
    }

    removeButton(DecksNames_id){
        return <button onClick={(event)=>this.removeDeckName(event, DecksNames_id)}>X</button>
    }

    render(){
        const options = {
            options : {
                sizePerPage : 5,
                hideSizePerPage: true,
                defaultSortName: 'name',
                defaultSortOrder: 'asc'
            },
            expandComponent : this.expandComponent,
            expandableRow : this.isExpandableRow,
            pagination : true,
            data : this.props.DecksArchetypes
        }

        return(
            <div className="DecksArchetypesListComponent">
                <h3>Decks Archetypes List</h3>
                <BootstrapTable {...options}>
                    <TableHeaderColumn isKey dataField={"_id"} dataSort>_id</TableHeaderColumn>
                    <TableHeaderColumn dataField={"name"} dataSort>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField={"format"}>format</TableHeaderColumn>
                    <TableHeaderColumn dataField={"type"}>Type</TableHeaderColumn>
                    <TableHeaderColumn width="50px" dataField={"_id"} dataFormat={this.removeButton.bind(this)}>X</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}