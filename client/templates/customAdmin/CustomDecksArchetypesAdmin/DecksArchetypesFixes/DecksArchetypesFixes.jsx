import React from 'react' ;

export default class DecksArchetypesFixesFixes extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="DecksArchetypesFixesComponent">
                <button onClick={Meteor.call("DecksArchetypesformatToFormats_idMethod")}>DecksArchetypesformatToFormats_idMethod</button>
            </div>
        );
    }
}