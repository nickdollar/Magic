import React from 'react' ;
import DeckEditStandalone from '/client/dumbReact/DeckEditStandalone/DeckEditStandalone.jsx' ;
import Moment from "moment";
import AddEvent from "./AddEvent/AddEvent.jsx";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import UserCreatedEventInfo from "./UserCreatedEventInfo/UserCreatedEventInfo.jsx";


export default class AdminEventInfo extends React.Component {
    constructor(props){
        super();
        this.state = {
            userAdmin : false,
            changes : false,
            Events : [],
            selectedRow_id : {}
        }
    }
    getUsersCreatedEvent(){
        Meteor.call("getUsersCreatedEventsMethod", (err, response)=>{
            this.setState({Events : response});
        })
    }

    componentDidMount(){
        this.getUsersCreatedEvent();
    }

    expandComponent(row){
        return <UserCreatedEventInfo Events_id={row._id}/>;
    }

    isExpandableRow (row){
        return this.state.selectedRow_id[row._id];
    }

    componentWillUnmount(){

    }

    publishEvent({e, row}){
        e.stopPropagation();
        var events = this.state.Events.concat();
        var index = events.findIndex((event)=>{return event._id == row._id;})
        var nextState = "";

        if(row.state == "lgsCreated"){
            nextState = "pending";
        }else{
            nextState = "lgsCreated"
        }
        Meteor.call("publishUsersEvent", {Events_id : events[index]._id, nextState : nextState}, (err, response)=>{
            events[index].state = nextState;
            this.setState({Events : events});
        });
    }

    formatPublishEvent(cell, row){

        if(row.state == "names"){
            return "locked";
        }
        return <button className="btn btn-xs" onClick={(e)=>{e.stopPropagation(); this.publishEvent({e : e, row: row})}}>{row.state != "lgsCreated" ? "unpublish" : "publish"}</button>
    }

    deleteEvent({e, row}){
        var events = this.state.Events.concat();
        var index = events.findIndex((event)=>{return event._id == row._id;})
        if(row.remove){
            Meteor.call("removeUsersEventsMethod", {Events_id : events[index]._id}, (err, response)=>{
                // events.splice(index, 1)
                events[index].state = "removed";
                this.setState({Events : events});
            });
            return;
        }
        events[index].remove = true;
        this.setState({Events : events});
    }

    remove(cell, row){
        if(row.state=="names"){
            return <button className={`btn btn-xs ${row.remove ? "btn-danger": "btn-warning"}`} disabled={row.state=="names" ? true : false} onClick={(e)=>{e.stopPropagation(); this.deleteEvent ({e:e, row : row})}}>{row.remove ? "confirm" : "remove"}</button>
        }
        return null;
     }

    expand(row){
        var selectedRow_id = Object.assign({}, this.state.selectedRow_id);
        if(selectedRow_id[row._id]){
            selectedRow_id[row._id] = false;
        }else{
            selectedRow_id[row._id] = true;
        }
        this.setState({selectedRow_id : selectedRow_id});
    }

    formatExpand(cell, row){
        return <button className="btn btn-xs" style={{width : "100%"}} onClick={()=>this.expand(row)}>+</button>
    }

    formatLink(cell, row){
        return <a href={FlowRouter.path("selectedEvent", {format : row.Formats_id, Events_id : cell})}>link</a>
    }

    formatDate(cell, row){
        return Moment(cell).format("MM-DD");
    }



    render() {
        const options = {
            data : this.state.Events,
            options : {
                expandBy: 'column'
            },
            expandComponent : this.expandComponent.bind(this),
            expandableRow : this.isExpandableRow.bind(this),
        }

        return (
            <div className="AdminEventPlayerListComponent">
                <div>
                    <div>States: lgsCreated->pending->published->names</div>
                    <div>lgsCreated: New deck can be added.</div>
                    <div>pending: No new decks can be added after this point, waiting admin approval.</div>
                    <div>published: Accepted by admin.</div>
                    <div>names: Decks have names and is part of the Crowdmtg.com.</div>
                    <div>Removes: Will be deleted after 48 hours</div>

                </div>
                <BootstrapTable {...options}>
                    <TableHeaderColumn dataField="_id"                             dataFormat={this.formatExpand.bind(this)}>+</TableHeaderColumn>
                    <TableHeaderColumn dataField="_id"          expandable={false} dataFormat={this.formatLink} isKey >_id</TableHeaderColumn>
                    <TableHeaderColumn dataField="name"         expandable={false}>name</TableHeaderColumn>
                    <TableHeaderColumn dataField="date"         expandable={false} dataFormat={this.formatDate}>Date</TableHeaderColumn>
                    <TableHeaderColumn dataField="token"        expandable={false}>Token</TableHeaderColumn>
                    <TableHeaderColumn dataField="Formats_id"   expandable={false}>Format</TableHeaderColumn>
                    <TableHeaderColumn dataField="state"        expandable={false}>State</TableHeaderColumn>
                    <TableHeaderColumn dataField="_id"          expandable={false} dataFormat={this.formatPublishEvent.bind(this)} >Publish</TableHeaderColumn>
                    <TableHeaderColumn dataField="_id"          expandable={false} dataFormat={this.remove.bind(this)} >Remove</TableHeaderColumn>
                </BootstrapTable>
            <AddEvent getUsersCreatedEvent={this.getUsersCreatedEvent.bind(this)}/>
            </div>
        )
    }
}