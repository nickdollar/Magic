import React from 'react' ;
import EventsStatesContainer from "./EventsStates/EventsStatesContainer.jsx"
import AddEventToCollection from "./AddEventToCollection/AddEventToCollection.jsx"

export default class CustomAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){
        return (
            <div>
                <EventsStatesContainer/>
                <AddEventToCollection/>

            </div>
        )
    }
}
