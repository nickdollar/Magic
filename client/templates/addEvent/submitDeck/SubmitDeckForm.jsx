import React from 'react' ;
import ImportByUrl from './SubmitInput/ImportByUrl.jsx' ;
import ImportByFile from './SubmitInput/ImportByFile.jsx' ;
import ImportByDeckContainer from './SubmitInput/ImportByDeckContainer.jsx' ;
import DeckAndSideboardInput from './SubmitInput/DeckAndSideboardInput.jsx' ;


class SubmitDeckForm extends React.Component {
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
        console.log(deck);
        var temp = Object.assign({}, deck);
        this.setState({deck : temp})
    }




    render() {
        return (
            <div>
                <ImportByUrl setDeck={this.setDeck.bind(this)}/>
                <ImportByFile setDeck={this.setDeck.bind(this)}/>
                <ImportByDeckContainer setDeck={this.setDeck.bind(this)}/>
                <DeckAndSideboardInput  deck={this.state.deck}
                                        event = {this.props.event}
                />
            </div>
        )
    }
}

export default SubmitDeckForm;