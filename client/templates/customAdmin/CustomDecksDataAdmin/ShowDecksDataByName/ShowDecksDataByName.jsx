import React from 'react' ;
import ModalFirstPage from '/client/dumbReact/Modal/ModalFirstPage.jsx';
import DecksNamesListSubmitContainer from "/client/dumbReact/DeckNameListSubmit/DeckNameListSubmitContainer.jsx";
import DeckContainer from '/client/dumbReact/Deck/DeckContainer' ;
import DecksDataTableContainer from './DecksDataTableContainer/DecksDataTableContainer';


export default class ShowDecksDataByName extends React.Component {
    constructor(){
        super();
        this.state = {decksNamesList : [], DecksNames_id : null}
    }

    createSelect2(){
        $(".js-decksNamesList").off("select2");
        $(".js-decksNamesList").select2();


        $('.js-decksNamesList').off("select2:select");
        $('.js-decksNamesList').on("select2:select", (evt)=> {
            this.setState({DecksNames_id : evt.params.data.id})
        });
    }

    getDecksNamesList(Formats_id){
        Meteor.call("getDecksNamesByFormat", Formats_id, (err, data)=>{
            this.setState({decksNamesList : data})
        })
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.Formats_id != this.props.Formats_id){
            this.getDecksNamesList(nextProps.Formats_id);
        }
    }

    componentDidMount(){
        this.createSelect2();
        this.getDecksNamesList(this.props.Formats_id);
    }

    handleHideModal(){
        this.setState({showModal: false})
    }

    selectDeck(DecksData_id){
        this.setState({showModal : true, DecksData_id : DecksData_id, Formats_id : this.props.Formats_id});
    }

    render(){
        return(
            <div className="ShowDecksDataByNameComponent">
                <h3>Show Cards By Decks Names</h3>
                <div>
                    <select className="js-decksNamesList" style={{width : "100%"}}>
                        <option></option>
                        {this.state.decksNamesList.map((deckName)=>{
                            return <option key={deckName._id} value={deckName._id}>{deckName.name}</option>
                        })}
                    </select>
                </div>
                <DecksDataTableContainer selectDeck={this.selectDeck.bind(this)}
                                         DecksNames_id={this.state.DecksNames_id}
                />
                <ModalFirstPage showModal={this.state.showModal}
                                handleHideModal={this.handleHideModal.bind(this)}
                >
                    <DecksNamesListSubmitContainer DecksData_id={this.state.DecksData_id} Formats_id={this.state.Formats_id}/>
                    <DeckContainer DecksData_id={this.state.DecksData_id} />
                </ModalFirstPage>
            </div>
        );
    }
}