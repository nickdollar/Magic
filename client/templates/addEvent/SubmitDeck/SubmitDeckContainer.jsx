import { createContainer } from 'meteor/react-meteor-data';
import SubmitDeck from './SubmitDeck.jsx';

export default SubmitDeckContainer = createContainer(({ params }) => {
    console.log("params");
    return {
        LGS: LGS.find().fetch(),
    };
}, SubmitDeck);