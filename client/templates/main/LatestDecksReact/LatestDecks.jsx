import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Moment from 'moment';

export default class LatestDecks extends React.Component {
    constructor(){
        super();

    }

    formatFormat(cell, row){
        if(row.t == 3){
            return row._id.format.toTitleCase();
        }
        return row.format.toTitleCase();
    }

    nameFormat(cell, row){
        if(row.t == 1){
            var deckName = DecksNames.findOne({_id : row._id});
            var archetype = DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id});
            return  <a href={FlowRouter.path("ArchetypeDeckInformation", {format : row.format, archetype : archetype.name, deckSelected : deckName.name})}>{deckName.name}</a>
            return DecksNames.findOne({_id : row._id}).name;
        }else if(row.t == 2){
            var deckName = DecksNames.findOne({_id : row.DecksNames_id});
            return <a href={FlowRouter.path("ArchetypeDeckInformation", {format : row.format, archetype : DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id}).name})}> {DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id}).name} </a>
        }else if(row.t == 3){

            return  <a href={FlowRouter.path("selectedEvent", {format : row._id.format, Events_id : row.Events_id, DecksData_id : row.DecksData_id})}>
                        <div className="js-imagePopOver" data-name={row._id.name}>{row._id.name}</div>
                    </a>
        }
        return cell.name.toTitleCase();
    }


    nameFormat2(cell, row){
        if(row.t == 1){
            var deckName = DecksNames.findOne({_id : row._id});
            var archetype = DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id});
            return  <a href={FlowRouter.path("ArchetypeDeckInformation", {format : row.format, archetype : archetype.name, deckSelected : deckName.name})}>{deckName.name}</a>
            return DecksNames.findOne({_id : row._id}).name;
        }else if(row.t == 2){
            var deckName = DecksNames.findOne({_id : row.DecksNames_id});
            return <a href={FlowRouter.path("ArchetypeDeckInformation", {format : row.format, archetype : DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id}).name})}> {DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id}).name} </a>
        }else if(row.t == 3){

            return  <a href={FlowRouter.path("selectedEvent", {format : row._id.format, Events_id : row.Events_id, DecksData_id : row.DecksData_id})}>
                        <span className="js-imagePopOver" data-name={row._id.name}>{row._id.name}</span>
                    </a>
        }
        return cell.name.toTitleCase();
    }

    dateFormat(cell, row){
        return Moment(cell).format("MM/DD")
    }

    popover(){
        cardPopover('.js-imagePopOver', true);
    }

    afterTableCompleteHandler(){
        cardPopover('.js-imagePopOver', true);
    }

    componentDidMount() {
        cardPopover('.js-imagePopOver', true);
    }

    componentDidUpdate() {
        cardPopover('.js-imagePopOver', true);
    }


    render(){
        if(this.props.listLoading){
            return <div>Loading</div>
        }

        var tableDecksArchetypes = {
            options : {
                sizePerPage : 5,
                hideSizePerPage: true,
            },
            data : this.props.List ? [].concat(this.props.List.newestArchetypes, this.props.List.newestDecks) : [],
            pagination : true
        }

        var tableCards = {
            options : {
                sizePerPage : 5,
                pagination : true,
                paginationSize : 2,
                hideSizePerPage: true,
                afterTableComplete: this.afterTableCompleteHandler.bind(this),
            },
            data : this.props.List.newestCards  ? [].concat(this.props.List.newestCards) : [],
            pagination : true
        }

        return(
            <div className="LatestDecksComponent">
                <div className="sectionHeader">
                    <div className="sectionName">
                        <h2>Last 2 Weeks Meta Addition</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6">
                        <BootstrapTable {...tableDecksArchetypes}>
                            <TableHeaderColumn dataField="_id" isKey dataFormat={this.formatFormat}> Format</TableHeaderColumn>
                            <TableHeaderColumn dataField="_id" dataFormat={this.nameFormat}>Name</TableHeaderColumn>
                            <TableHeaderColumn dataField="data" dataFormat={this.dateFormat}>Added</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                    <div className="col-xs-6">
                            <BootstrapTable {...tableCards}>
                                <TableHeaderColumn width="75" dataField="_id" isKey dataFormat={this.formatFormat}>Format</TableHeaderColumn>
                                <TableHeaderColumn dataField="_id" dataFormat={this.nameFormat}>Name</TableHeaderColumn>
                                <TableHeaderColumn width="65" dataField="data" dataFormat={this.dateFormat}>Added</TableHeaderColumn>
                            </BootstrapTable>
                    </div>
                </div>
            </div>
        );
    }
}