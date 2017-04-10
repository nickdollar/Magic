import React from 'react' ;
import ArchetypeDeckInformationHeader from "./ArchetypeDeckInformationHeader/ArchetypeDeckInformationHeader.jsx"
import DecksNamesList from "./DecksNamesList/DecksNamesList.jsx"
import DeckTableExample from "./DeckTableExample/DeckTableExample.jsx"
import ArchetypesShells from "./ArchetypesShells/ArchetypesShells"

export default class ArchetypeDeckInformationExit extends React.Component {
    constructor(props){
        super();
        var DeckArchetypeQuery = DecksArchetypes.findOne({Formats_id : props.Formats_id, link : props.DeckArchetypeLink});
        var DecksNamesQuery = DecksNames.find({DecksArchetypes_id : DeckArchetypeQuery._id}).fetch();
        this.state = {beta : false, DeckArchetype : DeckArchetypeQuery, DecksNames : DecksNamesQuery, DeckName : DecksNames.findOne({link : props.DeckNameLink})};
    }

    changeToBeta(){
        if(this.state.beta== false){
            this.setState({beta : true})
        }else{
            this.setState({beta : false})
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.DeckNameLink != nextProps.DeckNameLink){
            this.setState({DeckName : DecksNames.findOne({link : nextProps.DeckNameLink})})
        }
    }

    render(){
        return(
            <div className="ArchetypeDeckInformationComponent">
                <input type="checkbox" onChange={this.changeToBeta.bind(this)} checked={this.state.beta}/>Beta
                <ArchetypeDeckInformationHeader DeckArchetype={this.state.DeckArchetype}/>
                {this.state.beta ?
                    <ArchetypesShells Formats_id={this.props.Formats_id}
                                      DeckArchetype={this.state.DeckArchetype}
                    />
                    :
                    <div>
                        <DecksNamesList DecksNames={this.state.DecksNames}
                                        DeckArchetype={this.state.DeckArchetype}
                        />
                        {this.state.DeckName ?
                            <DeckTableExample DeckName={this.state.DeckName}/> :
                            null
                        }
                    </div>
                }
            </div>
        );
    }
}