import React from 'react' ;

export default class CustomZipCodesAdmin extends React.Component {
    constructor(){
        super();
    }

    makeZipCollection(){
        Meteor.call("makeZipCollection");
    }

    render(){
        return(
            <div className="CustomZipCodesAdminComponent">
                <button onClick={this.makeZipCollection}>Click Button</button>
            </div>
        );
    }
}