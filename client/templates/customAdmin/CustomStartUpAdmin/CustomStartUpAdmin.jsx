import React from 'react' ;

export default class CustomStartUpAdmin extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CustomStartUpAdminComponent">
                <button onClick={()=>Meteor.call("downloadAllDecksMethods")}>downloadAllDecksMethods</button>
            </div>
        );
    }
}