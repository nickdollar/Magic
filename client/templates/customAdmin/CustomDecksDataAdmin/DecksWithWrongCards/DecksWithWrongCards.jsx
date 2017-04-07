import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class DecksWithWrongCards extends React.Component {
    constructor(){
        super();

    }

    recheckDeckWithWrongCardName(){
        Meteor.call("recheckDeckWithWrongCardName", this.props.format);
    }

    render(){
        const tableOptions = {
        options : {
            sizePerPage : 8,
            hideSizePerPage: true,
            paginationSize: 3,
        },
        hideSizePerPage: true,
        data : this.props.DecksWithWrongCards,
        pagination : true,
        ignoreSinglePage : true
    }
        return(
            <div>
                <div>Decks With Wrong Cards</div>
                <button onClick={this.recheckDeckWithWrongCardName.bind(this)}>Fix Decks With Wrong Cards</button>
                <div className="DecksWithWrongCardsComponent">
                    <BootstrapTable {...tableOptions} height='256px'>
                        <TableHeaderColumn isKey dataField="_id">_id</TableHeaderColumn>
                        <TableHeaderColumn width="220" dataField="DecksNames_id">Events</TableHeaderColumn>
                        <TableHeaderColumn dataField="Formats_id">Format</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        );
    }
}