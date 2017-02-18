import { createContainer } from 'meteor/react-meteor-data';
import DecksWithWrongCards from './DecksWithWrongCards.jsx';

export default DecksWithWrongCardsContainer = createContainer(({format}) => {
    var handle = Meteor.subscribe("DecksDataLeagueDailyWithWrongCardsNameQuantity", format);

    return {
        currentUser: Meteor.user(),
        listLoading: ! handle.ready(),
        DecksWithWrongCards : DecksData.find({
            $or :    [
                        {"main.wrongName" : true},
                        {"sideboard.wrongName" : true}
                    ]
        }).fetch()
    };
}, DecksWithWrongCards);