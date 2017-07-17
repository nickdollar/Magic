import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Moment from 'moment';

export default class LatestDecks extends React.Component {
    constructor(){
        super();
        this.state = {List : {}}
    }

    getLastTwoWeeks(){
        Meteor.call("getMetaLastDaysAdditionMethod",(err, response)=>{
            if(!response){
                this.setState({List : {newestCards : [], newestArchetypes : []}})
            }else{
                this.setState({List : response});
            }
        });
    }

    typeFormat(cell, row){

        if(row.t == 1) return "Archetype";
        if(row.t == 2) return "Deck";
    }

    formatFormat(cell, row){
        if(row.t == 1){
            var format = Formats.findOne({_id : row.Formats_id});
            return format.name;
        }
        var format = Formats.findOne({_id : row._id.Formats_id});
        return format.name;
    }

    nameFormat(cell, row){
        if(row.t == 1){
            var archetype = DecksArchetypes.findOne({_id : row._id});
            return <a href={FlowRouter.path("ArchetypeDeckInformation", {format : getLinkFormat(row.Formats_id), DeckArchetype : archetype.link})}> {archetype.name} </a>
        }else if(row.t == 2){

            return  <a href={FlowRouter.path("selectedEvent", {format : getLinkFormat(row._id.Formats_id), Events_id : row.Events_id, DecksData_id : row.DecksData_id})}>
                        <div className="js-imagePopOver" data-name={row._id.name}>{row._id.name}</div>
                    </a>
        }
        return cell.name.toTitleCase();
    }

    dateFormat(cell, row){
        console.log(cell);
        return Moment(cell).format("MM/DD")
    }

    popover(){
        cardPopover('.js-imagePopOver', true);
    }

    afterTableCompleteHandler(){
        cardPopover('.js-imagePopOver', true);
    }

    componentDidMount() {
        this.getLastTwoWeeks();
        cardPopover('.js-imagePopOver', true);
    }

    componentDidUpdate() {
        cardPopover('.js-imagePopOver', true);
    }


    render(){
        var newestCards = [];
        var newestNamesArchetypes = [];

        if(this.state.List.newestCards){
            newestCards = newestCards.concat(this.state.List.newestCards);
        }

        if(this.state.List.newestDecks){
            newestNamesArchetypes = newestNamesArchetypes.concat(this.state.List.newestDecks);
        }

        if(this.state.List.newestArchetypes){
            newestNamesArchetypes = newestNamesArchetypes.concat(this.state.List.newestArchetypes);
        }

        var tableDecksArchetypes = {
            options : {
                sizePerPage : 10,
                hideSizePerPage: true,
            },
            data : newestNamesArchetypes,
            pagination : true
        }

        var tableCards = {
            options : {
                sizePerPage : 10,
                pagination : true,
                paginationSize : 2,
                hideSizePerPage: true,
                afterTableComplete: this.afterTableCompleteHandler.bind(this),
            },
            data : newestCards,
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
                            <TableHeaderColumn dataField="_id" isKey dataFormat={this.formatFormat}>Format</TableHeaderColumn>
                            <TableHeaderColumn dataField="t" dataFormat={this.typeFormat}>Type</TableHeaderColumn>
                            <TableHeaderColumn dataField="_id" dataFormat={this.nameFormat}>Name</TableHeaderColumn>
                            <TableHeaderColumn width="65" dataField="date" dataFormat={this.dateFormat}>Added</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                    <div className="col-xs-6">
                            <BootstrapTable {...tableCards}>
                                <TableHeaderColumn width="75" dataField="_id" isKey dataFormat={this.formatFormat}>Format</TableHeaderColumn>
                                <TableHeaderColumn dataField="_id" dataFormat={this.nameFormat}>Name</TableHeaderColumn>
                                <TableHeaderColumn width="65" dataField="date" dataFormat={this.dateFormat}>Added</TableHeaderColumn>
                            </BootstrapTable>
                    </div>
                </div>
            </div>
        );
    }
}