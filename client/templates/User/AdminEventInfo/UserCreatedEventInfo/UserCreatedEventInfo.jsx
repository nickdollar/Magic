import React from 'react' ;
import ModalFirstPage  from '/client/dumbReact/Modal/ModalFirstPage.jsx'
import DeckAggregate from '/client/dumbReact/DeckAggregate/DeckAggregate.jsx';
import PositionFromFile from './PositionFromFile/PositionFromFile.jsx';

export default class AdminEventPlayerList extends React.Component {
    constructor(){
        super();
        this.state = {Decks : [], DecksData_id : "", showModalDeckAggregate: false, PositionFromFile : false}
    }

    getDecksInfoFromUserEvent(){
        Meteor.call("getDecksInfoFromUserEventMethod", {Events_id : this.props.Events_id}, (err, response)=>{
            this.setState({Decks : response});
        })
    }

   selectChange({target, dataField, DecksData_id}){
       Meteor.call("eventOwnerDeckEdit", {DecksData_id : DecksData_id, dataField : dataField, value : target.value});
   }

    position({dataField, cell, row}) {


        var options = [];
        for(var i = 0; i <20; i++){
            options.push(i);
        }

        if(this.props.EventsState == "names"){
            return "";
        }

        return <select defaultValue={cell} onChange={(e)=>this.selectChange({target : e.target, dataField : dataField, DecksData_id : row._id})}>
                <option value={"clear"}>Clear</option>;
                {options.map((number)=>{
                    return <option className="" key={number} value={number}>{number}</option>;
                })}
               </select>
    }

    componentDidMount(){
        this.getDecksInfoFromUserEvent();
    }

    formatRemoveDeck(cell, row){
        if(this.props.EventsState != "names"){
            return <button onClick={()=>{Meteor.call("removeLGSEventDeckMethod", {DecksData_id : row._id}, (err, response)=>{
                this.getDecksInfoFromUserEvent();
                {/*this.props.getUsersCreatedEvent();*/}
            })}} className="btn btn-xs">remove</button>
        }
        return "";

    }

    //Deck Aggregate
    handleHideDeckAggregate(){
        this.setState({showModalDeckAggregate: false})
    }
    handleShowModalDeckAggregate({row}){
        this.setState({showModalDeckAggregate: true, DecksData_id : row._id});
    }

    //PositionFromFile
    handleHidePositionFromFile(){
        this.setState({PositionFromFile: false})
    }

    handleShowModalPositionFromFile({row}){
        this.setState({PositionFromFile: true});
    }

    formatDeck(cell, row){
        return <button className="btn btn-xs" onClick={()=>this.handleShowModalDeckAggregate({row: row})}>Show</button>
    }

    render(){
        const options = {
            data : this.state.Decks
        }

        var that = this;
        return(
            <div className="UserCreatedEventInfo">
                {this.props.EventsState == "names" ? "" : <button   onClick={this.handleShowModalPositionFromFile.bind(this)}>Import Results</button>}
                <BootstrapTable {...options}>
                    <TableHeaderColumn dataField="_id" dataFormat={this.formatDeck.bind(this)}>Deck</TableHeaderColumn>
                    <TableHeaderColumn dataField="DCINumber">DCINumber</TableHeaderColumn>
                    <TableHeaderColumn isKey dataField="player" >Player</TableHeaderColumn>
                    <TableHeaderColumn dataField="position" dataFormat={(cell, row)=>{return this.position({dataField : "position", cell : cell, row : row})}}>Position</TableHeaderColumn>
                    <TableHeaderColumn dataField="victory"  dataFormat={(cell, row)=>{return this.position({dataField : "victory", cell : cell, row : row})}}>Victory</TableHeaderColumn>
                    <TableHeaderColumn dataField="loss" dataFormat={(cell, row)=>{return this.position({dataField : "loss", cell : cell, row : row})}}>Losses</TableHeaderColumn>
                    <TableHeaderColumn dataField="draw"    dataFormat={(cell, row)=>{return this.position({dataField : "draw", cell : cell, row : row})}}>Draws</TableHeaderColumn>
                    <TableHeaderColumn dataField="_id"    dataFormat={this.formatRemoveDeck.bind(this)}>Remove</TableHeaderColumn>
                </BootstrapTable>
                <ModalFirstPage showModal={this.state.showModalDeckAggregate}
                                handleHideModal={this.handleHideDeckAggregate.bind(this)}
                                title="" >
                    <DeckAggregate DecksData_id={this.state.DecksData_id}
                    />
                </ModalFirstPage>
                <ModalFirstPage showModal={this.state.PositionFromFile}
                                handleHideModal={this.handleHidePositionFromFile.bind(this)}
                                title="Import From XML"
                >
                    <PositionFromFile
                        Decks={this.state.Decks}
                        getDecksInfoFromUserEvent={this.getDecksInfoFromUserEvent.bind(that)}
                    />
                </ModalFirstPage>
            </div>
        );
    }
}