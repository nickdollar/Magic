import React from 'react' ;
import DeckEditStandalone from '/client/dumbReact/DeckEditStandalone/DeckEditStandalone.jsx' ;
import Moment from "moment";

export default class AdminEventInfo extends React.Component {
    constructor(props){
        super();
        this.state = {
            showDecks : [],
            userAdmin : false,
            decks : props.decks ? props.decks : [],
            changes : false,
        }
    }

    toggleShowDeck(DecksData_id){
        var index = this.state.showDecks.findIndex((showDeckObj)=>{
            return showDeckObj == DecksData_id;
        });

        var tempShowDecks = this.state.showDecks.concat();

        if(index > -1){
            tempShowDecks.splice(index, 1)
            this.setState({showDecks : tempShowDecks});
        }else{
            tempShowDecks.push(DecksData_id);
            this.setState({showDecks : tempShowDecks});
        }
    }

    getAllDeckFromEvent(){

    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps);
        var decks = this.state.decks.concat([]);
        for(var i = 0; i < nextProps.decks; i++){
            var index = decks.findIndex(deck=>{
                return deck._id == nextProps.decks[i];
            })
            if(index == -1){
                decks.push(nextProps.decks);
            }
        }

        console.log("DECKS");
        console.log(nextProps);
        console.log(decks);
        this.setState({decks : decks});
    }

    componentDidMount(){
        if(Roles.userIsInRole(Meteor.user(), "admin")){
            this.setState({userAdmin : true});
        }
    }

    adminConfirm(){
        Meteor.call("confirmLGSPrePublish", FlowRouter.getParam("Event_id"), (err, data)=>{

        });
    }

    publish(){
        Meteor.call("publishLGSEvent", FlowRouter.getParam("Event_id"), ()=>{

        });
    }

    eventsButtonStatus(state){

        var results = {
            published : "Unpublish and Unlock",
            locked : "Unpublish and Unlock",
            created : "Lock And Request",
        }

        return results[state];
    }

    stateLegend(state){
        var results = {
            created : "Created - Decks can be Added",
            published : "Published - Admin confirmed. Event is public now.",
            locked : "Locked - Decks Cannot be added. Decks Data Can be Edited",
        }
        return results[state];
    }

    position(){
        return <input type="number"/>
    }

    nameChange(value, index){
        var decks = this.state.decks.concat();
        decks[index].player = value;

        this.setState({changes : true, decks : decks});
    }

    positionChange(value, index){

        var decks = this.state.decks.concat();

        var value = parseInt(value);
        if(isNaN(value)){
            value = 0;
        }
        decks[index].position = value;

        this.setState({changes : true, decks : decks});
    }

    victoryChange(value, index){
        var decks = this.state.decks.concat();
        var value = parseInt(value);
        if(isNaN(value)){
            value = 0;
        }
        decks[index].victory = value;
        this.setState({changes : true, decks : decks});
    }

    lossChange(value, index){
        var decks = this.state.decks.concat();
        var value = parseInt(value);
        if(isNaN(value)){
            value = 0;
        }
        decks[index].loss = value;
        this.setState({changes : true, decks : decks});
    }

    drawChange(value, index){
        var decks = this.state.decks.concat();
        var value = parseInt(value);
        if(isNaN(value)){
            value = 0;
        }
        decks[index].draw = value;
        this.setState({changes : true, decks : decks});
    }

    confirmChanges(){
        var decks = this.state.decks.map((deck)=>{
            return {_id : deck._id, player : deck.player, position : deck.position ? deck.position : 0, victory : deck.victory ? deck.victory : 0, loss : deck.loss ? deck.loss : 0, draw : deck.draw ? deck.draw : 0}
        });

        Meteor.call("confirmEventAdminChanges", {decks : decks}, (err, response)=>{
            this.setState({changes : false});
        });
    }

    render() {
        if(!this.props.decks){
            return <div>loading...</div>
        }
        var rows = this.state.decks.map((deck, index)=>{
            var indexShow = this.state.showDecks.findIndex((showDeckObj)=>{
                return showDeckObj == deck._id;
            })


            var eventDeck = <span onClick={()=>this.toggleShowDeck(deck._id)}> {indexShow == -1 ? "Show" : "Hide"}</span>;

            var rowInfo = <tr>
                <td>{eventDeck}</td>
                <td><input type="text" onChange={(e)=>this.nameChange(e.target.value, index)} value={deck.player}/></td>
                <td><input type="number" className="inputNumber" min="0" onChange={(e)=>this.positionChange(e.target.value, index)} value={deck.position == null ? 0 : deck.position}/></td>
                <td><input type="number" className="inputNumber" min="0" onChange={(e)=>this.victoryChange(e.target.value, index)} value={deck.victory == null ? 0 : deck.victory}/></td>
                <td><input type="number" className="inputNumber" min="0" onChange={(e)=>this.lossChange(e.target.value, index)} value={deck.loss == null ? 0 : deck.loss }/></td>
                <td><input type="number" className="inputNumber" min="0" onChange={(e)=>this.drawChange(e.target.value, index)} value={deck.draw == null ? 0 : deck.draw }/></td>
                <td><button className="btn">Remove</button></td>

            </tr>
            if(indexShow != -1){
                return <tbody key={deck._id}>
                {rowInfo}
                <tr><td colSpan="7"><DeckEditStandalone DecksData_id={deck._id}/></td></tr>
                </tbody>
            }
            return <tbody key={deck._id}>
            {rowInfo}
            </tbody>
        })
        console.log("STATE");

        console.log(this.state);

        return (
            <div className="AdminEventPlayerListComponent">
                <div>
                    <div>Event Will be published after request made and Admin Confirmation</div>
                    {this.state.userAdmin ? <button onClick={this.adminConfirm}>Publish</button> : null}
                    <div>Published At : {this.props.event.publishedDate ? Moment(this.props.event.publishedDate).format("MM/DD HH:MM") : "Not Published Yet"} - This Event Will Be Permanently locked after 2 days. Non locked Event Will be discarded.</div>
                    <div>State: {this.stateLegend(this.props.event.state)}</div>
                    <div><button className="btn btn-xs" onClick={this.publish.bind(this)}>{this.eventsButtonStatus(this.props.event.state)}</button></div>
                </div>
                <button className="btn" onClick={this.confirmChanges.bind(this)} disabled={!this.state.changes}>{this.state.changes ? "Confirm Changes" : "No changes"}</button>
                <table ref="table" className="table table-sm">
                    <thead>
                    <tr>
                        {["Deck", "Player", "Position", "Wins", "Losses", "Draws", "Remove"].map(head => <th key={head}>{head}</th>)}
                    </tr>
                    </thead>
                    {rows.map((row)=>{
                        return row;
                    })}
                </table>
                <div>

                </div>
            </div>
        )
    }
}