import React from 'react' ;
import ImportByFile from './SubmitInput/ImportByFile/ImportByFile.jsx' ;
import ImportByDeckContainer from './SubmitInput/ImportByDeck/ImportByDeckContainer.jsx' ;
import DeckAndSideboardInput from './SubmitInput/DeckAndSideboardInput/DeckAndSideboardInput.jsx' ;



export default class SubmitDeckForm extends React.Component {
    constructor(){
        super();
        this.state = {
            deck : {
                main : [],
                sideboard : [],
                theEventExists : false
            }
        }
    }

    setDeck(deck){
        var temp = Object.assign({}, deck);
        this.setState({deck : temp})
    }

    render() {
        return (
            <div className="SubmitDeckFormComponent">
                <button onClick={this.props.resetAll}>Close Form</button>
                <ImportByFile setDeck={this.setDeck.bind(this)}/>
                <ImportByDeckContainer setDeck={this.setDeck.bind(this)}/>
                <DeckAndSideboardInput  deck={this.state.deck}
                                        event = {this.props.event}
                />
            </div>
        )
    }
}
