import { createContainer } from 'meteor/react-meteor-data';
import DecksWithWrongCards from './DecksWithWrongCards.jsx';

export default DecksWithWrongCardsContainer = createContainer(({Formats_id}) => {
    var handle = Meteor.subscribe("DecksDataLeagueDailyWithWrongCardsNameQuantity", Formats_id);

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