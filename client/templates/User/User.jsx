import React from 'react' ;
import Collection from './Collection/Collection';
import UsersDecks from './UsersDecks/UsersDecks';



export default class User extends React.Component {
    constructor(){
        super();
    }

    render(){
        return(
            <div className="UserComponent">
                <Collection/>
                <UsersDecks/>
            </div>
        );
    }
}