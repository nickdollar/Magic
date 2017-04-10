import React from 'react' ;
import ModalFirstPage from '/client/dumbReact/Modal/ModalFirstPage.jsx';
import DeckContainer from '/client/dumbReact/Deck/DeckContainer' ;
import DecksNamesListSubmitContainer from "/client/dumbReact/DeckNameListSubmit/DeckNameListSubmitContainer.jsx";
import DeckListPercentage from "/client/dumbReact/DeckListPercentage/DeckListPercentage.jsx";

export default class DecksWithoutNames extends React.Component{
    constructor(props){
        super();
        this.state = {
            DecksData_id : null,
            showModal: false
        }
    }

    componentDidMount(){

    }

    selectDeck(i){
        this.setState({showModal : true, DecksData_id : this.props.DecksList[i]._id, Formats_id : this.props.DecksList[i].Formats_id});
    }

    handleHideModal(){
        this.setState({showModal: false})
    }

    render(){
        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                _id
                            </th>
                            <th>
                                State
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                    {this.props.DecksList.map((deck, i)=>{
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
                    <DecksNamesListSubmitContainer DecksData_id={this.state.DecksData_id} Formats_id={this.state.Formats_id}/>
                    <DeckListPercentage DecksData_id={this.state.DecksData_id} />
                    <DeckContainer DecksData_id={this.state.DecksData_id} />
                </ModalFirstPage>
            </div>
        )
    }
}
