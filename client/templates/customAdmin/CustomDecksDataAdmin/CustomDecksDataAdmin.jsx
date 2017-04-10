import React from 'react' ;
import DecksWithoutNamesWrapper from "./DecksWithoutNames/DecksWithoutNamesWrapper.jsx"
import StateList from "/client/dumbReact/StatesList/StateList.jsx"
import DecksWithWrongCardsContainer from "./DecksWithWrongCards/DecksWithWrongCardsContainer.jsx"
import FixBannedDecksdata from "./fixBannedDecksdata/fixBannedDecksdata.jsx"
import ShowDecksDataByName from "./ShowDecksDataByName/ShowDecksDataByName.jsx"
import DecksDataMethodsButtons from "./DecksDataMethodsButtons/DecksDataMethodsButtons.jsx"


export default class CustomDecksDataAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {
            showModal: false
        }
    }

    componentDidMount(){

    }

    render(){
        return (
            <div className="CustomDecksDataAdminContainer">
                <StateList  Method="getDecksDataStateQty"
                            collection="DecksData"
                            states={["lgs", "scraped", "match", "perfect", "manual", "nameRemoved", "shell"]}
                            Formats_id={this.props.Formats_id}
                />
                <FixBannedDecksdata Formats_id={this.props.Formats_id}/>
                <DecksDataMethodsButtons Formats_id={this.props.Formats_id} />
                <DecksWithoutNamesWrapper Formats_id={this.props.Formats_id}/>
                <ShowDecksDataByName Formats_id={this.props.Formats_id}/>
                <DecksWithWrongCardsContainer Formats_id={this.props.Formats_id}/>
            </div>
        )
    }
}
