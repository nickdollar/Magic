import React from 'react' ;

export default class CustomNewestAdmin extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CustomNewestAdminComponent">
                <button onClick={()=>Meteor.call("createMetaNewThingsDaysAllFormatsMethod")}>createMetaNewThingsDaysAllFormats</button>
            </div>
        );
    }
}