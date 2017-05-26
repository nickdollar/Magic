import React from 'react' ;
import ImportByFile from './SubmitInput/ImportByFile/ImportByFile.jsx' ;
import DeckAndSideboardInput from './SubmitInput/DeckAndSideboardInput/DeckAndSideboardInput.jsx' ;



export default class SubmitDeckForm extends React.Component {
    constructor(){
        super();
        this.state = {
            UsersDeckData : { main : [], sideboard : [] }
        }
    }
    render() {
        return (
            <div className="SubmitDeckFormComponent">
                <button onClick={this.props.resetAll}>Close Form</button>
                {/*<ImportByFile setDeck={this.setDeck.bind(this)}/>*/}

                <DeckAndSideboardInput  UsersDeckData={this.state.UsersDeckData}
                                        event = {this.props.event}
                />
            </div>
        )
    }
}
