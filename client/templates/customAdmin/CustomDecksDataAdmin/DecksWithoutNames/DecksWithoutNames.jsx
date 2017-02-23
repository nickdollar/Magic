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
        this.setState({showModal : true, DecksData_id : this.props.DecksList[i]._id, format : this.props.DecksList[i].format});
    }

    handleHideModal(){
        this.setState({showModal: false})
    }




    render(){
        console.log(this.props.DecksList);
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
                            <th>
                                Colors
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.DecksList.map((deck, i)=>{
                        return <tr key={deck._id}>
                            <td onClick={this.selectDeck.bind(this, i)}>{deck._id}</td>
                            <td>{deck.state}</td>
                            <td>{deck.colors.B}{deck.colors.C}{deck.colors.G}{deck.colors.R}{deck.colors.U}{deck.colors.W}</td>
                        </tr>
                    })}

                    </tbody>
                </table>

                <ModalFirstPage showModal={this.state.showModal}
                                handleHideModal={this.handleHideModal.bind(this)}
                >
                    <DecksNamesListSubmitContainer DecksData_id={this.state.DecksData_id} format={this.state.format}/>
                    <DeckListPercentage DecksData_id={this.state.DecksData_id} />
                    <DeckContainer DecksData_id={this.state.DecksData_id} />
                </ModalFirstPage>
            </div>
        )
    }
}
