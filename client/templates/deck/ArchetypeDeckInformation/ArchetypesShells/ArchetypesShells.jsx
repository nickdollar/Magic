import React from 'react' ;
import DecksNamesDecksDataList from "./DecksNamesDecksDataList/DecksNamesDecksDataList.jsx";
import DecksCardsList from "./DecksCardsList/DecksCardsList.jsx";
import DeckAggregate from "/client/dumbReact/DeckAggregate/DeckAggregate.jsx";

export default class ArchetypesShells extends React.Component {
    constructor(){
        super();
        this.state = {selectedCards : [], DecksData_id : "", DecksNames_id : "", DecksDataList : [], typesSeparated : null}
    }

    getDecksDataList(){
        Meteor.call("getDecksDataFromArchetypes_idFormatCards", {selectedCards : this.state.selectedCards, DecksArchetypes_id : this.props.DeckArchetype._id},
            (err, response)=>{
                var dataSort = response.sort((a, b)=>{
                    return b.date - a.date
                });;

                var DecksData_id = "";

                if(response.length){
                    DecksData_id = dataSort[0]._id;
                }else{
                    DecksData_id = "";
                }
                this.setState({DecksDataList : dataSort, DecksData_id : DecksData_id})
            })
    }

    getAllCardsFromDeckArchetype(){
        Meteor.call("getAllCardsFromDeckArchetypeMethod",
            {selectedCards : this.state.selectedCards,
            DecksArchetypes_id : this.props.DeckArchetype._id},
            (err, response)=>{
                this.createList(response);
            })
    }


    findCardType(card){
            if (card.land == true){return "land"}
            else if(card.artifact == true && card.creature == false){return "artifact"}
            else if (card.creature == true){return "creature"}
            else if (card.enchantment == true && card.creature == false && card.artifact == false){return 'enchantment'}
            else if (card.instant == true){return "instant"}
            else if (card.planeswalker == true){return "planeswalker"}
            else if (card.sorcery == true){return "sorcery"}
            else {
                return "null"
            }
    }

    addCardToList(card){
        var selectedCards = this.state.selectedCards.concat();

        var index = selectedCards.findIndex((cardObj)=>{
            return card == cardObj
        })

        if(index > -1){
            selectedCards.splice(index, 1);
        }else{

            selectedCards.push(card);
        }
        this.state.selectedCards = selectedCards.concat();
        this.getAllCardsFromDeckArchetype()
        this.getDecksDataList()
    }

    checkCard(key, index){
        var typesSeparated = Object.assign({}, this.state.typesSeparated);
        typesSeparated.typesSeparated[key].array[index].checked = !typesSeparated.typesSeparated[key].array[index].checked;


        this.addCardToList(typesSeparated.typesSeparated[key].array[index].name);
        this.setState({typesSeparated : typesSeparated});
    }



    createList(cardsList){
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
        for(var i=0; i < cardsList.length; i ++){
            if(max < cardsList[i].count){
                max = cardsList[i].count;
            }


            var index = this.state.selectedCards.findIndex((card)=>{
                return card == cardsList[i]._id;
            });

            if(index > -1){
                typesSeparated[this.findCardType(cardsList[i].cardData)].array.push( {name : cardsList[i]._id, quantity : cardsList[i].count, checked : true});
            }else{
                typesSeparated[this.findCardType(cardsList[i].cardData)].array.push( {name : cardsList[i]._id, quantity : cardsList[i].count, checked : false});
            }

        }

        for(var key in typesSeparated){
            if(!typesSeparated[key].array.length){
                delete typesSeparated[key];
            }
        }

        this.setState({typesSeparated : {maxValue : max, typesSeparated : typesSeparated}, checked : false});
    }

    componentDidMount(){
        this.getDecksDataList();
        this.getAllCardsFromDeckArchetype();
    }

    selectADeckHandle(DecksData_id){
        this.setState({DecksData_id : DecksData_id});
    }

    render(){
        return(
            <div className="ArchetypesShellsComponent">
                {this.state.typesSeparated ? <DecksCardsList typesSeparated={this.state.typesSeparated}
                                                             checkCard={this.checkCard.bind(this)}
                    /> : null}

                <div className="col-xs-3">
                    <div className="row">
                        <DecksNamesDecksDataList   DecksData_id={this.state.DecksData_id}
                                                   DecksDataList={this.state.DecksDataList}
                                                   selectADeckHandle={this.selectADeckHandle.bind(this)}
                                                   Formats_id={this.props.Formats_id}
                        />
                    </div>
                </div>
                <div className="col-xs-9">
                    <div className="row">
                        {this.state.DecksData_id != "" ?
                        <DeckAggregate DecksData_id={this.state.DecksData_id}/> : null}
                    </div>
                </div>
            </div>
        );
    }
}

