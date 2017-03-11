import React from 'react' ;
import DecksWithoutNamesWrapper from "./DecksWithoutNames/DecksWithoutNamesWrapper.jsx"
import StateListContainer from "/client/dumbReact/StatesList/StateListContainer.jsx"
import DecksDataMethodsButtons from "./DecksDataMethodsButtons/DecksDataMethodsButtons.jsx"
import DecksWithWrongCardsContainer from "./DecksWithWrongCards/DecksWithWrongCardsContainer.jsx"
import FixBannedDecksdata from "./fixBannedDecksdata/fixBannedDecksdata.jsx"
import ShowDecksDataByName from "./ShowDecksDataByName/ShowDecksDataByName.jsx"


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
                <StateListContainer collection="DecksData"
                                    subscription="DecksDataStatesList"
                                    notState={[]}
                                    states={["lgs", "scraped", "match", "perfect", "manual", "nameRemoved", "shell"]}
                                    format={this.props.format}
                />
                <FixBannedDecksdata format={this.props.format}/>
                <DecksDataMethodsButtons format={this.props.format} />
                <DecksWithoutNamesWrapper format={this.props.format}/>
                <ShowDecksDataByName format={this.props.format}/>

                <DecksWithWrongCardsContainer format={this.props.format}/>
            </div>
        )
    }
}
