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

    componentDidMount() {
        this.popover();
    }

    componentDidUpdate() {
        this.popover();
    }
    handleTableComplete(){
        this.popover();
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