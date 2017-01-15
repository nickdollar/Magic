import React from 'react' ;
import SubmitDeck from './submitDeck/SubmitDeck.jsx';
import CreateEvent from './createEvent/CreateEvent.jsx';


class AddEvent extends React.Component{


    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){

        return (
            <div >
                <SubmitDeck />
                <CreateEvent />
            </div>
        )
    }
}

export default AddEvent;