import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import FormValidate from "/client/dumbReact/FormValidate/FormValidate";
import TextFormInput from "/client/dumbReact/FormValidate/Inputs/TextFormInput/TextFormInput";
import Radio from "/client/dumbReact/FormValidate/Inputs/Radios/Radio";
import Checkboxed from "/client/dumbReact/FormValidate/Inputs/Checkbox/Checkbox.jsx";


export default class DecksArchetypesList extends React.Component {
    constructor(){
        super();

    }

    expandComponent(row){
        return  <FormValidate submitMethod="updateDeckArchetype" id={row._id} extraFields={{_id : row._id}}>
                    <TextFormInput initialValue={row.name}
                                   title="Name"
                                   objectName="name"
                    />
                    <Radio initialValue = {row.Formats_id}
                           title="Format"
                           objectName="Formats_id"
                           opts={getFormatsForForm()}
                    />
                    <Radio initialValue = {row.type}
                           title="Type"
                           objectName="type"
                           opts={[{value : "aggro", text : "Aggro"},
                                   {value : "combo", text : "Combo"},
                                   {value : "control", text : "Control"},
                             ]}
                    />
                    <Checkboxed     default = {row.type}
                                    title="Type"
                                    objectName="colors"
                                    initialValue={row.colors}
                                    opts={[ {value : "b", text : "b"},
                                            {value : "c", text : "c"},
                                            {value : "g", text : "g"},
                                            {value : "r", text : "r"},
                                            {value : "u", text : "u"},
                                            {value : "w", text : "w"}
                                    ]}
                    />
                </FormValidate>
    }

    findAllDecks(cell, row){
        return <button onClick={()=>Meteor.call("findAllDecksArchetypesMethod", {DecksArchetypes_id : row._id})}>({row.manual ? row.manual.decksQty : 0})Find All Decks</button>
    }

    removeDeckName(event, DecksArchetypes_id){
        event.stopPropagation();
        Meteor.call("removeDecksArchetypes", {DecksArchetypes_id : DecksArchetypes_id});
    }

    isExpandableRow(){
        return true;
    }

    removeButton(DecksArchetypes_id){
        return <button onClick={(event)=>this.removeDeckName(event, DecksArchetypes_id)}>X</button>
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
                    <TableHeaderColumn dataField={"name"} dataSort >Name</TableHeaderColumn>
                    <TableHeaderColumn dataField={"Formats_id"}>format</TableHeaderColumn>
                    <TableHeaderColumn dataField={"type"}>Type</TableHeaderColumn>
                    <TableHeaderColumn dataField={"_id"} dataFormat={this.findAllDecks.bind(this)}>Find AllDecks</TableHeaderColumn>
                    <TableHeaderColumn width="50px" dataField={"_id"} dataFormat={this.removeButton.bind(this)}>X</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}