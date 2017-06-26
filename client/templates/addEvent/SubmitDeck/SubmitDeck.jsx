import React from 'react' ;
import SubmitDeckForm from "./SubmitDeckForm/SubmitDeckForm.jsx"
import SubmitTokenForm from "./SubmitTokenForm/SubmitTokenForm.jsx"



export default class SubmitDeck extends React.Component {
    constructor(){
        super();
        this.state = {
            isTokenEntered : false,
            event : {}
        }
    }

    tokenConfirmed(event){
        this.setState({
            isTokenEntered : true,
            token : event.token,
            Event : event
        })
    }

    deckSubmitted(){
        this.setState({
            isTokenEntered : false,
            event : {}
        })
    }

    resetAll(){
        this.setState({
            isTokenEntered : false,
            event : {}
        })
    }


    render() {
        return (
            <div className="SubmitDeckComponent">
                <h3>Add Deck To Event</h3>
                {this.state.isTokenEntered ? <SubmitDeckForm event={this.state.Event}
                                                             deckSubmitted={this.deckSubmitted.bind(this)}
                                                             resetAll={this.resetAll.bind(this)}
                    />
                    :
                    <SubmitTokenForm tokenConfirmed={this.tokenConfirmed.bind(this)}/>}
            </div>


        )
    }
}
