import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class ValuesTable extends React.Component {
    constructor(){
        super();

    }

    nameColumnFormatter(cell, row){
        var change = "";
        if(row.positionChange== 999){
            change = "";
        }else if(row.positionChange== 0){
            change = "square";
        }else if(row.positionChange > 0){
            change = "upArrow";
        }else{
            change = "downArrow";
        }
        var archetypeName = DecksArchetypes.findOne({_id : row._id}).name;

        var position = row.positionChange;
        if(row.positionChange==999){
            position = "NEW";
        }


        return  <div>
                    <span>
                        <a href={"/decks/" + FlowRouter.getParam("format") + "/" + replaceTokenWithDash(archetypeName)}> { archetypeName }  </a>
                    </span>
            <div className="positionChange"><span> {position} </span><span className={change}></span></div>
        </div>
    }

    percentageColumn(cell, row){
        if(this.props.totalDecks==0){
            return 0;
        }
        return prettifyPercentage(cell/this.props.totalDecks, 2) + "%";
    }

    colorsColumn(cell, row){

        return getHTMLColorsFromArchetypes(row._id);
    }

    typeColumns(cell, row){
        return DecksArchetypes.findOne({_id : row._id}).type.toTitleCase();
    }

    render(){

        const options =
            {
                options : {
                    pagination : true,
                    sizePerPage : 20,
                    paginationSize : 2,
                    defaultSortName : "position",
                    defaultSortOrder : "asc"
                },
                data : this.props.tableData,
                pagination : true

        }

        return(
            <div className="ValuesTableComponent">
                <BootstrapTable {...options}>
                    <TableHeaderColumn width="30" dataAlign='center' dataField="position" dataSort>#</TableHeaderColumn>
                    <TableHeaderColumn dataField="_id" isKey dataFormat={this.nameColumnFormatter.bind(this)} dataSort>Archetype</TableHeaderColumn>
                    <TableHeaderColumn dataAlign='center' width="74" dataField="quantity" dataFormat={this.percentageColumn.bind(this)}>%</TableHeaderColumn>
                    <TableHeaderColumn width="96" dataAlign='center' dataField="_id" dataFormat={this.colorsColumn.bind(this)}>Colors</TableHeaderColumn>
                    <TableHeaderColumn width="80" dataAlign='center' dataField="_id" dataFormat={this.typeColumns.bind(this)}>Type</TableHeaderColumn>
                </BootstrapTable>

            </div>
        );
    }
}