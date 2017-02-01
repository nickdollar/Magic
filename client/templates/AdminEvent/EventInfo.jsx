import React from 'react' ;
import PlayerList from './PlayerList';
class EventInfo extends React.Component {
    constructor(){
        super();

    }

    confirmPassword(){

    }

    render() {
        return (
            <div>
                <PlayerList decks={this.props.decks}
                            event={this.props.event}
                />
            </div>
        )
    }
}

export default EventInfo;