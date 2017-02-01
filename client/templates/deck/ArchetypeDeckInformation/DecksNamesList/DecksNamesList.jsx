import React from 'react' ;

export default class DecksNamesList extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="DecksNamesListComponent"    format={FlowRouter.getParam("format")}
                                                        archetype={FlowRouter.getParam("archetype")}
            >
            </div>
        );
    }
}