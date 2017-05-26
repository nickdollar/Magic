import React from 'react' ;
import Moment from "moment";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

export default class DecksList extends React.Component {
    constructor(props){
        super();
    }

    results(row){
        var position = "";
        if(row.position != null){
            position += prettifyPosition(row.position) + " ";
        }

        if(row.victory != null){
            position += row.victory;
            if(row.loss != null){
                position += "-" + row.loss;
                if(row.draw != 0){
                    position += "-" + row.draw;
                }
            }
        }
        return position;
    }

    sortFunc(a,b, order){
        return b.date - a.date;
    }

    deckInfo(cell, row){
        return  <div className={cell == this.props.DecksData_id ? "deckInfo selected" : "deckInfo"}>
            <div onClick={()=>this.props.selectADeckHandle(row._id)}>
                {getLinkFormat(row.Formats_id)} - {row.name}
            </div>
        </div>
    }

    componentWillReceiveProps(nextProps){

    }

    componentDidMount(){

    }

    render(){
        const tableOptions = {
            options : {
                sizePerPage : 8,
                hideSizePerPage: true,
            },
            data : this.props.DecksLists,
            pagination : true,
            headerStyle : {display: "none"}
        }

        return(
            <div className="DecksNamesDecksDataListComponent">
                <BootstrapTable {...tableOptions}>
                    <TableHeaderColumn isKey dataField="_id" dataFormat={this.deckInfo.bind(this)}>Player</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}