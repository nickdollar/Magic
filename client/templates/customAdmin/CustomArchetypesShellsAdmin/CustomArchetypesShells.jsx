import React from 'react' ;

export default class CustomArchetypesShells extends React.Component {
    constructor(){
        super();

    }

    makeShells(){
        Meteor.call("createShellForFormat", this.props.format)
    }

    render(){
        return(
            <div className="CustomArchetypesShellsComponent">
                <button onClick={this.makeShells.bind(this)}>Make Shells</button>
            </div>
        );
    }
}