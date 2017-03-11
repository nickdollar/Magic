import React from 'react' ;
import ArchetypeDeckInformationHeader from "./ArchetypeDeckInformationHeader/ArchetypeDeckInformationHeader.jsx"
import DecksNamesList from "./DecksNamesList/DecksNamesList.jsx"
import DeckTableExample from "./DeckTableExample/DeckTableExample.jsx"
import ArchetypesShells from "./ArchetypesShells/ArchetypesShells"



export default class ArchetypeDeckInformationExit extends React.Component {
    constructor(){
        super();
        this.state = {beta : false}

    }

    selectedDecksNames(){

    }

    changeToBeta(){
        if(this.state.beta== false){
            this.setState({beta : true})
        }else{
            this.setState({beta : false})
        }

    }

    render(){
        if(this.props.listLoading){
            return <div>Loading...</div>
        }
        return(
            <div className="ArchetypeDeckInformationComponent">
                <input type="checkbox" onChange={this.changeToBeta.bind(this)} checked={this.state.beta}/>Beta
                <ArchetypeDeckInformationHeader format={this.props.format}
                                                   archetype={this.props.archetype}
                />

                {this.state.beta ?
                    <ArchetypesShells/>
                    :
                    <div>
                        <DecksNamesList decksNames={this.props.decksNames}
                                        archetype={this.props.archetype}
                        />
                        {this.props.flowRouterDeckSelected ?
                            <DeckTableExample flowRouterDeckSelected={this.props.flowRouterDeckSelected}
                                              format={this.props.format}
                            /> :
                            null
                        }
                    </div>

                }

            </div>
        );
    }
}