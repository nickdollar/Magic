import React from 'react' ;
import DecksWithoutNamesWrapper from "./DecksWithoutNames/DecksWithoutNamesWrapper.jsx"
import StateListContainer from "/client/dumbReact/StatesList/StateListContainer.jsx"
import DecksDataMethodsButtons from "./DecksDataMethodsButtons/DecksDataMethodsButtons.jsx"
import DecksWithWrongCardsContainer from "./DecksWithWrongCards/DecksWithWrongCardsContainer.jsx"

export default class CustomDecksDataAdmin extends React.Component{
    constructor(props){
        super();
    }

    componentDidMount(){

    }

    render(){
        return (
            <div>
                <StateListContainer collection="DecksData"
                                    subscription="DecksDataStatesList"
                                    notState={[]}
                                    states={["lgs", "scraped", "match", "perfect", "manual"]}
                                    format={this.props.format}
                />
                <DecksDataMethodsButtons format={this.props.format} />
                <DecksWithoutNamesWrapper format={this.props.format}/>
                <DecksWithWrongCardsContainer format={this.props.format}/>

            </div>
        )
    }
}
