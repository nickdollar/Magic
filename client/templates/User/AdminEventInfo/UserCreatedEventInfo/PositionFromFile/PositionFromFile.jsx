import React from 'react' ;
import xml2js from "xml2js";
import arraySort from "array-sort";

export default class PositionFromFile extends React.Component {
    constructor(){
        super();
        this.state = {Players : []};
    }

    componentDidMount(){
        $('.js-uploadEventXML').filestyle({
            // buttonName : 'btn-primary',
            buttonText : 'Upload Event File',
            iconName : 'glyphicon glyphicon-upload'
        });
    }

    importFromXML(){
        var file = this.refs["uploadedFile"].files[0];
        var reader = new FileReader();
        reader.onload = (fileLoadEvent)=>{

            xml2js.parseString(reader.result, (err, result)=>{
                var players = result.eventupload.event[0].participation[0].person.map((person)=>{
                    return {name : `${person.$.last}, ${person.$.first}`, id : person.$.id, wins : 0, losses : 0, draws : 0, points : 0, opponents : [], total : 0, DecksData_id : "", preferredName : "", DCINumber : ""}
                });
                var rounds = result.eventupload.event[0].matches[0].round.map((round, index)=>{
                    var matches = round.match.map((match)=>{
                        return match.$
                    })
                    return matches;
                });

                var resultOption = {a210 : "win"}

                rounds.forEach((round)=>{
                    round.forEach((match)=>{
                        var personIndex = players.findIndex((player)=>{
                            return player.id == match.person;
                        })

                        var personOpponent = players.findIndex((player)=>{
                            return player.id == match.opponent;
                        })

                        if(match.outcome == "1"){ //win
                            players[personIndex].wins++;
                            players[personIndex].points += 3;
                            players[personIndex].total++;
                            players[personIndex].opponents.push(players[personOpponent].id);


                            players[personOpponent].losses++;
                            players[personOpponent].total++;
                            players[personOpponent].opponents.push(players[personIndex].id);
                        }else if(match.outcome == "2"){ //draw
                            players[personIndex].draws++;
                            players[personIndex].total++;
                            players[personIndex].points++;
                            players[personIndex].opponents.push(players[personOpponent].id);


                            players[personOpponent].draws++;
                            players[personOpponent].total++;
                            players[personOpponent].points++;
                            players[personOpponent].opponents.push(players[personIndex].id);
                        }else if (match.outcome == "3"){ //bye
                            players[personIndex].wins++;
                            players[personIndex].total++;
                            players[personIndex].points += 3;
                        }
                    })
                })


                for(var i = 0 ; i < players.length; i++){
                    var result = players[i].total ? players[i].wins/players[i].total : 0;
                    players[i].matchWinPercent = result;
                }

                for(var i = 0 ; i < players.length; i++){
                    var total = 0;
                    players[i].opponents.forEach((opponent)=>{
                        var foundOpponent = players.find((player)=>{
                            return opponent == player.id
                        })

                        foundOpponent.matchWinPercent < 0.33 ? total += 0.33 : total += foundOpponent.matchWinPercent;
                    })

                    players[i].total ? players[i].opponentMatchWinPercent = total/players[i].total : players[i].opponentMatchWinPercent = 0;
                }
                for(var i = 0 ; i < players.length; i++){
                    var foundDeck = this.props.Decks.find((deck)=>{
                        return players[i].id == deck.DCINumber
                    })
                    if(foundDeck){
                        players[i].preferredName = foundDeck.player;
                        players[i].DCINumber = foundDeck.DCINumber;
                        players[i].DecksData_id = foundDeck._id;
                    }
                }


                var arraySorted = arraySort(players, ["points", "matchWinPercent", "opponentMatchWinPercent"], {reverse: true})
                for(var i = 0 ; i < arraySorted.length; i++){
                    arraySorted[i].position = i+1;
                }

                this.setState({Players : arraySorted})
            })
        }
        reader.readAsText(file);
    }

    giveNameToDeck({deck, playerIndex}){

        var Players = this.state.Players.concat([]);
        var foundIndex = Players.findIndex((player)=>{
            return player.DecksData_id == deck._id
        })

        if(foundIndex != -1){
            Players[foundIndex].preferredName = "";
            Players[foundIndex].DCINumber = "";
            Players[foundIndex].DecksData_id = "";
        }

        Players[playerIndex].preferredName = deck.player;
        Players[playerIndex].DCINumber = deck.DCINumber;
        Players[playerIndex].DecksData_id = deck._id;

        this.setState({Players : Players});
    }

    updateValues(){

        var arrayOfFilters = this.state.Players.filter((player)=>{
            return player.DecksData_id;
        })

        Meteor.call("updateMultipleLGSDecks", {Players : arrayOfFilters}, (err, response)=>{
            if(this.props.getDecksInfoFromUserEvent){
                this.props.getDecksInfoFromUserEvent();
            }
        })
    }

    render(){

        return(
            <div className="PositionFromFileComponent">


                <div className="input-group"  style={{width : "100%"}}>
                    <input ref="uploadedFile" type="file" className="js-uploadEventXML filestyle" data-icon="false"/>
                    <span className="input-group-btn">
                        <button onClick={this.importFromXML.bind(this)} className="btn btn-secondary" type="button">Import</button>
                    </span>
                </div>
                <button onClick={this.updateValues.bind(this)}>
                    updateValues
                </button>
                <div style={{overflowX : "auto"}}>
                    <table className="table table-responsive" style={{overflowY: "visible !important"}}>
                        <thead>
                            <tr>
                                <th style={{width : "200px"}}></th>
                                <th>preferredName</th>
                                <th>_id</th>
                                <th>Name</th>
                                <th>DCI</th>
                                <th style={{width : "40px"}}>W</th>
                                <th style={{width : "40px"}}>L</th>
                                <th style={{width : "40px"}}>D</th>
                                {/*<th style={{width : "40px"}}>P</th>*/}
                                {/*<th style={{width : "60px"}}>MWP</th>*/}
                                {/*<th style={{width : "60px"}}>OWP</th>*/}
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.Players.map((player, index)=>{
                            return <tr key={player.id}>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                Dropdown
                                                <span className="caret"></span>
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1" style={{position : "relative"}}>
                                                {this.props.Decks.map((deck)=>{
                                                    return <li key={deck.player}><a href="#" onClick={()=>this.giveNameToDeck({deck : deck, playerIndex : index})}>{deck.player} - {deck.DCINumber}</a></li>
                                                })}
                                            </ul>
                                        </div>
                                    </td>
                                    <td>
                                        {player.preferredName}
                                    </td>
                                    <td>
                                        {player.DecksData_id}
                                    </td>
                                    <td>{player.name}</td>
                                    <td>{player.id}</td>
                                    <td>{player.wins}</td>
                                    <td>{player.losses}</td>
                                    <td>{player.draws}</td>
                                    {/*<td>{player.points}</td>*/}
                                    {/*<td>{parseFloat(player.matchWinPercent.toFixed(4))}</td>*/}
                                    {/*<td>{parseFloat(player.opponentMatchWinPercent.toFixed(4))}</td>*/}
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>


            </div>
        );
    }
}