import React from 'react' ;
import ModalFirstPage from '/client/dumbReact/Modal/ModalFirstPage.jsx';
import DecksArchetypesListSubmit from "/client/dumbReact/DecksArchetypesListSubmit/DecksArchetypesListSubmit.jsx";
import DeckAggregate from "/client/dumbReact/DeckAggregate/DeckAggregate.jsx";
import FoundDeckListArchetypeOption from "./FoundDeckListArchetypeOption/FoundDeckListArchetypeOption.jsx";




export default class DecksWithoutArchetypes extends React.Component{
    constructor(props){
        super();
        this.state = {
            showModal: false,
        }
    }

    selectDeck(i){
        this.setState({showModal : true, DecksData_id : this.props.DecksList[i]._id});
    }

    handleHideModal(){
        this.setState({showModal: false})
    }

    render(){
        return (
            <div>
                <table className="table">
                    <thead>
                        <tr><th>_id</th><th>State</th></tr>
                    </thead>
                    <tbody>
                    {this. props.DecksList.map((deck, i)=>{
                        return <tr key={deck._id}>
                            <td onClick={this.selectDeck.bind(this, i)}>{deck._id}</td>
                            <td>{deck.state}</td>
                        </tr>
                    })}

                    </tbody>
                </table>
                <ModalFirstPage showModal={this.state.showModal}
                                handleHideModal={this.handleHideModal.bind(this)}
                >
                    <DecksArchetypesListSubmit DecksData_id={this.state.DecksData_id}
                                               Formats_id={this.props.Formats_id}
                                               getDecks={this.props.getDecks}
                    />
                    <FoundDeckListArchetypeOption DecksData_id={this.state.DecksData_id}
                                                  getDecks={this.props.getDecks}
                    />

                    <DeckAggregate DecksData_id={this.state.DecksData_id} />
                </ModalFirstPage>
            </div>
        )
    }
}
