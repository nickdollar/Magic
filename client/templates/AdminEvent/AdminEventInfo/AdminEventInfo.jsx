import React from 'react' ;
import AdminEventPlayerList from './AdminEventPlayerList/AdminEventPlayerList.jsx';


export default class EventInfo extends React.Component {
    constructor(){
        super();

    }

    confirmPassword(){

    }

    render() {
        if(this.props.collectionLoading){
            return <div>Loading</div>
        }
        return (
            <div>
                <AdminEventPlayerList   decks={this.props.decks}
                                        event={this.props.event}
                />
            </div>
        )
    }
}

