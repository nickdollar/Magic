import React from 'react' ;
import Moment from "moment";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

export default class DecksNamesDecksDataList extends React.Component {
    constructor(props){
        super();
        this.state = {DecksList : [], SelectedDeck : ""};
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

    setSelectedDeck(_id){
        this.props.selectedDeckHandle(_id);
        this.setState({SelectedDeck : _id});
    }

    deckInfo(cell, row){
        return  <div className={cell == this.state.SelectedDeck ? "deckInfo selected" : "deckInfo"}>
                    <div onClick={()=>this.setSelectedDeck(row._id)}>
                        {this.results(row)} - {row.player}
                    </div>
                    <div>
                        <a href={FlowRouter.path("selectedEvent", {format : FlowRouter.getParam("format"), Events_id : row.Events_id, DecksData_id : row._id})}> {EventsTypes.findOne({_id : row.EventsTypes_id}).short} {Moment(row.date).format("MM/DD")}</a>
                    </div>
                </div>
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.DeckName._id != this.props.DeckName._id){
            this.getNewList(nextProps.DeckName._id);
        }
    }

    getNewList(DeckNames_id){
        Meteor.call("getDecksListFromDeckName", DeckNames_id, (err, data)=>{
            if(data.length){
                this.props.selectedDeckHandle(data[0]._id);
                this.state.SelectedDeck = data[0]._id;
            }else{
                this.props.selectedDeckHandle("");
            }
            this.setState({DecksList : data})
        });
    }

    componentDidMount(){
        this.getNewList(this.props.DeckName._id);
    }

    render(){
        const tableOptions = {
            options : {
                sizePerPage : 8,
                hideSizePerPage: true,
                defaultSortName: '_id',
                defaultSortOrder : "asc"
            },
            data : this.state.DecksList,
            pagination : true,
            headerStyle : {display: "none"}
        }

        return(
            <div className="DecksNamesDecksDataListComponent">
                <BootstrapTable {...tableOptions}>
                    <TableHeaderColumn isKey dataField="_id" dataSort sortFunc={this.sortFunc} dataFormat={this.deckInfo.bind(this)}>Player</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}