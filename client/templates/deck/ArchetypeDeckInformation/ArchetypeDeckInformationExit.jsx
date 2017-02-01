import React from 'react' ;
import ArchetypeDeckInformationHeader from "./ArchetypeDeckInformationHeader/ArchetypeDeckInformationHeader.jsx"

export default class ArchetypeDeckInformation extends React.Component {
    constructor(){
        super();

    }

    render(){
        console.log(this.props);
        return(
            <div className="ArchetypeDeckInformationComponent">
                <ArchetypeDeckInformationHeader></ArchetypeDeckInformationHeader>
            </div>
        );
    }
}