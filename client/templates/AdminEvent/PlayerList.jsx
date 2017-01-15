import React from 'react' ;
import DeckListContainer from './DeckListContainer' ;


class PlayerList extends React.Component {
    constructor(){
        super();
        this.state = {
            showDecks : []
        }

    }

    removeDeck(e){
        Meteor.call("removeDeckFromLGSEvent", e.target.getAttribute("data-_id"));
    }

    updateResults(){
    console.log($(this.refs["table"]).find("tr"));
}

    addRowBelow(e){
        console.log(e.target.getAttribute("data-_id"));
    }

    addRemoveBelow(e){
        console.log(e.target.getAttribute("data-_id"));
    }

    componentWillReceiveProps(nextProps){
        
    }


    addDeckToShowList(e){

        var DecksData_id = e.target.getAttribute("data-_id");


        var index = this.state.showDecks.findIndex((showDeckObj)=>{
            return showDeckObj == DecksData_id;
        });

        if(index != -1){
            return;
        }


        var deckList = this.state.showDecks.concat([DecksData_id]);
        this.setState({showDecks : deckList});
    }

    removeDeckToShowList(e){
        var DecksData_id = e.target.getAttribute("data-_id");


        var index = this.state.showDecks.findIndex((showDeckObj)=>{
            return showDeckObj == DecksData_id;
        });

        if(index > -1){
            var deckList = this.state.showDecks.concat();
            deckList.splice(index, 1);
            this.setState({showDecks : deckList});
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
            if(index == -1){
                eventDeck = <span data-_id={DeckData._id} onClick={this.addDeckToShowList.bind(this)}>Deck </span>

            }else {
                eventDeck = <span data-_id={DeckData._id} onClick={this.removeDeckToShowList.bind(this)}>Deck </span>
            }

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
                                <button data-_id={DeckData._id} onClick={this.confirm.bind(this)}>Confirm</button>
                            </td>
                            <td>
                                <button data-_id={DeckData._id} onClick={this.removeDeck.bind(this)}>remove</button>
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
                        
                    </div>
                    <div>
                        <button onClick={this.publish.bind(this)}>Publish Event</button> <span>You still Can modify for the 48 hours. Will be published after Mod Confirm</span>
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