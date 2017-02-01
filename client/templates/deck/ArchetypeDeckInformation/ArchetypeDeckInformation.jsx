import React from 'react' ;
import ArchetypeDeckInformationEntryContainer from './ArchetypeDeckInformationEntryContainer.jsx' ;


export default class ArchetypeDeckInformation extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
                <ArchetypeDeckInformationEntryContainer format={FlowRouter.getParam("format")}
                                                        archetype={FlowRouter.getParam("archetype")}
                />
        );
    }
}