import React from 'react' ;
import ArchetypeDeckInformationHeader from "./ArchetypeDeckInformationHeader/ArchetypeDeckInformationHeader.jsx"
import DecksNamesList from "./DecksNamesList/DecksNamesList.jsx"
import DeckTableExampleContainer from "./DeckTableExample/DeckTableExampleContainer.jsx"



export default class ArchetypeDeckInformationExit extends React.Component {
    constructor(){
        super();

    }

    selectedDecksNames(){

    }

    render(){
        if(this.props.listLoading){
            return <div>Loading...</div>
        }
        return(

            <div className="ArchetypeDeckInformationComponent">
                <ArchetypeDeckInformationHeader format={this.props.format}
                                                   archetype={this.props.archetype}
                />

                <DecksNamesList decksNames={this.props.decksNames}
                                  archetype={this.props.archetype}
                />

                {this.props.flowRouterDeckSelected ?
                    <DeckTableExampleContainer flowRouterDeckSelected={this.props.flowRouterDeckSelected}
                                      format={this.props.format}
                    /> :
                    null}
            </div>
        );
    }
}