import React from 'react' ;
import SubmitDeckForm from "./SubmitDeckForm.jsx"
import SubmitTokenFormContainer from "./SubmitTokenFormContainer.jsx"


class SubmitDeck extends React.Component {
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
        console.log("deckSubmitted");
        this.setState({
            isTokenEntered : false,
            event : {}
        })
    }



    render() {
        return (
            <div className="addNameToEvent">
                {this.state.isTokenEntered ? <SubmitDeckForm event={this.state.Event}
                                                             deckSubmitted={this.deckSubmitted.bind(this)}/>
                    :
                    <SubmitTokenFormContainer tokenConfirmed={this.tokenConfirmed.bind(this)}/>}
            </div>


        )
    }
}

export default SubmitDeck;