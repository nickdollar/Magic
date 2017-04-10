import React from 'react' ;

export default class ArchetypeDeckInformationHeader extends React.Component {
    constructor(){
        super();

    }

    archetypeInfo(DeckArchetype){
        return  <div className="deckArchetypeWrapper">
                    <h1>
                        {DeckArchetype.name}
                        <div className="archetypeMana" >
                            {getHTMLColorsFromArchetypesReact(DeckArchetype._id)}
                        </div>
                    </h1>

                    <div className="archetypeType">
                        {DeckArchetype.type}
                    </div>
                </div>
    }

    render(){
        return(
            <div className="ArchetypeDeckInformationHeaderComponent">
                <div className="archetypeInfo">
                    {this.archetypeInfo(this.props.DeckArchetype)}
                    <div className="information">
                        <div className="type"></div>
                    </div>
                </div>
            </div>
        );
    }
}