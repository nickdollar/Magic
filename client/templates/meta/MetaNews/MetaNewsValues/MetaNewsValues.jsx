import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Moment from "moment";

export default class NewsMetaValues extends React.Component {
    constructor(){
        super();
    }

    nameFormatted(cell, row){
        if(cell == 1){
            var deckName = DecksNames.findOne({_id : row._id});
            var archetype = DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id});
            return <a href={FlowRouter.path("ArchetypeDeckInformation", {format : row.format, archetype : archetype.name, deckSelected : deckName.name})}> {deckName.name} </a>
            return DecksNames.findOne({_id : row._id}).name;
        }else if(cell == 2){
            var deckName = DecksNames.findOne({_id : row.DecksNames_id});
            return <a href={FlowRouter.path("ArchetypeDeckInformation", {format : row.format, archetype : DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id}).name})}> {DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id}).name} </a>
        }else if(cell == 3){
            return <a href={FlowRouter.path("selectedEvent", {format : row.format, Events_id : row.Events_id, DecksData_id : row.DecksData_id})}><div className="js-imagePopOver" data-name={row._id}>{row._id}</div></a>
        }
    }

    typeFormatted(cell, row){
        if(cell == 1){
            return "Deck";
        }else if(cell == 2){
            return "Arch."
        }else if(cell == 3){
            return "Card"
        }
    }

    dateFormatted(cell, row){
        return Moment(cell).format("MM/DD");
    }

    componentDidMount() {
        cardPopover(".js-imagePopOver", true);
    }

    componentDidUpdate() {
        cardPopover(".js-imagePopOver", true);
    }
    handleTableComplete(){
        cardPopover(".js-imagePopOver", true);
    }

    render(){

        const options =
            {
                options : {
                    pagination : true,
                    sizePerPage : 10,
                    paginationSize : 2,
                    afterTableComplete: this.handleTableComplete.bind(this),

                },
                data : this.props.tableData,
                pagination : true

        }

        return(
            <div className="NewsMetaValuesComponent">
                <BootstrapTable {...options}>
                    <TableHeaderColumn dataAlign='center' isKey dataField="_id" hidden>_id</TableHeaderColumn>
                    <TableHeaderColumn width="55" dataAlign='center' dataField="t" dataFormat={this.typeFormatted}>Type</TableHeaderColumn>
                    <TableHeaderColumn dataAlign='left' dataField="t" dataFormat={this.nameFormatted}>Name</TableHeaderColumn>
                    <TableHeaderColumn width="55" dataAlign='center' dataField="date" dataFormat={this.dateFormatted}>Date</TableHeaderColumn>

                </BootstrapTable>

            </div>
        );
    }
}