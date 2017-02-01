import React from 'react' ;
import DeckListContainer from '/client/dumbReact/DeckEdit/DeckEditContainer.jsx' ;
import Moment from "moment";

class PlayerList extends React.Component {
    constructor(){
        super();
        this.state = {
            showDecks : []
        }

    }

    removeDeck(DecksData_id){
        Meteor.call("removeDeckFromLGSEvent", DecksData_id);
    }

    updateResults(){
    console.log($(this.refs["table"]).find("tr"));
}

    addRowBelow(DecksData_id){
        console.log(DecksData_id);
    }

    addRemoveBelow(DecksData_id){
        console.log(DecksData_id);
    }

    componentWillReceiveProps(nextProps){
        
    }


    toggleShowDeck(DecksData_id){

        var index = this.state.showDecks.findIndex((showDeckObj)=>{
            return showDeckObj == DecksData_id;
        });

        var showDecks = this.state.showDecks.concat();

        if(index > -1){
            console.log(index);
            console.log(showDecks.splice(index, 1));
            console.log(showDecks);
            this.setState({showDecks : showDecks});
        }else{
            showDecks = this.state.showDecks.concat([DecksData_id]);
            this.setState({showDecks : showDecks});
        }
    }

    confirm(e) {
        var row = $(e.target).closest("tr").find("input");
        var rowObject = {}
        var DecksData_id = e.target.getAttribute("data-_id");

        rowObject.player = row[0].value;
        rowObject.position = row[1].value;
        rowObject.victory = row[2].value;
        rowObject.loss = row[3].value;
        rowObject.draw = row[4].value;

        Meteor.call("updatePlayerFromAdmin", DecksData_id, rowObject, ()=>{
            this.forceUpdate();
        });

    }

    publish(){
        Meteor.call("publishLGSEvent", FlowRouter.getParam("event_id"), ()=>{

        });
    }
    
    render() {
        if(!this.props.decks){
            return <div>loading...</div>
        }
        var rows = this.props.decks.map((DeckData)=>{
            var index = this.state.showDecks.findIndex((showDeckObj)=>{
                    return showDeckObj == DeckData._id;
                })
            var eventDeck;
            eventDeck = <span onClick={this.toggleShowDeck.bind(this, DeckData._id)}> {index == -1 ? "Show" : "Hide"}</span>

            var rowInfo = <tr>
                            <td>
                                {eventDeck}
                            </td>
                            <td>
                                <input type="text" defaultValue={DeckData.player}/>
                            </td>
                            <td>
                                <input type="number" className="inputNumber" min="0" defaultValue={DeckData.position == null ? 0 : DeckData.position }/>
                            </td>
                            <td>
                                <input type="number" className="inputNumber" min="0" defaultValue={DeckData.victory == null ? 0 : DeckData.victory }/>
                            </td>
                            <td>
                                <input type="number" className="inputNumber" min="0" defaultValue={DeckData.loss == null ? 0 : DeckData.loss }/>
                            </td>
                            <td>
                                <input type="number" className="inputNumber" min="0" defaultValue={DeckData.draw == null ? 0 : DeckData.draw }/>
                            </td>
                            <td>
                                <button onClick={this.confirm.bind(this)}>Confirm</button>
                            </td>
                            <td>
                                <button onClick={this.removeDeck.bind(this, DeckData._id)}>remove</button>
                            </td>

                        </tr>
            if(index != -1){
                return <tbody key={DeckData._id}>
                            {rowInfo}
                            <tr>
                                <td colSpan="7"><DeckListContainer DecksData_id={DeckData._id}/></td>
                            </tr>
                        </tbody>
            }
            return <tbody key={DeckData._id}>
                        {rowInfo}
                    </tbody>
        })
        return (
                <div>
                    <div>
                        {this.props.event.state == "prePublish" ? <div>Published At : {Moment(this.props.event.publishedDate).format("L")}</div> :
                            <div><button disabled={this.props.event.state == "published" ? true : false}
                                    className="btn btn-xs"
                                    onClick={this.publish.bind(this)}>Publish Event</button>
                                 <span> You still Can modify for the 48 hours. Will be published after Mod Confirm</span>
                            </div>
                        }




                    </div>
                    <table ref="table" className="table table-sm">
                        <thead>
                            <tr>
                                <th>Deck</th>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Wins</th>
                                <th>Losses</th>
                                <th>Draws</th>
                                <th>Confirm</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                            {rows.map((row)=>{
                                return row;
                            })}
                    </table>
                </div>
        )
    }
}

export default PlayerList;