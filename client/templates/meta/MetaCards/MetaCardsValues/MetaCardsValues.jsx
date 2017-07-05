import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class MetaCardsValues extends React.Component {
    constructor(){
        super();

    }

    percentageColumn(cell, row){
        if(this.props.totalDecks==0){
            return 0;
        }
        return prettifyPercentage(cell/this.props.totalDecks, 1) + "%";
    }

    avgColumn(cell, row){
        if(this.props.totalDecks==0){
            return 0;
        }
        return (cell/row.count).toFixed(1);
    }

    componentDidMount(){
        cardPopover(".js-MetaCardValuesImagePopover", true);
    }

    nameFormat(cell, row){
        return <div className="js-MetaCardValuesImagePopover" data-name={cell}>{cell}</div>
    }

    handleTableComplete(){
        cardPopover(".js-MetaCardValuesImagePopover", true);
    }

    render(){
        const options =
            {
                options : {
                    pagination : true,
                    sizePerPage : 8,
                    paginationSize : 1,
                    defaultSortName : "count",
                    defaultSortOrder : "desc",
                    afterTableComplete: this.handleTableComplete
                },
                data : this.props.tableData,
                pagination : true
        }

        return(
            <div className="MetaCardsValuesComponent">
                <BootstrapTable {...options}>
                    <TableHeaderColumn dataField="Cards_id" isKey dataFormat={this.nameFormat}>Card</TableHeaderColumn>
                    <TableHeaderColumn width="50" dataField="total" dataFormat={this.avgColumn.bind(this)}>Avg.</TableHeaderColumn>
                    <TableHeaderColumn width="60" dataField="count" dataFormat={this.percentageColumn.bind(this)}>%</TableHeaderColumn>
                </BootstrapTable>

            </div>
        );
    }
}