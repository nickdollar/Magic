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
            position += `(${deck.victory}${deck.loss ? `-${deck.loss}` : "-0"}${deck.draw ? `-${deck.draw}`: ""})`;
        }
        return position;
    }

    trClassFormat(row, rowIndex) {
        if(!this.props.DecksData_id){
            if(row._id == this.props.DecksList[0]._id){
                return "selected"
            }
        }
        if(this.props.DecksData_id == row._id){
            return "selected"
        }
    }

    deckInfo(data, row){
            var deckName = "(Name Pending)";
            if(row.DecksArchetypes_id){
                if(DecksArchetypes.findOne({_id : row.DecksArchetypes_id})){
                    deckName = DecksArchetypes.findOne({_id : row.DecksArchetypes_id}).name;
                }
            }
            return  <div  className="tablePlayerInfo">
                           <div className="deckNameManaWrapper">
                               <div className="deckNamePosition">
                                    <a href={FlowRouter.path("selectedEvent", {format : FlowRouter.getParam("format"), Events_id : FlowRouter.getParam("Events_id"), DecksData_id : row._id})}> {this.positionVictory(row)} {deckName}</a>
                               </div>
                               <div className="manaValues">
                                    {getHTMLColorsFromSubtypesReact({DecksArchetypes_id : row.DecksArchetypes_id})}
                               </div>
                           </div>
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

        var sizePerPage = 8;
        if(this.props.Event){
            if(this.props.Event.EventsTypes_id == "MTGMOLeague"){
                sizePerPage = 10;
            }
        }
        const tableOptions = {
            options : {
                sizePerPage : sizePerPage,
                hideSizePerPage: true,
                paginationSize: 3,
            },
            headerStyle : {display : "none"},
            hideSizePerPage: true,
            data : this.props.DecksList,
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