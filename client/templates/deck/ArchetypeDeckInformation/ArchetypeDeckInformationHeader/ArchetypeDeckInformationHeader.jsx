import React from 'react' ;

export default class ArchetypeDeckInformationHeader extends React.Component {
    constructor(){
        super();

    }

    archetypeInfo(DeckArchetype){
        return  <div className="deckArchetypeWrapper">
                    <h1>
                        {DeckArchetype.name}
                    </h1>
                    <div className="archetypeMana" dangerouslySetInnerHTML={{__html : getHTMLColorsFromArchetypes(DeckArchetype._id)}}>
                    </div>
                    <div className="archetypeType">
                        {DeckArchetype.type}
                    </div>
                </div>
    }

    render(){
        if(this.props.listLoading){
            return <div>Loading...</div>
        }

        return(
            <div className="ArchetypeDeckInformationHeaderComponent">
                <div className="archetypeInfo">
                    {this.archetypeInfo(this.props.archetype)}
                    <div className="information">

                        <div className="type"></div>
                    </div>
                </div>
            </div>
        );
    }
}