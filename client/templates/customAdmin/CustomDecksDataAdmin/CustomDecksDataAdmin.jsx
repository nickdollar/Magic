import React from 'react' ;
import DecksWithoutNamesWrapper from "./DecksWithoutNames/DecksWithoutNamesWrapper.jsx"
import StateListContainer from "/client/dumbReact/StatesList/StateListContainer.jsx"

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
                                    states={["lgs", "scraped", "best", "match", "manual"]}
                                    format={this.props.format}
                />
                <DecksWithoutNamesWrapper format={this.props.format}/>
            </div>
        )
    }
}
