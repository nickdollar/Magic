import React from 'react' ;
import ImportByFile from './SubmitInput/ImportByFile/ImportByFile.jsx' ;
import ImportByDeckContainer from './SubmitInput/ImportByDeck/ImportByDeckContainer.jsx' ;
import DeckAndSideboardInput from './SubmitInput/DeckAndSideboardInput/DeckAndSideboardInput.jsx' ;



export default class SubmitDeckForm extends React.Component {
    constructor(){
        super();
        this.state = {
            UsersDeckData : { main : [], sideboard : [] }
        }
    }



    setDeck(deck){
        var temp = Object.assign({}, deck);
        this.setState({deck : temp})
    }


    componentDidMount(){
    }

    render() {
        return (
            <div className="SubmitDeckFormComponent">
                <button onClick={this.props.resetAll}>Close Form</button>
                {/*<ImportByFile setDeck={this.setDeck.bind(this)}/>*/}
                <ImportByDeckContainer setDeck={this.setDeck.bind(this)}/>
                <DeckAndSideboardInput  UsersDeckData={this.state.UsersDeckData}
                                        event = {this.props.event}
                />
            </div>
        )
    }
}
