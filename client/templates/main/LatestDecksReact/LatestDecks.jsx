import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Moment from 'moment';

export default class LatestDecks extends React.Component {
    constructor(){
        super();

    }

    formatFormat(cell, row){
        return cell.format.toTitleCase();
    }

    nameFormat(cell, row){
        if(row.t == 1){
            var deckName = DecksNames.findOne({_id : row._id});
            var archetype = DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id});
            return <a href={FlowRouter.path("ArchetypeDeckInformation", {format : row.format, archetype : archetype.name, deckSelected : deckName.name})}> {deckName.name} </a>
            return DecksNames.findOne({_id : row._id}).name;
        }else if(row.t == 2){
            var deckName = DecksNames.findOne({_id : row.DecksNames_id});
            return <a href={FlowRouter.path("ArchetypeDeckInformation", {format : row.format, archetype : DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id}).name})}> {DecksArchetypes.findOne({_id : deckName.DecksArchetypes_id}).name} </a>
        }else if(row.t == 3){
            return <a href={FlowRouter.path("selectedEvent", {format : row._id.format, Events_id : row.Events_id, DecksData_id : row.DecksData_id})}><div className="js-imagePopOver" data-name={row._id.name}>{row._id.name}</div></a>
        }
        return cell.name.toTitleCase();
    }

    componentDidMount() {
        this.popover();
    }

    componentDidUpdate() {
        this.popover();
    }
    handleTableComplete(){
        this.popover();
    }

    dateFormat(cell, row){
        return Moment(cell).format("MM/DD")
    }

    popover(){
        $('.js-imagePopOver').off("popover");
        $('.js-imagePopOver').popover({
            html: true,
            trigger: 'hover',
            placement : "auto right",
            content: function () {
                var html = "";
                var cardName = encodeURI($(this).data('name'));
                cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
                var linkBase = "https://mtgcards.file.core.windows.net/cards/";
                var key = "?sv=2015-12-11&ss=f&srt=o&sp=r&se=2017-07-01T10:06:43Z&st=2017-01-03T02:06:43Z&spr=https&sig=dKcjc0YGRKdFH441ITFgI5nhWLyrZR6Os8qntzWgMAw%3D";
                var finalDirectory = linkBase+cardName+".full.jpg" + key;
                html += '<span><img src="'+finalDirectory +'" style="height: 310px; width: 223px"/></span>';
                return html;

            }
        });
    }

    render(){

        if(this.props.listLoading){
            return <div>Loading</div>
        }

        var tableDecksArchetypes = {
            options : {
                sizePerPage : 5,
                hideSizePerPage: true
            },
            data : this.props.List ? [].concat(this.props.List.newestArchetypes, this.props.List.newestDecks) : [],
            pagination : true
        }

        var tableCards = {
            options : {
                sizePerPage : 5,
                paginationSize : 2,
                hideSizePerPage: true,
                afterTableComplete: this.handleTableComplete.bind(this),
            },
            data : this.props.List && this.props.List.newestDecks  ? [].concat(this.props.List.newestCards) : [],
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
                            <TableHeaderColumn dataField="_id" >Name</TableHeaderColumn>
                            <TableHeaderColumn dataField="data" dataFormat={this.dateFormat}>Date</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                    <div className="col-xs-6">
                            <BootstrapTable {...tableCards}>
                                <TableHeaderColumn width="75" dataField="_id" isKey dataFormat={this.formatFormat} dataSort>Format</TableHeaderColumn>
                                <TableHeaderColumn dataField="_id" dataFormat={this.nameFormat}>Name</TableHeaderColumn>
                                <TableHeaderColumn width="65" dataField="data" dataFormat={this.dateFormat} dataSort>Date</TableHeaderColumn>
                            </BootstrapTable>
                    </div>
                </div>
            </div>
        );
    }
}