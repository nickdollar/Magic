import React from 'react' ;
import ArchetypeDeckInformationHeader from "./ArchetypeDeckInformationHeader/ArchetypeDeckInformationHeader.jsx"
import DeckTableExample from "./DeckTableExample/DeckTableExample.jsx";
import DeckAggregate from "/client/dumbReact/DeckAggregate/DeckAggregate.jsx";
import Sideboard from "./Sideboard/Sideboard.jsx";

import DecksArchetypesCards from "./DecksArchetypesCards/DecksArchetypesCards.jsx"
import DecksDataDecksArchetypesList from "./DecksDataDecksArchetypesList/DecksDataDecksArchetypesList.jsx";


export default class ArchetypeDeckInformation extends React.Component {
    constructor(props){
        super();
        this.state = {allCards : [], allDecks : [], DeckArchetype : {}, typesSeparated : {max : 0, typesSeparated : {}}, intersectedDecksData_id : [], DecksData_id : ""};
    }

    getCardsList(){
        var DeckArchetype = DecksArchetypes.findOne({Formats_id : this.props.Formats_id, link : this.props.DeckArchetypeLink});

        console.log("ABBBBBBBBBBBBBBBBBBBBBB");
        Meteor.call("DecksArchetypesGetCardsListMethod", {DecksArchetypes_id : DeckArchetype._id}, (err, response)=>{
            var allCards = response.allCards.sort((a, b)=>{
                return b._ids.length - a._ids.length;
            }).map((card, index)=> Object.assign(card, {checked : false, index : index}))
            var DecksData_id = "";
            if(response.allDecks.length){
                DecksData_id = response.allDecks[0]._id;
            }
            this.state.intersectedDecksData_id = response.allDecks.map(decks=>decks._id);
            var typesSeparated = this.createList({allCards : allCards});

            this.setState({allCards : allCards, allDecks : response.allDecks, DeckArchetype : DeckArchetype, typesSeparated : typesSeparated, DecksData_id : DecksData_id});
        })
    }

    componentDidMount(){
        this.getCardsList();
    }

    componentWillReceiveProps(nextProps){

    }

    removeDecks(){
        var selectedCardsIntersectionsArray = this.state.allDecks.map(allDecks=>allDecks._id).concat();
        this.state.allCards.forEach((card)=>{
            if(card.checked){
                selectedCardsIntersectionsArray = _.intersection(selectedCardsIntersectionsArray, card._ids);
            }
        });

        this.state.intersectedDecksData_id = selectedCardsIntersectionsArray;
    }

    checkCard(index){
        var allCards = this.state.allCards.concat();
        allCards[index].checked = !allCards[index].checked;
        this.removeDecks();
        var typesSeparated = this.createList({allCards : allCards});
        this.setState({typesSeparated : typesSeparated})
    }


    findCardType(card){
        console.log(card);
        if(!card.types){return "null"}
        else if (card.types.indexOf("land") != -1)          { return "land"}
        else if (card.types.indexOf("creature") != -1)      { return "creature"}
        else if (card.types.indexOf("artifact") != -1)      { return "artifact"}
        else if (card.types.indexOf("enchantment") != -1)   { return "enchantment"}
        else if (card.types.indexOf("instant") != -1)       { return "instant"}
        else if (card.types.indexOf("planeswalker") != -1)  { return "planeswalker"}
        else if (card.types.indexOf("sorcery") != -1)       { return "sorcery"}
        else {
            return "null"
        }
    }

    createList({allCards}){

        console.log("allcards");
        console.log(allCards);
        console.log(this.state);
        var typesSeparated = {
            null : {array : [], text : "Wrong Name"},
            creature : {array : [], text : "Creature"},
            sorcery : {array : [], text : "Sorcery"},
            instant : {array : [], text : "Instant"},
            planeswalker : {array : [], text : "Planeswalker"},
            artifact : {array : [], text : "Artifact"},
            enchantment : {array : [], text : "Enchantment"},
            land : {array : [], text : "Land"},
        };

        var max = 0;

        console.log(allCards.length);
        for(var i=0; i < allCards.length; i ++){
            var intersectionQty = _.intersection(allCards[i]._ids, this.state.intersectedDecksData_id).length;
            console.log(_.intersection(allCards[i]._ids, this.state.intersectedDecksData_id));
            console.log(intersectionQty);
            if(intersectionQty == 0){
                continue;
            }

            if(max < allCards[i]._ids.length){
                max = allCards[i]._ids.length;
            }

            console.log(allCards[i]);

            typesSeparated[this.findCardType(allCards[i].info)].array.push( {name : allCards[i]._id, qty : _.intersection(allCards[i]._ids, this.state.intersectedDecksData_id).length, checked : allCards[i].checked, index : allCards[i].index});
        }

        for(var key in typesSeparated){
            if(!typesSeparated[key].array.length){
                delete typesSeparated[key];
            }
        }
        console.log("Types Separated");
        console.log(typesSeparated);
        return {maxValue : max, typesSeparated : typesSeparated};
    }

    selectDecksData_id(DecksData_id){
        this.setState({DecksData_id : DecksData_id});
    }

    render(){
        var decksLists = []
        this.state.intersectedDecksData_id.forEach((deck)=>{
            var index = this.state.allDecks.findIndex((allDeck)=>{
                return allDeck._id == deck;
            })

            if(index != -1){
                decksLists.push(this.state.allDecks[index]);
            }
        })


        var DeckArchetype = DecksArchetypes.findOne({link : this.props.DeckArchetypeLink});


        return(
            <div className="ArchetypeDeckInformationComponent">
                <ArchetypeDeckInformationHeader DeckArchetype={DeckArchetype}/>
                    <DecksArchetypesCards   Formats_id={this.props.Formats_id}
                                            checkCard={this.checkCard.bind(this)}
                                            typesSeparated={this.state.typesSeparated}
                    />
                <div className="listAndDecks">
                    <div className="playersList">
                        <DecksDataDecksArchetypesList allDecks={decksLists}
                                                      selectDecksData_id={this.selectDecksData_id.bind(this)}
                                                      DecksData_id={this.state.DecksData_id}


                        />
                    </div>
                    <div className="cardsList">
                            {this.state.DecksData_id ? <DeckAggregate DecksData_id={this.state.DecksData_id}/> : null}
                    </div>
                </div>
                <Sideboard DecksArchetypes_id={DeckArchetype._id}/>
            </div>
        );
    }
}

