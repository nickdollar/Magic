import React from 'react' ;
import Collection from './Collection/Collection';

export default class User extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="UserComponent">
                <Collection/>
            </div>
        );
    }
}