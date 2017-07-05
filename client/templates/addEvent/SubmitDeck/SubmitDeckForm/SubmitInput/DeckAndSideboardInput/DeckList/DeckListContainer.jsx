import { createContainer } from 'meteor/react-meteor-data';
import DeckList from './DeckList.jsx';

export default DecklistContainer = createContainer(({deck}) => {
    console.log("DecklistContainer");
    var cards = deck.main.map((card)=>{
        return card.Cards_id
    })
    cards = cards.concat(deck.sideboard.map((card)=>{
        return card.Cards_id
    }))

    var uniqueCards = cards.unique();
    var handle = Meteor.subscribe("cardsFromArray", uniqueCards);

    return {
        listLoading: ! handle.ready(),

    };
}, DeckList);