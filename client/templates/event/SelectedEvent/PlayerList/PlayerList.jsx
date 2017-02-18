import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


export default class PlayerList extends React.Component {
    constructor(){
        super();

    }

    positionVictory(deck){
        var position = "";
        if(deck.position){
            position += prettifyPosition(deck.position)
        }

        if(deck.victory != null){
            position += "("+ deck.victory;

            if(deck.loss){
                position += "-" + deck.loss;

            }else{
                position += "-0";
            }
            if(deck.draw){
                position += "-" + deck.draw;
            }

            position += ")";
        }
        return position;
    }

    trClassFormat(row, rowIndex) {
        if(!this.props.selectedDeck){
            if(row._id == this.props.Players[0]._id){
                return "selected"
            }

        }

        if(this.props.selectedDeck == row._id){
            return "selected"
        }
    }


    shouldComponentUpdata(nextProps, nextState){
        if(!nextProps.listLoading ){
            return true;
        }
            return false;
    }

    deckInfo(data, row){
            var deckName = "(Name Pending)";
            if(row.DecksNames_id){
                if(DecksNames.findOne({_id : row.DecksNames_id})){
                    deckName = DecksNames.findOne({_id : row.DecksNames_id}).name;
                }
            }

            var colors = getHTMLColors(row.colors);

            return  <div  className="tablePlayerInfo">
                        <div><a href={FlowRouter.path("selectedEvent", {format : row.format, Events_id : row.Events_id, DecksData_id : row._id})}> {this.positionVictory(row)} {deckName}</a> <span dangerouslySetInnerHTML={{__html : colors}}></span></div>
                        <div>{row.player ? row.player : "Missing Name"}</div>
                    </div>
    }

    sortFunc(a, b, order){
        if(!a.position) return 1;
        if(a.position){
            return a.position - b.position;
        } else if (a.victory){
            return a.victory - b.victory;
        }
    }

    render(){
        this.props.Players.sort(this.sortFunc);


        console.log(this.props.Players)
        const tableOptions = {
            options : {
                sizePerPage : 8,
                hideSizePerPage: true,
                paginationSize: 3,
            },

            headerStyle : {display : "none"},
            hideSizePerPage: true,
            data : this.props.Players,
            pagination : true,
            ignoreSinglePage : true,
            trClassName : this.trClassFormat.bind(this)
        }

        return(
            <div className="PLayerListComponent">
                <BootstrapTable {...tableOptions}>
                    <TableHeaderColumn isKey dataField="_id" hidden >AAA</TableHeaderColumn>
                    <TableHeaderColumn dataField={"position"} dataFormat={this.deckInfo.bind(this)}>Players</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}

//
// <ul className="list-group">
//     {this.props.Players.map((deck)=>{
//         var deckName = "Name Pending";
//         if(deck.DecksNames_id){
//             if(DecksNames.findOne({_id : deck.DecksNames_id})){
//                 deckName = DecksNames.findOne({_id : deck.DecksNames_id}).name;
//             }
//         }
//         var colors = getHTMLColors(deck.colors);
//         return <li key={deck._id} className="list-group-item">
//             <div><a href={FlowRouter.path("selectedEvent", {format : deck.format, Events_id : deck.Events_id, DecksData_id : deck._id})}> {this.positionVictory(deck)} {deckName}</a> <span dangerouslySetInnerHTML={{__html : colors}}></span></div>
//             <div>{deck.player}</div>
//         </li>
//     })}
// </ul>