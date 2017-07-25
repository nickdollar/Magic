import React from 'react' ;
import DecksWithoutNamesWrapper from "./DecksWithoutNames/DecksWithoutNamesWrapper.jsx"
import StateList from "/client/dumbReact/StatesList/StateList.jsx"
import DecksWithWrongCardsContainer from "./DecksWithWrongCards/DecksWithWrongCardsContainer.jsx"
import FixBannedDecksdata from "./fixBannedDecksdata/fixBannedDecksdata.jsx"
import DecksDataMethodsButtons from "./DecksDataMethodsButtons/DecksDataMethodsButtons.jsx"
import DecksDataByDecksArchetypes_id from './DecksDataByDecksArchetypes_id/DecksDataByDecksArchetypes_id.jsx' ;


export default class CustomDecksDataAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {
            showModal: false
        }
    }

    render(){
        return (
            <div className="CustomDecksDataAdminContainer">
                <StateList  Method="getDecksDataStateQtyMethod"
                            collection="DecksData"
                            Formats_id={this.props.Formats_id}
                />
                <FixBannedDecksdata Formats_id={this.props.Formats_id}/>
                {/*<DecksDataMethodsButtons Formats_id={this.props.Formats_id} />*/}
                <DecksWithoutNamesWrapper Formats_id={this.props.Formats_id}/>
                {/*<DecksWithWrongCardsContainer Formats_id={this.props.Formats_id}/>*/}
                {/*<DecksDataByDecksArchetypes_id Formats_id={this.props.Formats_id}/>*/}
                <button onClick={()=>{Meteor.call("fixNamesToCards_idMethod")}}>fixNamesToCards_idMethod</button>
            </div>
        )
    }
}
