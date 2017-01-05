import { createContainer } from 'meteor/react-meteor-data';
import DeckList from './DeckList.jsx';

export default DecklistContainer = createContainer(({deck, setDeck, changeCardDeck, removeCardDeck, addCardDeck}) => {
    var cards = deck.main.map((card)=>{
        return card.name
    })
    
    cards = cards.concat(deck.sideboard.map((card)=>{
        return card.name
    }))

    var uniqueCards = cards.unique();
    var handle = Meteor.subscribe("cardsFromArray", uniqueCards);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        CardsData: CardsData.find().fetch(),
        deck : deck,
        setDeck : setDeck,
        changeCardDeck : changeCardDeck,
        removeCardDeck : removeCardDeck,
        addCardDeck : addCardDeck
    };
}, DeckList);